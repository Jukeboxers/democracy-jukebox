import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import store from './store';
import App from './components/App.jsx';
const app = document.getElementById('app');

window.server = 'http://peaceful-retreat-84338.herokuapp.com'; // prod
// window.server = 'http://127.0.0.1:3000'; // dev

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  app
);
