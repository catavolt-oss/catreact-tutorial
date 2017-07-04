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
    CvNavigationResult, CvLaunchActionCallback, CvQueryPaneCallback, CvValueAdapter, CvForm,
    CvNavigation, CvListPane, CvRecordList, CvRecord, CvAction, CvActionCallback, CvProp, CvDetailsPane,
    CvDetailsPaneCallback
} from 'catreact'

/** Import the Catavolt Javascript API objects that we'll use */
import {
    ColumnDef, ListContext, Log, LogLevel, Prop, Workbench, WorkbenchLaunchAction, EntityRec,
    DetailsContext
} from 'catavolt-sdk'

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
                           launchListeners={[(launchEvent:CvEvent<CvNavigationResult>)=>{
                               const listNavId = launchEvent.resourceId;
                               this.context.router.push('/product/' + windowId + '/' + listNavId);
                            }]}
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

const ProductPage = React.createClass({

    mixins: [CatreactAppBase],

    render: function () {

        const windowId = this.props.params.windowId; //get the window from the url param
        const listNavId = this.props.params.listNavId;
        const detailNavId = this.props.params.detailNavId;

        return (
            <div>
                <ProductList windowId={windowId} navigationId={listNavId}/>
                <ProductDetail navigationId={detailNavId}/>
            </div>
        );

    }

});


