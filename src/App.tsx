import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { withAuthenticator, WithAuthenticatorProps } from '@aws-amplify/ui-react';

import "./App.css";
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }: WithAuthenticatorProps) {
  // TODO
  const isAuthenticated = true;

  return (
    <div className="App container">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Photography Admin</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/photographs">Photographs</Nav.Link>
                  <Nav.Link as={Link} to="/layout">Layout</Nav.Link>
                </>
              ) : null}
            </Nav>
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Item onClick={signOut}>Logout</Nav.Item>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default withAuthenticator(App);