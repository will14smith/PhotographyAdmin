import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import useLoader from "../utils/useLoader";
import {
  loadStory,
  updateStory,
  analyseStory,
} from "../api/story";
import type {
  Story,
  Section,
  Block,
  StoryAnalysis,
  StorySectionAnalysis,
} from "../api/story";

import { loadPhotographs } from "../api/photograph";
import type { Photograph } from "../api/photograph";
import LoaderButton from "../components/LoaderButton";
import StorySectionEditor from "../components/StorySectionEditor";
import StoryAnalysisModal from "../components/StoryAnalysisModal";

export default function StoryDetails() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Error: Story ID is missing.</div>;

  const [isSaving, setIsSaving] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [analyzedSections, setAnalyzedSections] = useState<Section[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    data: story,
    loading,
    error,
    setData: setStory,
  } = useLoader<Story | null>(null, () => loadStory(id), [id]);

  const { data: availablePhotographs } = useLoader<Photograph[]>([], loadPhotographs, []);

  async function handleSave() {
    if (!story) return;
    setIsSaving(true);
    try {
      const updatedStory = await updateStory(id!, story);
      setStory(updatedStory);
    } catch (e) {
      alert(e);
    }
    setIsSaving(false);
  }

  async function handleAnalyze() {
    setIsAnalyzing(true);
    try {
      const analysis: StoryAnalysis = await analyseStory(id!);
      const newSections: Section[] = analysis.Sections.map((sectionAnalysis: StorySectionAnalysis) => ({
        Id: crypto.randomUUID(),
        Title: sectionAnalysis.Title,
        Description: sectionAnalysis.Summary,
        Theme: sectionAnalysis.Theme,
        StartDate: sectionAnalysis.DateRange.Start,
        EndDate: sectionAnalysis.DateRange.End,
        Blocks: [],
      }));
      setAnalyzedSections(newSections);
      setShowAnalyzeModal(true);
    } catch (e) {
      alert(e);
    }
    setIsAnalyzing(false);
  }

  function handleApplyAnalysis() {
    if (!story || !analyzedSections) return;
    setStory({ ...story, Sections: analyzedSections });
    setShowAnalyzeModal(false);
    setAnalyzedSections(null);
  }

  function addSection() {
    if (!story) return;
    const newSection: Section = {
      Id: crypto.randomUUID(),
      Title: "",
      Description: "",
      Theme: "",
      StartDate: undefined,
      EndDate: undefined,
      Blocks: [],
    };
    setStory({ ...story, Sections: [...story.Sections, newSection] });
  }

  function removeSection(sectionId: string) {
    if (!story) return;
    setStory({
      ...story,
      Sections: story.Sections.filter((s) => s.Id !== sectionId),
    });
  }

  function moveSectionUp(index: number) {
    if (!story || index === 0) return;
    const newSections = [...story.Sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setStory({ ...story, Sections: newSections });
  }

  function moveSectionDown(index: number) {
    if (!story || index === story.Sections.length - 1) return;
    const newSections = [...story.Sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    setStory({ ...story, Sections: newSections });
  }

  function updateSection(sectionId: string, field: keyof Section, value: any) {
    if (!story) return;
    const updatedSections = story.Sections.map((s: Section) =>
      s.Id === sectionId ? { ...s, [field]: value } : s
    );
    setStory({ ...story, Sections: updatedSections });
  }

  function addBlockToSection(sectionId: string, blockType: "text" | "image" | "suggestion") {
    if (!story) return;
    let newBlock: Block;
    if (blockType === "text") {
      newBlock = { "$type": "text", Type: "text", Content: "" };
    } else if (blockType === "image") {
      newBlock = { "$type": "image", Type: "image", PhotographId: "" };
    } else {
      newBlock = { "$type": "suggestion", Type: "suggestion", Prompt: "" };
    }

    const updatedSections = story.Sections.map((s: Section) => {
      if (s.Id === sectionId) {
        return { ...s, Blocks: [...s.Blocks, newBlock] };
      }
      return s;
    });
    setStory({ ...story, Sections: updatedSections });
  }

  function removeBlock(sectionId: string, blockIndex: number) {
    if (!story) return;
    const updatedSections = story.Sections.map((s: Section) => {
      if (s.Id === sectionId) {
        return { ...s, Blocks: s.Blocks.filter((_, i) => i !== blockIndex) };
      }
      return s;
    });
    setStory({ ...story, Sections: updatedSections });
  }

  function moveBlockUp(sectionId: string, blockIndex: number) {
    if (!story || blockIndex === 0) return;
    const updatedSections = story.Sections.map((s: Section) => {
      if (s.Id === sectionId) {
        const newBlocks = [...s.Blocks];
        [newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [newBlocks[blockIndex], newBlocks[blockIndex - 1]];
        return { ...s, Blocks: newBlocks };
      }
      return s;
    });
    setStory({ ...story, Sections: updatedSections });
  }

  function moveBlockDown(sectionId: string, blockIndex: number) {
    if (!story) return;
    const updatedSections = story.Sections.map((s: Section) => {
      if (s.Id === sectionId) {
        if (blockIndex === s.Blocks.length - 1) return s;
        const newBlocks = [...s.Blocks];
        [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
        return { ...s, Blocks: newBlocks };
      }
      return s;
    });
    setStory({ ...story, Sections: updatedSections });
  }

  function updateBlock(sectionId: string, blockIndex: number, updates: any) {
    if (!story) return;
    const updatedSections = story.Sections.map((s: Section) => {
      if (s.Id === sectionId) {
        const updatedBlocks = s.Blocks.map((b: Block, i: number) =>
          i === blockIndex ? { ...b, ...updates } as Block : b
        );
        return { ...s, Blocks: updatedBlocks };
      }
      return s;
    });
    setStory({ ...story, Sections: updatedSections });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!story) return <div>Story not found</div>;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1>Story Details</h1>
            <div className="d-flex gap-2">
              <LoaderButton
                variant="secondary"
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
              >
                Analyze Story
              </LoaderButton>
              <LoaderButton isLoading={isSaving} onClick={handleSave}>
                Save Changes
              </LoaderButton>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={story.Title}
                  onChange={(e) => setStory({ ...story, Title: e.target.value })}
                />
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={story.StartDate ? story.StartDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setStory({ 
                        ...story, 
                        StartDate: e.target.value ? new Date(e.target.value) : undefined 
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={story.EndDate ? story.EndDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setStory({ 
                        ...story, 
                        EndDate: e.target.value ? new Date(e.target.value) : undefined 
                      })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Journal</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={story.Journal}
                  onChange={(e) => setStory({ ...story, Journal: e.target.value })}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Sections</h2>
            <Button onClick={addSection}>Add Section</Button>
          </div>

          {story.Sections.length === 0 ? (
            <Alert variant="info">
              No sections yet. Add a section manually or use "Analyze Story" to auto-generate sections.
            </Alert>
          ) : (
            story.Sections.map((section: Section, sectionIndex: number) => (
              <StorySectionEditor
                key={section.Id}
                storyId={id!}
                section={section}
                sectionIndex={sectionIndex}
                totalSections={story.Sections.length}
                availablePhotographs={availablePhotographs || []}
                onUpdate={updateSection}
                onRemove={removeSection}
                onMoveUp={moveSectionUp}
                onMoveDown={moveSectionDown}
                onAddBlock={addBlockToSection}
                onRemoveBlock={removeBlock}
                onMoveBlockUp={moveBlockUp}
                onMoveBlockDown={moveBlockDown}
                onUpdateBlock={updateBlock}
              />
            ))
          )}
        </Col>
      </Row>

      <StoryAnalysisModal
        show={showAnalyzeModal}
        analyzedSections={analyzedSections}
        onHide={() => setShowAnalyzeModal(false)}
        onApply={handleApplyAnalysis}
      />
    </Container>
  );
}
