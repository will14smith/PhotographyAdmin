import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Form from "react-bootstrap/Form";
import { Link, Navigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import {
  loadPhotograph,
  updatePhotograph as apiUpdatePhotograph,
  getSuggestions
} from "../api/photograph";
import type { Photograph, TitleSuggestion } from "../api/photograph";
import LoaderButton from "../components/LoaderButton";
import PhotographThumbnail from "../components/PhotographThumbnail";

import { partialSetState } from "../utils/partialState";
import useLoader from "../utils/useLoader";

export default function PhotographDetails() {
  const { id } = useParams();
  const [saving, setSaving] = useState(false);

  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const { data: photograph, loading, error, setData: setPhotograph, setError } = useLoader(undefined, () => loadPhotograph(id!), [id]);

  if(!id) {
    return <Navigate to={'/photographs'} replace />
  }

  const updatePhotograph = partialSetState<Photograph>(setPhotograph);

  async function handleGetSuggestions() {
    if (!id) {
      return;
    }

    setLoadingSuggestions(true);
    
    try {
      const titleSuggestions = await getSuggestions(id);
      setSuggestions(titleSuggestions);
      setSuggestionsError(null);
    } catch (err) {
      setSuggestionsError("Failed to load suggestions: " + err);
    }

    setLoadingSuggestions(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!photograph) {
      return;
    }

    setSaving(true);

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

    setSaving(false);
  }

  return (
    <div>
      <Link to="/photographs" className="text-muted">
        <FontAwesomeIcon icon={faBackward} /> Back to list
      </Link>

      {loading ? (
        <h2 className="text-center text-muted">Loading...</h2>
      ) : error || !photograph ? (
        <h2 className="text-center text-danger">{error || "Failed to load"}</h2>
      ) : (
        <>
          <div className="text-center">
            <PhotographThumbnail photograph={photograph} width="500px" />
          </div>

          <Form className="mt-3" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Enter photograph title"
                  size="lg"
                  value={photograph.Title || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updatePhotograph({ Title: e.target.value })
                  }
                />
                <LoaderButton
                  variant="secondary"
                  size="lg"
                  isLoading={loadingSuggestions}
                  onClick={handleGetSuggestions}
                  type="button"
                >
                  Suggest
                </LoaderButton>
              </div>
              {!photograph.Title && (
                <Form.Text className="text-warning">
                  You should really have a title.
                </Form.Text>
              )}
            </Form.Group>

            {suggestionsError && (
              <Form.Text className="text-danger">
                {suggestionsError}
              </Form.Text>
            )}

            {suggestions.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Suggested Titles</Form.Label>
                {suggestions.map((suggestion, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    id={`suggestion-${index}`}
                    name="titleSuggestion"
                    label={suggestion.Title}
                    onChange={() => {
                      updatePhotograph({ Title: suggestion.Title });
                      setSuggestions([]);
                    }}
                  />
                ))}
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Capture Time</Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="Enter photograph capture time"
                size="lg"
                value={photograph.CaptureTime ? photograph.CaptureTime.toISOString().slice(0,16) : ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updatePhotograph({ CaptureTime: new Date(e.target.value + ":00Z") })
                }
              />
              {!photograph.CaptureTime && (
                <Form.Text className="text-warning">
                  Capture date is required
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
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

            <LoaderButton
              type="submit"
              size="lg"
              isLoading={saving}
            >
              Save
            </LoaderButton>
          </Form>
        </>
      )}
    </div>
  );
}
