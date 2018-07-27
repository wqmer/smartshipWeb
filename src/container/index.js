import React , { Component }  from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import ComponentHome from './home/home';
import ComponentUser from './user/user';
import asset from './user/asset';

export const history = createHistory();

const AppRouter= () => (

<Router history={history} >
	  <div>
      <Switch>
        {/* <Route exact path="/" component={test} /> */}
	          <Route exact path="/" component={ComponentHome} />
            <Route path="/user" component={ComponentUser} />
            {/* <Route  path="/balance" component={asset} /> */}
            {/* <Route   path="/test" component={testDashboard} /> */}
            {/* <Route exact path="/user/balance" component={asset} /> */} */}
      </Switch>
	  </div>
</Router>
  
)

export default AppRouter;
