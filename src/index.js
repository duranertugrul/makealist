import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import App from './components/App';
// import history from './history';
// import { firebaseApp } from './firebase';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './reducers';

const store = createStore(reducer);

// firebaseApp.auth().onAuthStateChanged(user => {
//   if (user) {
//     const { email } = user;
//     // store.dispatch(logUser(email));
//     history.push('/app');
//   } else {
//     alert("signin");
//     // history.push('/signin');
//     // this.Router.history.push('/signin');
//     return <Redirect to="/signin" />;
//   }
// })

ReactDOM.render(
    <Provider store = {store} >
      <Router >
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </Router>
    </Provider>
  , document.getElementById('root')
)
