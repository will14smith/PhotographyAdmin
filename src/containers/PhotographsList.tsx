import { useState, useMemo } from "react";
import { Form, Button, InputGroup, Card, Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { loadPhotographs, type Photograph } from "../api/photograph";
import PhotographThumbnail from "../components/PhotographThumbnail";
import useLoader from "../utils/useLoader";

function formatDate(date: Date): string {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString();
}

export default function PhotographList() {
  const { data: photographs, loading, error } = useLoader([], loadPhotographs, []);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Configure Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(photographs, {
      keys: [
        { name: 'Title', weight: 2 }, // Title is most important
        { name: 'CaptureTime', getFn: (photo) => formatDate(photo.CaptureTime), weight: 1 },
        { name: 'UploadTime', getFn: (photo) => formatDate(photo.UploadTime), weight: 0.5 }
      ],
      threshold: 0.4, // Lower = more strict, higher = more fuzzy (0.0 to 1.0)
      includeScore: true,
      ignoreLocation: true, // Search anywhere in the string
      minMatchCharLength: 1
    });
  }, [photographs]);

  const filteredPhotographs = useMemo(() => {
    if (!searchText.trim()) {
      return photographs;
    }

    const results = fuse.search(searchText);
    return results.map(result => result.item);
  }, [fuse, photographs, searchText]);

  return (
    <Container fluid className="mt-3">
      {/* Search and Upload Input Group */}
      {!loading && !error && (
        <div className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by title or date..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              variant="primary" 
              onClick={() => navigate('new')}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Upload
            </Button>
          </InputGroup>
          {searchText && photographs.length > 0 && (
            <small className="text-muted">
              Showing {filteredPhotographs.length} of {photographs.length} photographs
            </small>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <h2 className="text-muted">Loading...</h2>
        </div>
      ) : error || !photographs ? (
        <div className="text-center mt-5">
          <h2 className="text-danger">
            {error || "Failed to load photographs"}
          </h2>
        </div>
      ) : (
        renderPhotographsGrid(filteredPhotographs, searchText)
      )}
    </Container>
  );
}

function renderPhotographsGrid(photographs: Photograph[], searchText: string) {
  if (photographs.length === 0 && searchText) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">No photographs match your search</p>
      </div>
    );
  }
  
  if (photographs.length === 0) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">No photographs yet. Click Upload to add one!</p>
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {photographs.map(photograph => (
        <Col key={photograph.Id}>
          <Card as={Link} to={`${photograph.Id}`} className="h-100 text-decoration-none" style={{ cursor: 'pointer' }}>
            <div style={{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
              <PhotographThumbnail 
                photograph={photograph} 
                width="100%" 
                style={{ objectFit: 'cover', height: '100%', width: '100%' }}
              />
            </div>
            <Card.Body>
              <Card.Title className="text-truncate" title={photograph.Title}>
                {photograph.Title}
              </Card.Title>
              <Card.Text as="div" className="small text-muted">
                <div className="mb-1">
                  <strong>Captured:</strong> {formatDateShort(photograph.CaptureTime)}
                </div>
                <div>
                  <strong>Uploaded:</strong> {formatDateShort(photograph.UploadTime)}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
