import { useState, useMemo } from "react";
import { Form, Button, InputGroup, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCalendar, faBook } from "@fortawesome/free-solid-svg-icons";

import { loadStories } from "../api/story";
import type { Story } from "../api/story";
import useLoader from "../utils/useLoader";
import { formatDate, formatDateRange } from "../utils/dates";

export default function StoriesList() {
  const { data: stories, loading, error } = useLoader<Story[]>([], loadStories, []);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Configure Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    return new Fuse(stories, {
      keys: [
        { name: 'Title', weight: 2 },
        { name: 'Journal', weight: 0.5 },
        { name: 'StartDate', weight: 0.5 },
        { name: 'EndDate', weight: 0.5 }
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 1
    });
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (!searchText.trim()) {
      return stories;
    }

    const results = fuse.search(searchText);
    return results.map(result => result.item);
  }, [fuse, stories, searchText]);

  return (
    <Container fluid className="mt-3">
      {/* Search and Create Input Group */}
      {!loading && !error && (
        <div className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by title, journal, or date..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              variant="primary" 
              onClick={() => navigate('/stories/new')}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              New Story
            </Button>
          </InputGroup>
          {searchText && stories.length > 0 && (
            <small className="text-muted">
              Showing {filteredStories.length} of {stories.length} stories
            </small>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <h2 className="text-muted">Loading...</h2>
        </div>
      ) : error || !stories ? (
        <div className="text-center mt-5">
          <h2 className="text-danger">
            {error || "Failed to load stories"}
          </h2>
        </div>
      ) : (
        renderStoriesGrid(filteredStories, searchText)
      )}
    </Container>
  );
}

function renderStoriesGrid(stories: Story[], searchText: string) {
  if (stories.length === 0 && searchText) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">No stories match your search</p>
      </div>
    );
  }
  
  if (stories.length === 0) {
    return (
      <div className="text-center mt-5">
        <p className="text-muted">No stories yet. Click New Story to create one!</p>
      </div>
    );
  }

  return (
    <Row xs={1} sm={2} md={2} lg={3} className="g-4">
      {stories.map(story => (
        <Col key={story.Id}>
          <Card 
            as={Link} 
            to={`/stories/${story.Id}`} 
            className="h-100 text-decoration-none" 
            style={{ cursor: 'pointer' }}
          >
            <Card.Body>
              <Card.Title className="d-flex align-items-center mb-3">
                <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                <span className="text-truncate" title={story.Title}>
                  {story.Title}
                </span>
              </Card.Title>
              
              <Card.Text as="div" className="small">
                <div className="mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="me-2 text-muted" />
                  <span className="text-muted">
                    {formatDateRange(story.StartDate, story.EndDate)}
                  </span>
                </div>
                
                {story.Sections && story.Sections.length > 0 ? (
                  <div className="text-muted">
                    {story.Sections.length} {story.Sections.length === 1 ? 'section' : 'sections'}
                  </div>
                ) : <div className="text-muted">No sections yet</div>}
              </Card.Text>
            </Card.Body>
            
            <Card.Footer className="text-muted small">
              Created: {formatDate(story.CreatedAt)}
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
