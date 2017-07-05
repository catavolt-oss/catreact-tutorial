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
    CatavoltPane, CvAppWindow, CvEvent, CvLoginResult, CvLogout, CvContext, CvLogoutCallback
} from 'catreact'

/** Import the Catavolt Javascript API objects that we'll use */
import { Log, LogLevel } from 'catavolt-sdk'

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


/**
 * Replace the earlier 'callback' with a change to the URL via the router
 */
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
 *
 * The 'params' prop is now made available by the router to access our URL params
 * Here we access the supplied 'windowId'
 *
 * Also - Replace the earlier 'callback' with a change to the URL via the router
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
                    <div className="workbench-tab-menu"></div>
                </div>
                {this.props.children}
            </div>
        </CvAppWindow>;
    }

});

/**
 * Set up the router - this replaces our 'SimpleRouter' from the last example
 * react-router gives 'real' URL and history management
 * For now, we have default route - the login page and a single, post-login route,
 * the application window with a menu bar
 */

const app = (
    <Router history={hashHistory}>
        <Route path="/" component={CatreactApp}>
            <IndexRoute component={CatreactLogin}/>
            <Route path="/window/:windowId" component={CatreactWindow}/>
        </Route>
    </Router>
);

/**
 * Render the example to the document
 */

ReactDOM.render(app, document.getElementById('catreactApp'));


