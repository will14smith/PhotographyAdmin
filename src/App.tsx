import React, { useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Auth } from "aws-amplify";

import LinkContainer from "./components/LinkContainer";
import Routes from "./Routes";
import "./App.css";

function App(props: RouteComponentProps) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    props.history.push("/login");
  }

  if (isAuthenticating) {
    return null;
  }

  return (
    <div className="App container">
      <Navbar collapseOnSelect variant="light" bg="light">
        <Navbar.Brand>
          <Link to="/">Photography Admin</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto"></Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Item>Login</Nav.Item>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
    </div>
  );
}

export default withRouter(App);
