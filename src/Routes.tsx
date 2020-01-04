import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import PhotographsList from "./containers/PhotographsList";
import PhotographNew from "./containers/PhotographNew";
import PhotographDetails from "./containers/PhotographDetails";
import Layout from "./containers/Layout";

interface Props {
  appProps: any;
}

function withAppProps<P extends AppProps, AppProps>(
  Component: React.ComponentType<P>,
  appProps: AppProps
) {
  return (props: P) => <Component {...appProps} {...props} />;
}

export default function Routes({ appProps }: Props) {
  return (
    <Switch>
      <Route path="/" exact component={withAppProps(Home, appProps)} />

      <UnauthenticatedRoute
        path="/login"
        exact
        component={Login}
        appProps={appProps}
      />

      <AuthenticatedRoute
        path="/photographs"
        render={props => <PhotographRoutes {...props} appProps={appProps} />}
        appProps={appProps}
      />
      <AuthenticatedRoute
        path="/layout"
        component={Layout}
        appProps={appProps}
      />

      <Route component={NotFound} />
    </Switch>
  );
}

function PhotographRoutes({ appProps }: any) {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={PhotographsList} />
      <Route path={`${path}/new`} component={PhotographNew} />
      <Route path={`${path}/:id`} component={PhotographDetails} />

      <Route component={NotFound} />
    </Switch>
  );
}
