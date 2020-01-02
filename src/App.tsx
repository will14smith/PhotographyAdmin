import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import LinkContainer from "./components/LinkContainer";
import Routes from "./Routes";
import "./App.css";

function App() {
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
            <LinkContainer to="/login">
              <Nav.Item>Login</Nav.Item>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
