import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactNode;
}

export default function NavRouterLink({ to, children }: Props) {
  return (
    <Nav.Item>
      <Nav.Link as={Link} to={to} href={to}>
        {children}
      </Nav.Link>
    </Nav.Item>
  );
}
