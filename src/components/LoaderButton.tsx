import React, { MouseEvent } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "./LoaderButton.css";

interface Props extends ButtonProps {
  isLoading: boolean;
  className?: string;
  disabled?: boolean;

  children: React.ReactChild;

  // this _should_ really come from the base props...
  onClick?: (event: MouseEvent) => void;
}

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}: Props) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <FontAwesomeIcon icon={faSpinner} />}
      {isLoading && " "}
      {props.children}
    </Button>
  );
}
