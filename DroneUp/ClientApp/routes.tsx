import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import Layout from './containers/Layout';
import Home from './containers/Home';
import OrderGuideDownload from './containers/OrderGuideDownload';
import Alerts from './containers/Alerts';
import MetaProductListing from './containers/MetaProductListing';
import Search from './containers/Search';
import PrioritizeMetaProductItems from './containers/PrioritizeMetaProductItems';
import AddBySupc from './containers/AddBySupc';
import NotFound from './containers/NotFound';
import LocationAssignment from './containers/LocationAssignment';
import BrowserUnsupported from './containers/BrowserUnsupported';
import Customers from './containers/Customers';

export default <Route component={Layout}>
	<Route path='/' components={{ body: Home }} />
	<Route path='/orderguidedownload' components={{ body: OrderGuideDownload }} />
	<Route path='/alerts' components={{ body: Alerts }} />
	<Route path='/customers' components={{ body: Customers, navbar: null }} />
	<Route path='/masterorderguides/:id/masteritems' components={{ body: MetaProductListing }} />
	<Route path='/masterorderguides/:id/locationassignment' components={{ body: LocationAssignment }} />
	<Route path='/masterorderguides/:bpid/masteritems/new/search' components={{ body: Search }} />
	<Route path='/masterorderguides/:bpid/masteritems/new/addbyproductnumber' components={{ body: AddBySupc }} />
	<Route path='/masterorderguides/:bpid/masteritems/:mpid/search' components={{ body: Search }} />
	<Route path='/masterorderguides/:bpid/masteritems/:mpid/addbyproductnumber' components={{ body: AddBySupc }} />
	<Route path='/exceptions/masterorderguides/:bpid/masteritems/:mpid/search' components={{ body: Search }} />
	<Route path='/exceptions/masterorderguides/:bpid/masteritems/:mpid/addbyproductnumber' components={{ body: AddBySupc }} />
	<Route path='/masterorderguides/:bpid/masteritems/new/prioritize' components={{ body: PrioritizeMetaProductItems }} />
	<Route path='/masterorderguides/:bpid/masteritems/:mpid/prioritize' components={{ body: PrioritizeMetaProductItems }} />
	<Route path='/exceptions/masterorderguides/:bpid/masteritems/:mpid/prioritize' components={{ body: PrioritizeMetaProductItems }} />
	<Route path='/browserUnsupported' components={{ body: BrowserUnsupported }} />
	<Route path='*' components={{ body: NotFound }} />
</Route>;

// Allow Hot Module Reloading
declare var module: any;
if (module.hot) {
	module.hot.accept();
}
