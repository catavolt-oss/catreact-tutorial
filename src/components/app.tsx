/**
 * Created by rburson on 6/17/2017
 *
 * Tutorial app using Catavolt's React Component library
 * More examples and docs at: https://github.com/catavolt-oss/catreact-examples
 */

/** Import the the base react module */
import * as React from 'react'

/** Import the react dom module since we'll render the app to page in this module */
import * as ReactDOM from 'react-dom'

/** Import the Catavolt React components that we'll use */
import {
    CatavoltPane, CvAppWindow, CvEvent, CvLoginResult, CvLogout, CvContext, CvLogoutCallback, CvWorkbench, CvLauncher,
    CvNavigationResult, CvLaunchActionCallback, CvWorkbenchMenu
} from 'catreact'

/** Import the Catavolt Javascript API objects that we'll use */
import {Log, LogLevel, Workbench, WorkbenchLaunchAction} from 'catavolt-sdk'

import {CvLoginPanel} from "catreact-html";

import {Router, hashHistory, Route, IndexRoute} from "react-router";

/** At this level the console will show all requests and responses to and from the Catavolt server */
Log.logLevel(LogLevel.DEBUG);

/**
 * **********************************
 *      Begin Application Code
 *  *********************************
 */

const CatreactAppBase = {

    contextTypes: {
        router: React.PropTypes.object
    },

};

const CatreactApp = React.createClass({

   mixins: [CatreactAppBase],

    render: function () {
        return (
            <div className="container">
                <CatavoltPane enableResourceCaching={true}>
                    <div>
                        {this.props.children}
                    </div>
                </CatavoltPane>
            </div>
        );
    }
});

const CatreactLogin = React.createClass({

    mixins: [CatreactAppBase],

    render: function () {
        return <div className="login-wrapper">
            <div className="login-logo"/>
            <CvLoginPanel
                defaultGatewayUrl={'www.catavolt.net'}
                defaultTenantId={'cvtutorial'}
                defaultUserId={'wsmith'}
                defaultPassword={'biznes1'}
                showTenantId={false}
                showDirectUrl={false}
                showGatewayUrl={false}
                showClientType={false}
                loginListeners={[(event:CvEvent<CvLoginResult>)=>{
                    const sessionId = event.resourceId;  //get the session from the LoginEvent
                    this.context.router.replace('/window/' + sessionId);
                }]}
            />
        </div>
    }
});

/**
 *  Add our new component, CatreactNavbar
 */
const CatreactWindow = React.createClass({

    mixins: [CatreactAppBase],

    render: function () {
        const windowId = this.props.params.windowId; //get the windowId (sessionId)
        return <CvAppWindow windowId={windowId}>
            <div>
                <div className="primary-logo text-left"/>
                <div className="top-nav text-right">
                    <CvLogout renderer={(cvContext:CvContext, callback:CvLogoutCallback)=>{
                            return <div className="click-target"><a onClick={callback.logout}>Logout</a></div>
                        }}
                        logoutListeners={[()=>{ this.context.router.replace('/');}]}
                    />
                </div>
                <div className="workbench-navbar bg-color1">
                    <div className="workbench-tab-menu">
                        <CatreactNavbar windowId={windowId}/>
                    </div>
                </div>
                {this.props.children}
            </div>
        </CvAppWindow>;
    }
});

/**
 *  Set up an item on our 'Navigation Bar' which is actually one of our Workbench Launchers
 *  Use the workbenchId and the launcherId to target them with the corresponding components
 *  Fire the launcher action when the user clicks via the supplied callback object from the CvLauncher's
 *  renderer function.
 */
const CatreactNavbar = React.createClass<{windowId},{}>({

    mixins: [CatreactAppBase],

    render: function () {
        const windowId = this.props.windowId; //get the window from the url param

        return (
            <CvWorkbench workbenchId={"AAABACffAAAAAE8X"} renderer={(cvContext:CvContext)=>{
                const workbench:Workbench = cvContext.scopeCtx.scopeObj as Workbench;
                return (
                    <ul className="nav nav-pills">
                        <CvLauncher actionId={"AAABACfaAAAAAKE8"}
                            renderer={(cvContext:CvContext, callback:CvLaunchActionCallback)=>{
                                const launcher:WorkbenchLaunchAction = cvContext.scopeCtx.scopeObj;
                                return <li onClick={()=>{callback.fireLaunchAction()}}>
                                    <a className="click-target">{launcher.name}</a>
                                </li>
                            }}
                        />
                    </ul>
                );
            }}/>
        );
    }

});


/**
 * Render the example to the document
 */

const app = (
    <Router history={hashHistory}>
        <Route path="/" component={CatreactApp}>
            <IndexRoute component={CatreactLogin}/>
            <Route path="/window/:windowId" component={CatreactWindow}/>
        </Route>
    </Router>
);

ReactDOM.render(app, document.getElementById('catreactApp'));


