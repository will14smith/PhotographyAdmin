import { useState } from "react";
import { Card, Form, Button, ButtonGroup, Row, Col } from "react-bootstrap";
import type { Block, TextBlock, ImageBlock, SuggestionBlock } from "../api/story";
import type { Photograph } from "../api/photograph";
import S3Image from "./S3Image";
import PhotographSelectorModal from "./PhotographSelectorModal";

interface StoryBlockEditorProps {
  block: Block;
  blockIndex: number;
  totalBlocks: number;
  sectionId: string;
  availablePhotographs: Photograph[];
  onRemove: (sectionId: string, blockIndex: number) => void;
  onMoveUp: (sectionId: string, blockIndex: number) => void;
  onMoveDown: (sectionId: string, blockIndex: number) => void;
  onUpdate: (sectionId: string, blockIndex: number, updates: Partial<Block>) => void;
}

export default function StoryBlockEditor({
  block,
  blockIndex,
  totalBlocks,
  sectionId,
  availablePhotographs,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdate,
}: StoryBlockEditorProps) {
  const [showPhotographSelector, setShowPhotographSelector] = useState(false);

  return (
    <Card className={`mb-2 ${block.Type === "suggestion" ? "border-info" : "bg-light"}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <small className={block.Type === "suggestion" ? "text-info" : "text-muted"}>
            Block {blockIndex + 1} ({block.Type})
          </small>
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => onMoveUp(sectionId, blockIndex)}
              disabled={blockIndex === 0}
            >
              ↑
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => onMoveDown(sectionId, blockIndex)}
              disabled={blockIndex === totalBlocks - 1}
            >
              ↓
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => onRemove(sectionId, blockIndex)}
            >
              ×
            </Button>
          </ButtonGroup>
        </div>

        {block.Type === "text" && (
          <Form.Control
            as="textarea"
            rows={3}
            value={(block as TextBlock).Content}
            onChange={(e) => onUpdate(sectionId, blockIndex, { Content: e.target.value })}
            placeholder="Enter text content..."
          />
        )}

        {block.Type === "image" && (
          <>
            <Row>
              {(block as ImageBlock).PhotographId && (
                <Col lg={{ span: "auto" }}>
                  {(() => {
                    const photograph = availablePhotographs.find(
                      (p) => p.Id === (block as ImageBlock).PhotographId
                    );
                    return photograph && photograph.Images[0]?.ObjectKey ? (
                      <S3Image imageKey={photograph.Images[0].ObjectKey} style={{ maxWidth: "200px",  maxHeight: "200px" }} />
                    ) : null;
                  })()}
                </Col>
              )}
              <Col className="mt-2 mt-lg-0">
                <Form.Group>
                  <Form.Label visuallyHidden>Photograph</Form.Label>
                  <div className="d-flex gap-2 align-items-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowPhotographSelector(true)}
                    >
                      {(block as ImageBlock).PhotographId ? "Change Photograph" : "Select Photograph"}
                    </Button>
                    {(block as ImageBlock).PhotographId && (
                      <span className="text-muted small">
                        {availablePhotographs.find((p) => p.Id === (block as ImageBlock).PhotographId)?.Title || "Unknown"}
                      </span>
                    )}
                  </div>
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label visuallyHidden>Caption</Form.Label>
                  <Form.Control
                    type="text"
                    value={(block as ImageBlock).Caption || ""}
                    onChange={(e) => onUpdate(sectionId, blockIndex, { Caption: e.target.value })}
                    placeholder="Optional caption..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <PhotographSelectorModal
              show={showPhotographSelector}
              onHide={() => setShowPhotographSelector(false)}
              onSelect={(photographId) => onUpdate(sectionId, blockIndex, { PhotographId: photographId })}
              availablePhotographs={availablePhotographs}
              selectedPhotographId={(block as ImageBlock).PhotographId}
            />
          </>
        )}

        {block.Type === "suggestion" && (
          <>
            <Form.Control
              as="textarea"
              rows={2}
              value={(block as SuggestionBlock).Prompt}
              onChange={(e) => onUpdate(sectionId, blockIndex, { Prompt: e.target.value })}
              placeholder="Enter photo suggestion prompt..."
            />
            <div className="mt-2 d-flex gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => onUpdate(sectionId, blockIndex, {  "$type": "text", Type: "text", Content: (block as SuggestionBlock).Prompt })}
              >
                Convert to Text
              </Button>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => onUpdate(sectionId, blockIndex, { "$type": "image", Type: "image", PhotographId: "", Caption: (block as SuggestionBlock).Prompt })}
              >
                Convert to Image
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
