import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";

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
      <Route path="/login" exact component={withAppProps(Login, appProps)} />

      <Route component={NotFound} />
    </Switch>
  );
}
