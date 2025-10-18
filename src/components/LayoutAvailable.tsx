import { Container, Row, Col } from "react-bootstrap";

import type { Photograph } from "../api/photograph";
import PhotographThumbnail from "../components/PhotographThumbnail";

interface Props {
  photographs: Photograph[];
  onSelected: (photograph: Photograph) => void;
}

export default function LayoutAvailable({ photographs, onSelected }: Props) {
  return (
    <Container className="text-center">
      <Row className="mb-3 align-items-center">
        {photographs.map(photograph => (
          <Col md={{ span: "4" }} key={photograph.Id}>
            <PhotographThumbnail
              photograph={photograph}
              onClick={() => onSelected(photograph)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
