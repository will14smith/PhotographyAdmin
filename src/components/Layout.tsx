import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { useState } from "react";

import LoaderButton from "./LoaderButton";
import LayoutSidebar from "./LayoutSidebar";
import LayoutGrid from "./LayoutGrid";
import PhotographThumbnail from "./PhotographThumbnail";
import type { Photograph } from "../api/photograph";

interface Props {
  availablePhotographs: Photograph[];
  selectedPhotographs: Photograph[];

  onAddToLayout: (photograph: Photograph) => void;
  onRemoveFromLayout: (photographId: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onResize: (photographId: string, dimension: "Width" | "Height", delta: number) => void;

  loading: boolean;
  saving: boolean;
  error: string | null;

  onSave: () => void;
}

export default function Layout({
  availablePhotographs,
  selectedPhotographs,

  onAddToLayout,
  onRemoveFromLayout,
  onReorder,
  onResize,

  loading: isLoading,
  saving: isSaving,
  error,

  onSave
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activePhotograph = activeId
    ? selectedPhotographs.find((p) => `grid-${p.Id}` === activeId)
    : null;

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Reordering within grid
    if (activeData?.source === "grid" && overData?.source === "grid") {
      const oldIndex = selectedPhotographs.findIndex(
        (p) => p.Id === activeData.photograph.Id
      );
      const newIndex = selectedPhotographs.findIndex(
        (p) => p.Id === overData.photograph.Id
      );

      if (oldIndex !== newIndex) {
        onReorder(oldIndex, newIndex);
      }
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function render() {
    // Defensive check to ensure we have valid arrays
    const safeAvailablePhotographs = availablePhotographs || [];
    const safeSelectedPhotographs = selectedPhotographs || [];

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div style={{ display: "flex", height: "calc(100vh - 100px)" }}>
          {/* Left sidebar - available images */}
          <div style={{ width: "25%", minWidth: "200px", maxWidth: "300px" }}>
            <LayoutSidebar photographs={safeAvailablePhotographs} onAdd={onAddToLayout} />
          </div>

          {/* Right panel - grid layout */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid #dee2e6",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h4 className="mb-0">Layout Editor</h4>
              <div>
                <LoaderButton
                  type="button"
                  size="lg"
                  isLoading={isSaving}
                  onClick={onSave}
                  disabled={isSaving}
                >
                  <span>Save Layout</span>
                </LoaderButton>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              <SortableContext
                items={safeSelectedPhotographs.map((p) => `grid-${p.Id}`)}
                strategy={rectSortingStrategy}
              >
                <LayoutGrid
                  photographs={safeSelectedPhotographs}
                  onResize={onResize}
                  onRemove={onRemoveFromLayout}
                />
              </SortableContext>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activePhotograph ? (
            <div 
              style={{ 
                opacity: 0.9, 
                cursor: "grabbing",
                width: `${((activePhotograph.Layout?.Width || 1) * 150)}px`,
                height: `${((activePhotograph.Layout?.Height || 1) * 150)}px`,
                background: "#f8f9fa",
                border: "2px solid #0d6efd",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)"
              }}
            >
              <PhotographThumbnail 
                photograph={activePhotograph} 
                width="100%" 
                style={{ objectFit: "cover", height: "100%" }}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }

  return (
    <div>
      {isLoading ? (
        <h2 className="text-center text-muted mt-5">Loading...</h2>
      ) : error ? (
        <h2 className="text-center text-danger mt-5">{error}</h2>
      ) : (
        render()
      )}
    </div>
  );
}
