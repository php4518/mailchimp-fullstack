import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import CSV from '../csv';
import Campaign from '../campaigns';
import Template from '../template';
import Login from '../login';
import Home from '../home';

const App = (props) => {
  const PublicRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={routeProps => (
        !props.user
          ? <Component {...routeProps} />
          : <Redirect to="/" />
      )}
    />
  );
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={routeProps => (
        props.user
          ? <Component {...routeProps} />
          : <Redirect to="/uploadCSV" />
      )}
    />
  );
  return (
    <div className="container app-wrapper">
      <main>
        <Switch>
          <PublicRoute exact path="/uploadCSV" component={CSV} />
          <PublicRoute exact path="/addCampaignDetails" component={Campaign} />
          <PublicRoute exact path="/uploadTemplate" component={Template} />
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="*" component={Home} />
        </Switch>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default withRouter(connect(
  mapStateToProps,
  null
)(App));
