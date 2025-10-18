import type { MouseEvent } from "react";
import { Container, Row } from "react-bootstrap";

import type { Photograph } from "../api/photograph";
import PhotographThumbnail from "../components/PhotographThumbnail";

interface Props {
  photographs: Photograph[];
  onSelected: (event: MouseEvent, photograph: Photograph) => void;
}

export default function LayoutPreview({ photographs, onSelected }: Props) {
  return (
    <Container className="text-center">
      <Row className="align-items-center">
        {photographs.map(photograph => {
          const width = (photograph.Layout || { Width: 1 }).Width || 1;
          // TODO handle height

          return (
            <div
              className={`col-md-${4 * width} layout-cell`}
              onMouseDown={(e: MouseEvent) => onSelected(e, photograph)}
              key={photograph.Id}
            >
              <div className="card mb-4 box-shadow">
                <PhotographThumbnail photograph={photograph} width="100%" />
              </div>
            </div>
          );
        })}
      </Row>
    </Container>
  );
}
