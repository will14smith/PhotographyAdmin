import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import { createPhotograph, getSuggestions, updatePhotograph } from "../api/photograph";
import type { Photograph, TitleSuggestion } from "../api/photograph";
import LoaderButton from "../components/LoaderButton";
import { uploadImage } from "../api/image";

type Stage = "selecting" | "uploading" | "creating" | "suggestions" | "editing";

export default function PhotographNew() {
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("selecting");
  const [error, setError] = useState<string | null>(null);

  const [_, setImage] = useState<File | null>(null);
  const [photograph, setPhotograph] = useState<Photograph | null>(null);
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [captureTime, setCaptureTime] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  function validateForm() {
    return photograph !== null && (selectedTitle.length > 0 || customTitle.length > 0);
  }

  async function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files ? event.target.files[0] : null;
    
    if (!file) {
      setImage(null);
      return;
    }

    setImage(file);
    setError(null);
    
    // Stage 2: Upload image immediately
    setStage("uploading");
    
    try {
      const key = await uploadImage(file);
      
      // Stage 3: Create photograph with image key
      setStage("creating");
      const createdPhotograph = await createPhotograph({ ImageKey: key });
      setPhotograph(createdPhotograph);
      setCaptureTime(createdPhotograph.CaptureTime);
      
      // Stage 4: Load title suggestions
      setStage("suggestions");
      const titleSuggestions = await getSuggestions(createdPhotograph.Id);
      setSuggestions(titleSuggestions);
      
      // Stage 5: Ready for editing
      setStage("editing");
    } catch (err) {
      setError("" + err);
      setStage("selecting");
      setImage(null);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!photograph) {
      setError("No photograph has been created.");
      return;
    }

    setSaving(true);

    try {
      const title = customTitle.length > 0 ? customTitle : selectedTitle;
      
      // Stage 6: Update photograph with final title and capture time
      await updatePhotograph(photograph.Id, {
        Title: title,
        CaptureTime: captureTime
      });

      navigate(`/photographs/${photograph.Id}`);
    } catch (err) {
      setError("" + err);
    }

    setSaving(false);
  }

  return (
    <div>
      <Link to="/photographs" className="text-muted">
        <FontAwesomeIcon icon={faBackward} /> Back to list
      </Link>

      {error ? (
        <h2 className="text-center text-danger">{error}</h2>
      ) : (
        <>
          <Form className="mt-3" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                size="lg"
                onChange={handleImageSelect}
                disabled={stage !== "selecting"}
              />
              {stage === "uploading" && (
                <Form.Text className="text-muted">
                  Uploading image...
                </Form.Text>
              )}
              {stage === "creating" && (
                <Form.Text className="text-muted">
                  Creating photograph...
                </Form.Text>
              )}
              {stage === "suggestions" && (
                <Form.Text className="text-muted">
                  Loading title suggestions...
                </Form.Text>
              )}
            </Form.Group>

            {photograph && stage === "editing" && (
              <>
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
                        checked={selectedTitle === suggestion.Title}
                        onChange={() => {
                          setSelectedTitle(suggestion.Title);
                          setCustomTitle("");
                        }}
                      />
                    ))}
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Custom Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a custom title or select a suggestion above"
                    size="lg"
                    value={customTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setCustomTitle(e.target.value);
                      setSelectedTitle("");
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Capture Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    placeholder="Enter photograph capture time"
                    size="lg"
                    value={captureTime.toISOString().slice(0,16)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCaptureTime(new Date(e.target.value + ":00Z"))
                    }
                  />
                </Form.Group>

                <LoaderButton
                  type="submit"
                  size="lg"
                  isLoading={saving}
                  disabled={!validateForm()}
                >
                  Save
                </LoaderButton>
              </>
            )}
          </Form>
        </>
      )}
    </div>
  );
}
