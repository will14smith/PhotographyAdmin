import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link, useRouteMatch } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { loadPhotographs, Photograph } from "../api/photograph";
import PhotographThumbnail from "../components/PhotographThumbnail";

export default function PhotographsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photographs, setPhotographs] = useState<Photograph[]>([]);

  const { url } = useRouteMatch();

  useEffect(() => {
    async function onLoad() {
      setIsLoading(true);
      try {
        const photographs = await loadPhotographs();
        setPhotographs(photographs);
        setError(null);
      } catch (err) {
        setPhotographs([]);
        setError("" + err);
      }

      setIsLoading(false);
    }

    onLoad();
  }, []);

  function renderPhotographsList(photographs: Photograph[]) {
    return (
      <>
        <ListGroup.Item as={Link} action to={`${url}/new`} key="new">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <h2 className="text-muted">Upload a photograph</h2>
            <FontAwesomeIcon icon={faPlus} size="4x" />
          </div>
        </ListGroup.Item>
        {photographs.map(photograph => (
          <ListGroup.Item as={Link} action to={`${url}/${photograph.Id}`} key={photograph.Id}>
            <div className="d-flex w-100 justify-content-between align-items-center">
              <h2>{photograph.Title}</h2>
              <PhotographThumbnail photograph={photograph} width="56px" />{" "}
            </div>
          </ListGroup.Item>
        ))}
      </>
    );
  }

  return (
    <ListGroup className="mt-3">
      {isLoading ? (
        <ListGroup.Item variant="light">
          <h2 className="text-center text-muted">Loading...</h2>
        </ListGroup.Item>
      ) : error || !photographs ? (
        <ListGroup.Item variant="danger">
          <h2 className="text-center">
            {error || "Failed to load photographs"}
          </h2>
        </ListGroup.Item>
      ) : (
        renderPhotographsList(photographs)
      )}
    </ListGroup>
  );
}
