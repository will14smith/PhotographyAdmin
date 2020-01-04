import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Form from "react-bootstrap/Form";
import { Link, RouteChildrenProps } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import {
  Photograph,
  loadPhotograph,
  updatePhotograph as apiUpdatePhotograph
} from "../api/photograph";
import LoaderButton from "../components/LoaderButton";
import PhotographThumbnail from "../components/PhotographThumbnail";

interface Props {
  id: string;
}

export default function PhotographDetails(props: RouteChildrenProps<Props>) {
  const id = props.match?.params.id || "";

  const [isLoading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photograph, setPhotograph] = useState<Photograph | null>(null);

  function updatePhotograph(updates: Partial<Photograph>) {
    return setPhotograph(photograph => {
      if (!photograph) return photograph;

      return { ...photograph, ...updates };
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!photograph) {
      return;
    }

    setIsSaving(true);

    try {
      const updatedPhotograph = await apiUpdatePhotograph(
        photograph.Id,
        photograph
      );

      setError(null);
      setPhotograph(updatedPhotograph);
    } catch (err) {
      setError("" + err);
      // don't clear photograph, might be validation error that the user can fix
    }

    setIsSaving(false);
  }

  useEffect(() => {
    async function onLoad() {
      setLoading(true);

      try {
        const photograph = await loadPhotograph(id);

        setError(null);
        setPhotograph(photograph);
      } catch (err) {
        setError("" + err);
        setPhotograph(null);
      }

      setLoading(false);
    }

    onLoad();
  }, [id]);

  return (
    <div>
      <Link to="/photographs" className="text-muted">
        <FontAwesomeIcon icon={faBackward} /> Back to list
      </Link>

      {isLoading ? (
        <h2 className="text-center text-muted">Loading...</h2>
      ) : error || !photograph ? (
        <h2 className="text-center text-danger">{error || "Failed to load"}</h2>
      ) : (
        <>
          <div className="text-center">
            <PhotographThumbnail photograph={photograph} width="500px" />
          </div>

          <Form className="mt-3" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter photograph title"
                size="lg"
                value={photograph.Title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updatePhotograph({ Title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Capture Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter photograph capture date"
                size="lg"
                value={photograph.CaptureTime.toISOString().split("T")[0]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updatePhotograph({ CaptureTime: new Date(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload Time</Form.Label>
              <Form.Control
                type="date"
                readOnly
                size="lg"
                value={photograph.UploadTime.toISOString().split("T")[0]}
              />
              <Form.Control
                type="time"
                readOnly
                size="lg"
                value={
                  photograph.UploadTime.toISOString()
                    .split("T")[1]
                    .split(".")[0]
                }
              />
            </Form.Group>

            <LoaderButton block type="submit" size="lg" isLoading={isSaving}>
              Save
            </LoaderButton>
          </Form>
        </>
      )}
    </div>
  );
}
