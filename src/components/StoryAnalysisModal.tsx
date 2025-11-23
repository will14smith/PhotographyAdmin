import { Modal, Button, Alert, Card } from "react-bootstrap";
import type { Section } from "../api/story";

interface StoryAnalysisModalProps {
  show: boolean;
  analyzedSections: Section[] | null;
  onHide: () => void;
  onApply: () => void;
}

export default function StoryAnalysisModal({
  show,
  analyzedSections,
  onHide,
  onApply,
}: StoryAnalysisModalProps) {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Analysis Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning">
          Applying this analysis will replace all existing sections. Review the generated sections below.
        </Alert>
        {analyzedSections?.map((section, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{section.Title || "(Untitled)"}</Card.Title>
              <Card.Text>{section.Description}</Card.Text>
              <div className="text-muted small">
                Theme: {section.Theme} | 
                {section.StartDate && ` Start: ${new Date(section.StartDate).toLocaleDateString()}`}
                {section.EndDate && ` | End: ${new Date(section.EndDate).toLocaleDateString()}`}
              </div>
            </Card.Body>
          </Card>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onApply}>
          Apply Analysis
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