const ProductList = React.createClass<{windowId, navigationId},{}>({

    mixins: [CatreactAppBase],

    render: function () {

        return (
            <CvNavigation navigationId={this.props.navigationId}>
                <CvForm>
                    <div className="panel panel-primary">
                        <div className="panel-heading"><h5 className="panel-title">Products</h5></div>
                        <div className="panel-body row">
                            <CvListPane paneRef={0} recordPageSize={5} queryRenderer={(cvContext:CvContext, callback:CvQueryPaneCallback)=>{
                                const listContext:ListContext = cvContext.scopeCtx.scopeObj;
                                return(
                                    <div>
                                        <table className="table table-striped">
                                            <thead>
                                            {/* Iterate through columns and create the headers */}
                                            <tr>{listContext.listDef.activeColumnDefs.map((colDef, index) => { return <th key={index}>{colDef.heading}</th> })}</tr>
                                            </thead>
                                            {/* Iterate through our list of records and crate the rows using the 'rowRenderer' */}
                                            <CvRecordList queryContext={listContext} wrapperElemName={'tbody'} rowRenderer={(cvContext, record)=>{
                                                return (
                                                    <CvRecord entityRec={record} key={record.objectId} renderer={(cvContext:CvContext)=>{
                                                        const renderPropNames = listContext.listDef.activeColumnDefs.map((colDef:ColumnDef)=>{return colDef.name});
                                                        return (
                                                            <tr>
                                                                {/* Iterate through our properties and create the columns */}
                                                                {renderPropNames.map((name:string)=> {
                                                                    const prop:Prop = record.propAtName(name);
                                                                    /*
                                                                     Select the oid of "this record" so that the action can find the target via the selectionProvider
                                                                     Actions require a selectionProvider, so we then give the newly created selectionAdapter to the CvAction (below)
                                                                     */
                                                                    const selectionAdapter:CvValueAdapter<Array<string>> = new CvValueAdapter<Array<string>>();
                                                                    selectionAdapter.getDelegateValueListener()([record.objectId]);
                                                                    /*
                                                                     Wrap the property with a Catavolt Action that will fire the 'default list action' when row is clicked
                                                                     The 'onClick' handler on the 'td' element use the action's callback to make this happen
                                                                     Also specify a navigationListener to handle the 'Navigation Result' produced by the Catavolt Action
                                                                     This will be a Navigation Result containing the 'DetailsPane' that we want to display below the list
                                                                     */
                                                                    return (
                                                                        <CvAction actionId={listContext.listDef.defaultActionId}
                                                                                  paneContext={listContext} key={prop.name}
                                                                                  selectionProvider={selectionAdapter}
                                                                                  renderer={(cvContext:CvContext, callback?:CvActionCallback)=>{
                                                                                      return <td className="click-target" onClick={()=>callback.fireAction()}>
                                                                                          <CvProp propName={prop.name} entityRec={record} paneContext={listContext}/>
                                                                                      </td>
                                                                                  }}
                                                                                  navigationListeners={[(navEvent:CvEvent<CvNavigationResult>)=>{
                                                                                      const detailNavId = navEvent.resourceId;
                                                                                      this.context.router.push('/product/' + this.props.windowId + '/'
                                                                                          + this.props.navigationId + '/' + detailNavId);
                                                                                  }]}
                                                                        />
                                                                    )
                                                                })}
                                                            </tr>
                                                        );
                                                    }}/>
                                                );
                                            }}/>
                                        </table>
                                        <div className="paging-controls">
                                            <div className="pull-left">
                                                {(()=>{ if(callback.hasMoreBackward()){ return (
                                                    <button type="button" className="btn btn-default btn-sm" onClick={(()=>{callback.pageBackward((num)=>{}, true)})}>
                                                        <span className="glyphicon glyphicon-menu-left" aria-hidden="true"/>
                                                        <span>Prev</span>
                                                    </button>
                                                );}})()}
                                            </div>
                                            <div className="pull-right">
                                                {(()=>{ if(callback.hasMoreForward()){ return (
                                                    <button type="button" className="btn btn-default btn-sm" onClick={()=>{callback.pageForward((num)=>{}, true)}}>
                                                        <span>Next</span>
                                                        <span className="glyphicon glyphicon-menu-right" aria-hidden="true"/>
                                                    </button>
                                                );}})()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}/>
                        </div>
                    </div>
                </CvForm>
            </CvNavigation>
        );
    }
});

const ProductDetail = React.createClass<{navigationId:string},{}>({

    mixins: [CatreactAppBase],

    render: function () {

        return (
            <CvNavigation navigationId={this.props.navigationId}>
                <CvForm>
                    <div className="well">
                        <CvDetailsPane paneRef={0} detailsRenderer={(cvContext:CvContext, record:EntityRec,
                                                                     detailsCallback:CvDetailsPaneCallback)=>{
                            const detailsContext:DetailsContext = cvContext.scopeCtx.scopeObj;
                            return (
                                <CvRecord entityRec={record} renderer={(cvContext:CvContext)=>{
                                    return (
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td><span className="glyphicon glyphicon-info-sign" aria-hidden="true"/></td>
                                                <td><span className="detail-label">{'Product Name: '}</span><CvProp propName="ProductName" entityRec={record}/></td>
                                                <td><span className="detail-label">{'Category: '}</span><CvProp propName="CategoryID" entityRec={record}/></td>
                                                <td><span className="detail-label">{'Supplier: '}</span><CvProp propName="SupplierID" entityRec={record}/></td>
                                                <td><span className="detail-label">{'Unit Price: '}</span><CvProp propName="UnitPrice" entityRec={record}/></td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td><span className="detail-label">{'Quantity/Unit: '}</span><CvProp propName="QuantityPerUnit" entityRec={record}/></td>
                                                <td><span className="detail-label">{'Units On Order: '}</span><CvProp propName="UnitsOnOrder" entityRec={record}/></td>
                                                <td><span className="detail-label">{'Units In Stock: '}</span><CvProp propName="UnitsInStock" entityRec={record}/></td>
                                                <td><span className="detail-label">{'Product ID: '}</span><CvProp propName="ProductID" entityRec={record}/></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    );
                                }}/>
                            );
                        }}/>
                    </div>
                </CvForm>
            </CvNavigation>
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
            <Route path="window/:windowId" component={CatreactWindow}>
                <Route path="/product/:windowId/:listNavId(/:detailNavId)" component={ProductPage}/>
            </Route>
        </Route>
    </Router>
);

ReactDOM.render(app, document.getElementById('catreactApp'));


