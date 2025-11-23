import { useState, useMemo } from "react";
import { Modal, Form, Button, Row, Col, Card } from "react-bootstrap";
import Fuse from "fuse.js";
import type { Photograph } from "../api/photograph";
import PhotographThumbnail from "./PhotographThumbnail";
import { formatDate } from "../utils/dates";

interface PhotographSelectorModalProps {
  show: boolean;
  onHide: () => void;
  onSelect: (photographId: string) => void;
  availablePhotographs: Photograph[];
  selectedPhotographId?: string;
}

export default function PhotographSelectorModal({
  show,
  onHide,
  onSelect,
  availablePhotographs,
  selectedPhotographId,
}: PhotographSelectorModalProps) {
  const [searchText, setSearchText] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(availablePhotographs, {
      keys: [
        { name: "Title", weight: 2 },
        { name: "CaptureTime", weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
  }, [availablePhotographs]);

  const filteredPhotographs = useMemo(() => {
    if (!searchText.trim()) {
      return availablePhotographs;
    }
    const results = fuse.search(searchText);
    return results.map((result) => result.item);
  }, [fuse, availablePhotographs, searchText]);

  const handleSelect = (photographId: string) => {
    onSelect(photographId);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Select Photograph</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Form.Control
          type="text"
          placeholder="Search by title or date..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-3"
        />
        {searchText && availablePhotographs.length > 0 && (
          <small className="text-muted d-block mb-3">
            Showing {filteredPhotographs.length} of {availablePhotographs.length} photographs
          </small>
        )}
        {filteredPhotographs.length === 0 && searchText ? (
          <div className="text-center text-muted py-5">
            <p>No photographs match your search</p>
          </div>
        ) : filteredPhotographs.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No photographs available</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} className="g-3">
            {filteredPhotographs.map((photograph) => (
              <Col key={photograph.Id}>
                <Card
                  className={`h-100 ${
                    selectedPhotographId === photograph.Id ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(photograph.Id)}
                >
                  <div
                    style={{
                      height: "150px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8f9fa",
                    }}
                  >
                    <PhotographThumbnail
                      photograph={photograph}
                      width="100%"
                      style={{ objectFit: "cover", height: "100%", width: "100%" }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-truncate small" title={photograph.Title}>
                      {photograph.Title}
                    </Card.Title>
                    <Card.Text className="small text-muted">
                      {formatDate(photograph.CaptureTime)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
