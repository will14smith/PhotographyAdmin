import { useRouteError } from "react-router-dom";

import "./NotFound.css";

export default function NotFound() {
  const error = useRouteError() as Error;

  return (
    <div className="NotFound">
      <h3>Sorry, page not found!</h3>
      <p>
        <pre>{error.message || JSON.stringify(error)}</pre>
      </p>
    </div>
  );
}
