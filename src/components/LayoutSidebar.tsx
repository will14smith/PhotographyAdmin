import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { Photograph } from "../api/photograph";
import PhotographThumbnail from "./PhotographThumbnail";

function formatDate(date: Date): string {
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface AvailableImageProps {
  photograph: Photograph;
  onAdd: (photograph: Photograph) => void;
}

function AvailableImage({ photograph, onAdd }: AvailableImageProps) {
  return (
    <div
      style={{
        marginBottom: "1rem",
        position: "relative"
      }}
      className="layout-sidebar-item"
    >
      <PhotographThumbnail photograph={photograph} width="100%" />
      <button
        className="btn btn-sm btn-success layout-sidebar-add-button"
        onClick={() => onAdd(photograph)}
        title="Add to layout"
      >
        +
      </button>
    </div>
  );
}

interface Props {
  photographs: Photograph[];
  onAdd: (photograph: Photograph) => void;
}

export default function LayoutSidebar({ photographs, onAdd }: Props) {
  const [searchText, setSearchText] = useState("");

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
    <div
      style={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #dee2e6"
      }}
    >
      <div style={{ padding: "1rem", paddingBottom: "0.5rem" }}>
        <h5 className="mb-2">Available Images</h5>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Filter by title or date..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ fontSize: "0.875rem" }}
        />
        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          {filteredPhotographs.length} of {photographs.length} shown
        </small>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", paddingTop: "0.5rem" }}>
        {filteredPhotographs.length === 0 ? (
          <p className="text-muted">
            {photographs.length === 0 ? "All images assigned" : "No matches found"}
          </p>
        ) : (
          filteredPhotographs.map(photograph => (
            <AvailableImage key={photograph.Id} photograph={photograph} onAdd={onAdd} />
          ))
        )}
      </div>
    </div>
  );
}
