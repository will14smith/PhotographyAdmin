import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

interface BaseAppProps {
  isAuthenticated: boolean;
}

interface Props extends RouteProps {
  component: React.ComponentType<any>;
  appProps: BaseAppProps;
}

export default function UnauthenticatedRoute({
  component: C,
  appProps,
  ...rest
}: Props) {
  return (
    <Route
      {...rest}
      render={props =>
        !appProps.isAuthenticated ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}
