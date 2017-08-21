// Import site styling
import "./css/site.scss";
import 'font-awesome/scss/font-awesome';
import 'react-redux-toastr/src/styles/index.scss';

// Import polyfills
import 'core-js/shim';
import 'whatwg-fetch';

// Application root
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { browserHistory, hashHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux';
import { supportsHistory } from 'history/lib/DOMUtils';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { reducer as toastrReducer } from 'react-redux-toastr';
import ReduxToastr from 'react-redux-toastr';
import routes from './routes';
import { IntlProvider } from 'react-intl';
import { localeMessages } from './messages';
import { sendPageView } from './analytics';

const historyType = (
	supportsHistory() ? browserHistory : hashHistory
);

const store = createStore(
	combineReducers({ ...reducers, routing: routerReducer, toastr: toastrReducer }),
	applyMiddleware(thunk, routerMiddleware(historyType))
);

const history = syncHistoryWithStore(historyType, store);

// This code starts up the React app when it runs in a browser. It sets up the routing configuration
// and injects the app into a DOM element.
ReactDOM.render(
	<IntlProvider locale={localeMessages.locale} messages={localeMessages.messages}>
		<Provider store={store}>
			<div className="react-root">
				<Router history={history} children={routes} onUpdate={ sendPageView }/>
				<ReduxToastr
					timeOut={4000}
					newestOnTop={false}
					preventDuplicates={true}
					position="bottom-left"
					transitionIn="fadeIn"
					transitionOut="fadeOut"
					progressBar />
			</div>
		</Provider>
	</IntlProvider>,
	document.getElementById('react-app')
);
