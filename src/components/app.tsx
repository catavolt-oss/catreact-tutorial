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
import { CatavoltPane } from 'catreact'

/** Import the Catavolt Javascript API objects that we'll use */
import { Log, LogLevel } from 'catavolt-sdk'

/** At this level the console will show all requests and responses to and from the Catavolt server */
Log.logLevel(LogLevel.DEBUG);

/**
 * **********************************
 *      Begin Application Code
 *  *********************************
 */

/**
 Create a 'main' application wrapper, with a root 'CatavoltPane'
 This initializes the Catavolt Javascript Sdk under the covers and exports some top-level objects to the scope
 */
const CatreactApp = React.createClass({

    render: function () {
        return (
            <div className="container">
                <CatavoltPane enableResourceCaching={true}>
                    <div>
                        <h1>Hello Catreact!</h1>
                        {this.props.children}
                    </div>
                </CatavoltPane>
            </div>
        );
    }
});


/**
 * Render the example to the document
 */

const app = (
    <CatreactApp/>
);

ReactDOM.render(app, document.getElementById('catreactApp'));
