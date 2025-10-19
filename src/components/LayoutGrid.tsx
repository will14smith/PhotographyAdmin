import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Photograph } from "../api/photograph";
import PhotographThumbnail from "./PhotographThumbnail";
import "./LayoutGrid.css";

interface GridItemProps {
  photograph: Photograph;
  onResize: (photographId: string, dimension: "Width" | "Height", delta: number) => void;
  onRemove: (photographId: string) => void;
}

function GridItem({ photograph, onResize, onRemove }: GridItemProps) {
  const width = photograph.Layout?.Width || 1;
  const height = photograph.Layout?.Height || 1;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `grid-${photograph.Id}`,
    data: { photograph, source: "grid", width, height }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${width}`,
    gridRow: `span ${height}`,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const
  };

  return (
    <div ref={setNodeRef} style={style} className="layout-grid-item">
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ 
          flex: 1, 
          overflow: "hidden", 
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <PhotographThumbnail 
            photograph={photograph} 
            width="100%" 
            style={{ objectFit: "cover", height: "100%" }} 
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="layout-grid-controls">
        <button
          className="btn btn-sm btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(photograph.Id);
          }}
          title="Remove from layout"
        >
          ×
        </button>
      </div>

      {/* Width controls */}
      <div className="layout-grid-width-controls">
        <button
          className="btn btn-sm btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onResize(photograph.Id, "Width", -1);
          }}
          disabled={width <= 1}
          title="Decrease width"
        >
          −
        </button>
        <span className="layout-dimension-label">{width}</span>
        <button
          className="btn btn-sm btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onResize(photograph.Id, "Width", 1);
          }}
          disabled={width >= 3}
          title="Increase width"
        >
          +
        </button>
      </div>

      {/* Height controls */}
      <div className="layout-grid-height-controls">
        <button
          className="btn btn-sm btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onResize(photograph.Id, "Height", 1);
          }}
          disabled={height >= 3}
          title="Increase height"
        >
          +
        </button>
        <span className="layout-dimension-label">{height}</span>
        <button
          className="btn btn-sm btn-secondary"
          onClick={(e) => {
            e.stopPropagation();
            onResize(photograph.Id, "Height", -1);
          }}
          disabled={height <= 1}
          title="Decrease height"
        >
          −
        </button>
      </div>
    </div>
  );
}

interface Props {
  photographs: Photograph[];
  onResize: (photographId: string, dimension: "Width" | "Height", delta: number) => void;
  onRemove: (photographId: string) => void;
}

export default function LayoutGrid({ photographs, onResize, onRemove }: Props) {
  return (
    <div
      className="layout-grid-container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        padding: "1rem",
        minHeight: "calc(100vh / 4)"
      }}
    >
      {photographs.length === 0 ? (
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh / 4)",
            color: "#6c757d"
          }}
        >
          <p>Drag images here to add them to the layout</p>
        </div>
      ) : (
        photographs.map(photograph => (
          <GridItem
            key={photograph.Id}
            photograph={photograph}
            onResize={onResize}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
