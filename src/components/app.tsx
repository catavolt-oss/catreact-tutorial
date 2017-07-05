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
    CatavoltPane, CvAppWindow, CvEvent, CvLoginResult, CvLogout, CvContext, CvLogoutCallback,
    CvLogoutResult
} from 'catreact'

/** Import the Catavolt Javascript API objects that we'll use */
import { Log, LogLevel } from 'catavolt-sdk'

import {CvLoginPanel} from "catreact-html";

/** At this level the console will show all requests and responses to and from the Catavolt server */
Log.logLevel(LogLevel.DEBUG);

/**
 * **********************************
 *      Begin Application Code
 *  *********************************
 */

const CatreactApp = React.createClass({

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
 * Add the prop 'loginListener' to the notification list to be
 * used by our SimpleRouter
 */
const CatreactLogin = React.createClass<{loginListener},{}>({

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
                loginListeners={[this.props.loginListener, (event:CvEvent<CvLoginResult>)=>{
                    const sessionId = event.resourceId;  //get the session from the LoginEvent
                    Log.debug('I logged in with windowId/sessionId: ' + sessionId);
                }]}
            />
        </div>
    }
});

/**
 * Create a 'window' top-level container, with a logout button
 * The 'window' is associated with a 'session' and will contain all subcomponents, once we're logged in
 * This is evident in the 'route' configuration (see the route setup at the end of the file)
 */
const CatreactWindow = React.createClass<{windowId, logoutListener},{}>({

    render: function () {
        const windowId = this.props.windowId; //get the windowId (sessionId)
        return <CvAppWindow windowId={windowId}>
            <div>
                <div className="top-nav text-right">
                    <CvLogout logoutListeners={[this.props.logoutListener]}
                        renderer={(cvContext:CvContext, callback:CvLogoutCallback)=>{
                            return <div className="click-target"><a onClick={callback.logout}>Logout</a></div>
                        }}
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
 * Simple router example
 * Watch for a state change and rerender the app accordingly
 * Here we 'listen' for a login event and set the state param 'windowId'
 */
const SimpleRouter = React.createClass({

    render: function() {
        return (
            <CatreactApp>
                <CatreactLogin loginListener={(event:CvEvent<CvLoginResult>)=>{
                   this.setState({windowId: event.resourceId});
                }}/>
                <CatreactWindow windowId={this.state ? this.state.windowId : null}
                    logoutListener={(event:CvEvent<CvLogoutResult>)=>{
                        this.setState({windowId: null})}}/>
            </CatreactApp>
        );
    }

});

/**
 * Render the example to the document
 */

const app = <SimpleRouter/>;

ReactDOM.render(app, document.getElementById('catreactApp'));
