import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Form, Card, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import type { Photograph } from "../api/photograph";
import { generateThumbnail } from "../api/photograph";
import { ImageTypeThumbnail } from "../api/image";
import LoaderButton from "./LoaderButton";

export interface Props {
  photograph: Photograph;
  onPhotographUpdated: (photograph: Photograph) => void;
}

export default function ThumbnailManager({ photograph, onPhotographUpdated }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");

  // Get the last thumbnail
  const currentThumbnail = photograph.Images.findLast(x => x.Type === ImageTypeThumbnail);
  const thumbnailCount = photograph.Images.filter(x => x.Type === ImageTypeThumbnail).length;

  async function handleGenerateThumbnail(event: FormEvent) {
    event.preventDefault();
    
    const widthNum = width ? parseInt(width, 10) : undefined;
    const heightNum = height ? parseInt(height, 10) : undefined;

    if (!widthNum && !heightNum) {
      setError("Please specify at least width or height");
      return;
    }

    if (widthNum && widthNum <= 0) {
      setError("Width must be a positive number");
      return;
    }

    if (heightNum && heightNum <= 0) {
      setError("Height must be a positive number");
      return;
    }

    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const request: { Width?: number; Height?: number } = {};
      if (widthNum) request.Width = widthNum;
      if (heightNum) request.Height = heightNum;

      const updatedPhotograph = await generateThumbnail(photograph.Id, request);
      onPhotographUpdated(updatedPhotograph);
      
      const sizeInfo = widthNum && heightNum 
        ? `${widthNum}x${heightNum}` 
        : widthNum 
          ? `${widthNum}px width` 
          : `${heightNum}px height`;
      
      setSuccess(`Successfully generated thumbnail at ${sizeInfo}`);
      setWidth("");
      setHeight("");
    } catch (err) {
      setError("Failed to generate thumbnail: " + err);
    }

    setGenerating(false);
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        <FontAwesomeIcon icon={faImage} className="me-2" />
        Thumbnail Management
      </Card.Header>
      <Card.Body>
        {currentThumbnail && (
          <div className="mb-3">
            <strong>Current Thumbnail:</strong>
            <div className="text-muted small">
              {currentThumbnail.ObjectKey}
            </div>
            <div className="text-muted small">
                Size: {currentThumbnail.Width || '?'} × {currentThumbnail.Height || '?'} px
            </div>
            {thumbnailCount > 1 && (
              <div className="text-muted small">
                ({thumbnailCount} thumbnail(s) total)
              </div>
            )}
          </div>
        )}

        {!currentThumbnail && (
          <Alert variant="info" className="mb-3">
            No thumbnail generated yet. Generate one below.
          </Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleGenerateThumbnail}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Width (px)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Leave empty to auto-calculate"
                  value={width}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)}
                  disabled={generating}
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Height (px)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Leave empty to auto-calculate"
                  value={height}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)}
                  disabled={generating}
                  min="1"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Text className="d-block mb-3 text-muted">
            Specify width, height, or both. If only one dimension is provided, the other will be calculated to maintain aspect ratio.
          </Form.Text>

          <LoaderButton
            type="submit"
            variant="primary"
            isLoading={generating}
            disabled={generating}
          >
            Generate Thumbnail
          </LoaderButton>
        </Form>
      </Card.Body>
    </Card>
  );
}
