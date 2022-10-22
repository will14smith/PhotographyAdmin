import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import "./Home.css";

import { rebuildSite } from "../api/rebuild";
import LoaderButton from "../components/LoaderButton";

export default function Home() {
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rebuild() {
    setIsRebuilding(true);
    setError(null);

    try {
      await rebuildSite();
    } catch (err) {
      setError("" + err);
    }

    setIsRebuilding(false);
  }

  return (
    <div className="Home">
      <div className="lander">
        <h1>Photography Admin</h1>
        <p>An admin app for a photography static site generator</p>
      </div>
      <div className="rebuild-section">
        <p>
          If you feel the need to rebuild the static site before the scheduled
          time click this button.
        </p>
        {error && <p className="text-danger">{error}</p>}
        <p>
          <LoaderButton
            type="button"
            size="lg"
            variant="outline-danger"
            isLoading={isRebuilding}
            onClick={rebuild}
          >
            <span>
              Generate Site <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
          </LoaderButton>
        </p>
      </div>
    </div>
  );
}
