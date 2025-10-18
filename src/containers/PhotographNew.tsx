import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";

import { newPhotograph } from "../api/photograph";
import type { PhotographNew as Model } from "../api/photograph";
import LoaderButton from "../components/LoaderButton";
import { partialSetState } from "../utils/partialState";
import { uploadImage } from "../api/image";

export default function PhotographNew() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [photograph, setPhotograph] = useState<Model>({
    Title: "",
    ImageKey: "",
    CaptureTime: new Date()
  });
  const [image, setImage] = useState<File | null>(null);

  const updatePhotograph = partialSetState(setPhotograph);

  function validateForm() {
    return photograph.Title.length > 0 && image !== null;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (image === null) {
      setError("No image has been selected.");
      return;
    }

    setSaving(true);

    try {
      const key = await uploadImage(image);
      const { Id: id } = await newPhotograph({ ...photograph, ImageKey: key });

      navigate(`/photographs/${id}`);
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
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                size="lg"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setImage(e.target.files ? e.target.files[0] : null)
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

            <LoaderButton
              type="submit"
              size="lg"
              isLoading={saving}
              disabled={!validateForm()}
            >
              Save
            </LoaderButton>
          </Form>
        </>
      )}
    </div>
  );
}
