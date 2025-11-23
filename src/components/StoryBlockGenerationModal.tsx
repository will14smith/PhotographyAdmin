import { Modal, Button, Alert, Card } from "react-bootstrap";
import type { Block, ImageBlock, TextBlock, SuggestionBlock } from "../api/story";
import type { Photograph } from "../api/photograph";

interface StoryBlockGenerationModalProps {
  show: boolean;
  generatedBlocks: Block[] | null;
  sectionTitle: string;
  availablePhotographs: Photograph[];
  onHide: () => void;
  onApply: () => void;
}

export default function StoryBlockGenerationModal({
  show,
  generatedBlocks,
  sectionTitle,
  availablePhotographs,
  onHide,
  onApply,
}: StoryBlockGenerationModalProps) {
  const getPhotographTitle = (photographId: string) => {
    const photo = availablePhotographs.find(p => p.Id === photographId);
    return photo?.Title || photographId;
  };

  const renderBlockPreview = (block: Block, index: number) => {
    if (block.Type === "text") {
      const textBlock = block as TextBlock;
      return (
        <Card key={index} className="mb-2">
          <Card.Body>
            <div className="small text-muted mb-1">Text Block</div>
            <p className="mb-0">{textBlock.Content}</p>
          </Card.Body>
        </Card>
      );
    } else if (block.Type === "image") {
      const imageBlock = block as ImageBlock;
      return (
        <Card key={index} className="mb-2">
          <Card.Body>
            <div className="small text-muted mb-1">Image Block</div>
            <div><strong>Photo:</strong> {getPhotographTitle(imageBlock.PhotographId)}</div>
            {imageBlock.Caption && <div className="text-muted small mt-1">{imageBlock.Caption}</div>}
          </Card.Body>
        </Card>
      );
    } else if (block.Type === "suggestion") {
      const suggestionBlock = block as SuggestionBlock;
      return (
        <Card key={index} className="mb-2 border-info">
          <Card.Body>
            <div className="small text-info mb-1">Suggestion Block</div>
            <p className="mb-0 fst-italic">{suggestionBlock.Prompt}</p>
          </Card.Body>
        </Card>
      );
    }
    return null;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Generated Blocks Preview - {sectionTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning">
          Applying these blocks will replace all existing blocks in this section. Review the generated blocks below.
        </Alert>
        {generatedBlocks && generatedBlocks.length > 0 ? (
          generatedBlocks.map((block, index) => renderBlockPreview(block, index))
        ) : (
          <Alert variant="info">No blocks were generated.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onApply}>
          Apply Blocks
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
