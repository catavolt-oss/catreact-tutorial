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
import {CatavoltPane, CvEvent, CvLoginResult} from 'catreact'

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

const CatreactLogin = React.createClass({

    render: function () {
        return <div className="cv-login-wrapper">
            <div className="cv-login-logo"/>
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
                    Log.debug('I logged in with windowId/sessionId: ' + sessionId);
                }]}
            />
        </div>
    }
});

/**
 * Render the example to the document
 */

const app = (
    <CatreactApp><CatreactLogin/></CatreactApp>
);

ReactDOM.render(app, document.getElementById('catreactApp'));
