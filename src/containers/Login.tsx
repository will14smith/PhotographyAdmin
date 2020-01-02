import React, { useState, FormEvent, ChangeEvent } from "react";
import { RouteComponentProps } from "react-router";
import Form from "react-bootstrap/Form";
import { Auth } from "aws-amplify";

import LoaderButton from "../components/LoaderButton";
import "./Login.css";

interface Props extends RouteComponentProps {
  userHasAuthenticated: (isAuthenticated: boolean) => void;
}

export default function Login({ userHasAuthenticated, ...props }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
      props.history.push("/");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <h2 className="text-center text-muted">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username / Email address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username / email"
            size="lg"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            size="lg"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </Form.Group>

        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
