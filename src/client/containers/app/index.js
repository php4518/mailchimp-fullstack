import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import CSV from '../csv';
import Campaign from '../campaigns';
import Template from '../template';

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
          : <Redirect to="/uploadTemplate" />
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
          <PrivateRoute exact path="/" component={Template} />
          <PrivateRoute path="*" component={Template} />
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
