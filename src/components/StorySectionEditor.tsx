import { useState } from "react";
import { Card, Form, Button, ButtonGroup, Row, Col, Alert } from "react-bootstrap";
import type { Section, Block, StorySectionAnalysis } from "../api/story";
import { analyseSection } from "../api/story";
import type { Photograph } from "../api/photograph";
import StoryBlockEditor from "./StoryBlockEditor";
import LoaderButton from "./LoaderButton";
import StoryBlockGenerationModal from "./StoryBlockGenerationModal";

interface StorySectionEditorProps {
  storyId: string;
  section: Section;
  sectionIndex: number;
  totalSections: number;
  availablePhotographs: Photograph[];
  onUpdate: (sectionId: string, field: keyof Section, value: any) => void;
  onRemove: (sectionId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddBlock: (sectionId: string, blockType: "text" | "image" | "suggestion") => void;
  onRemoveBlock: (sectionId: string, blockIndex: number) => void;
  onMoveBlockUp: (sectionId: string, blockIndex: number) => void;
  onMoveBlockDown: (sectionId: string, blockIndex: number) => void;
  onUpdateBlock: (sectionId: string, blockIndex: number, updates: Partial<Block>) => void;
}

export default function StorySectionEditor({
  storyId,
  section,
  sectionIndex,
  totalSections,
  availablePhotographs,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onUpdateBlock,
}: StorySectionEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBlocksModal, setShowBlocksModal] = useState(false);
  const [generatedBlocks, setGeneratedBlocks] = useState<Block[] | null>(null);

  async function handleGenerateBlocks() {
    setIsGenerating(true);
    try {
      const sectionAnalysis: StorySectionAnalysis = {
        Title: section.Title || "",
        Summary: section.Description || "",
        Theme: section.Theme || "",
        DateRange: {
          Start: section.StartDate,
          End: section.EndDate,
        },
      };

      const newBlocks = await analyseSection(storyId, sectionAnalysis);
      setGeneratedBlocks(newBlocks);
      setShowBlocksModal(true);
    } catch (e) {
      alert(e);
    }
    setIsGenerating(false);
  }

  function handleApplyBlocks() {
    if (!generatedBlocks) return;
    onUpdate(section.Id, "Blocks", generatedBlocks);
    setShowBlocksModal(false);
    setGeneratedBlocks(null);
  }

  const formatDateForInput = (date?: Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const formatDateRange = () => {
    const start = section.StartDate ? new Date(section.StartDate).toLocaleDateString() : null;
    const end = section.EndDate ? new Date(section.EndDate).toLocaleDateString() : null;
    
    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return start;
    } else if (end) {
      return end;
    }
    return "No dates set";
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className={`d-flex justify-content-between align-items-start ${isCollapsed ? "" : "mb-3"}`}>
          <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-0 text-decoration-none"
              style={{ minWidth: "24px" }}
            >
              {isCollapsed ? "▶" : "▼"}
            </Button>
            <div onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: "pointer" }}>
              <h4 className="mb-0">
                {section.Title || `Section ${sectionIndex + 1}`}
              </h4>
              {isCollapsed && (
                <small className="text-muted">{formatDateRange()}</small>
              )}
            </div>
          </div>
          <ButtonGroup size="sm">
            <Button
              variant="outline-secondary"
              onClick={() => onMoveUp(sectionIndex)}
              disabled={sectionIndex === 0}
            >
              ↑
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => onMoveDown(sectionIndex)}
              disabled={sectionIndex === totalSections - 1}
            >
              ↓
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => onRemove(section.Id)}
            >
              Remove
            </Button>
          </ButtonGroup>
        </div>

        {!isCollapsed && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={section.Title || ""}
                onChange={(e) => onUpdate(section.Id, "Title", e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={section.Description || ""}
                onChange={(e) => onUpdate(section.Id, "Description", e.target.value)}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Theme</Form.Label>
                  <Form.Control
                    type="text"
                    value={section.Theme || ""}
                    onChange={(e) => onUpdate(section.Id, "Theme", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formatDateForInput(section.StartDate)}
                    onChange={(e) => onUpdate(section.Id, "StartDate", e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formatDateForInput(section.EndDate)}
                    onChange={(e) => onUpdate(section.Id, "EndDate", e.target.value ? new Date(e.target.value) : undefined)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Blocks</h5>
                <div className="d-flex gap-2">
                  <LoaderButton
                    size="sm"
                    variant="info"
                    onClick={handleGenerateBlocks}
                    isLoading={isGenerating}
                  >
                    Generate Blocks
                  </LoaderButton>
                  <Button size="sm" onClick={() => onAddBlock(section.Id, "text")}>
                    + Text
                  </Button>
                  <Button size="sm" onClick={() => onAddBlock(section.Id, "image")}>
                    + Image
                  </Button>
                  <Button size="sm" onClick={() => onAddBlock(section.Id, "suggestion")}>
                    + Suggestion
                  </Button>
                </div>
              </div>

              {section.Blocks.length === 0 ? (
                <Alert variant="secondary">
                  No blocks in this section. Add blocks manually or use "Generate Blocks".
                </Alert>
              ) : (
                section.Blocks.map((block, blockIndex) => (
                  <StoryBlockEditor
                    key={blockIndex}
                    block={block}
                    blockIndex={blockIndex}
                    totalBlocks={section.Blocks.length}
                    sectionId={section.Id}
                    availablePhotographs={availablePhotographs}
                    onRemove={onRemoveBlock}
                    onMoveUp={onMoveBlockUp}
                    onMoveDown={onMoveBlockDown}
                    onUpdate={onUpdateBlock}
                  />
                ))
              )}
            </div>
          </>
        )}
      </Card.Body>

      <StoryBlockGenerationModal
        show={showBlocksModal}
        generatedBlocks={generatedBlocks}
        sectionTitle={section.Title || "Section"}
        availablePhotographs={availablePhotographs}
        onHide={() => setShowBlocksModal(false)}
        onApply={handleApplyBlocks}
      />
    </Card>
  );
}
