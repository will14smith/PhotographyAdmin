import React from "react";
import {
  Route,
  RouteProps,
  RouteComponentProps,
  Redirect
} from "react-router-dom";

interface BaseAppProps {
  isAuthenticated: boolean;
}

interface BaseProps extends RouteProps {
  appProps: BaseAppProps;
}

interface ComponentProps extends BaseProps {
  component: React.ComponentType<any>;
}

interface RenderProps extends BaseProps {
  render: (props: RouteComponentProps<any>) => React.ReactNode;
}

export default function AuthenticatedRoute({
  component: C,
  render: r,

  appProps,
  ...rest
}: ComponentProps | RenderProps) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.isAuthenticated ? (
          C ? (
            <C {...props} {...appProps} />
          ) : r ? (
            r({ ...props, ...appProps })
          ) : null
        ) : (
          <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location.search}`}
          />
        )
      }
    />
  );
}
