// from https://github.com/react-bootstrap/react-router-bootstrap
// updated for react-bootstrap 1.x

import React, { Component } from "react";
import * as R from "react-router-dom";
import * as H from "history";

type ClickHandler = (event: MouseEvent) => void;

interface Props {
  history: H.History;
  location: H.Location;
  match: R.match; // TODO
  children: JSX.Element;
  onClick?: ClickHandler;
  replace?: boolean;
  to: H.LocationDescriptor;
  exact?: boolean;
  strict?: boolean;
  className?: string;
  activeClassName?: string;
  style?: object;
  activeStyle?: object;
  isActive?: (match: any, location: any) => boolean;
}

const isModifiedEvent = (event: MouseEvent) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

export class LinkContainer extends Component<Props> {
  static defaultProps = {
    replace: false,
    exact: false,
    strict: false,
    activeClassName: "active"
  };

  handleClick = (event: MouseEvent) => {
    const { children, onClick } = this.props;

    if (children.props.onClick) {
      children.props.onClick(event);
    }

    if (onClick) {
      onClick(event);
    }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore right clicks
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const { replace, to, history } = this.props;

      if (replace) {
        history.replace(to as any);
      } else {
        history.push(to as any);
      }
    }
  };

  render() {
    const {
      history,
      location: _location, // eslint-disable-line no-unused-vars
      match: _match, // eslint-disable-line no-unused-vars
      children,
      replace, // eslint-disable-line no-unused-vars
      to,
      exact,
      strict,
      activeClassName,
      className,
      activeStyle,
      style,
      isActive: getIsActive,
      ...props
    } = this.props;

    const href = history.createHref(
      typeof to === "string" ? { pathname: to } : to
    );

    const child = React.Children.only(children);

    return (
      <R.Route
        path={typeof to === "object" ? to.pathname : to}
        exact={exact}
        strict={strict}
        children={({ location, match }) => {
          const isActive = !!(getIsActive
            ? getIsActive(match, location)
            : match);

          return React.cloneElement(child, {
            ...props,
            className: [
              className,
              child.props.className,
              isActive ? activeClassName : null
            ]
              .join(" ")
              .trim(),
            style: isActive ? { ...style, ...activeStyle } : style,
            href,
            onClick: this.handleClick
          });
        }}
      />
    );
  }
}

export default R.withRouter(LinkContainer);
