import { useState, useMemo } from "react";

import { loadPhotographs } from "../api/photograph";
import type { Photograph } from "../api/photograph";
import { saveLayout } from "../api/layout";
import type { LayoutModel } from "../api/layout";
import LayoutComponent from "../components/Layout";
import useLoader from "../utils/useLoader";

export default function Layout() {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: photographs, setData: setPhotographs, loading, error } = useLoader([], loadPhotographs, []);

  const availablePhotographs = useMemo(
    () => photographs.filter(p => !p.Layout),
    [photographs]
  );
  const selectedPhotographs = useMemo(
    () =>
      photographs
        .filter(x => x.Layout)
        .sort((a, b) => (a.Layout?.Order || 0) - (b.Layout?.Order || 0)),
    [photographs]
  );

  async function save() {
    const layout: LayoutModel = {};
    photographs.forEach(p => {
      if (p.Layout) {
        layout[p.Id] = p.Layout;
      }
    });

    setSaving(true);
    setSaveError(null);

    try {
      await saveLayout(layout);
    } catch (err) {
      setSaveError("Failed to save layout: " + err);
    }

    setSaving(false);
  }

  function onAddToLayout(photograph: Photograph) {
    if (saving) {
      return;
    }

    const updatedPhotograph: Photograph = {
      ...photograph,
      Layout: {
        Order: selectedPhotographs.length + 1,
        Width: 1,
        Height: 1
      }
    };

    const updatedPhotographs = updatePhotographInArray(
      photographs,
      updatedPhotograph
    );

    setPhotographs(updatedPhotographs);
  }

  function onRemoveFromLayout(photographId: string) {
    if (saving) {
      return;
    }

    const photograph = photographs.find(p => p.Id === photographId);
    if (!photograph || !photograph.Layout) {
      return;
    }

    const removedOrder = photograph.Layout.Order;

    // Remove layout from photograph
    let updatedPhotographs = updatePhotographInArray(photographs, {
      ...photograph,
      Layout: undefined
    });

    // Reorder remaining photographs
    updatedPhotographs = updatedPhotographs.map(p => {
      if (p.Layout && p.Layout.Order > removedOrder) {
        return {
          ...p,
          Layout: {
            ...p.Layout,
            Order: p.Layout.Order - 1
          }
        };
      }
      return p;
    });

    setPhotographs(updatedPhotographs);
  }

  function onReorder(oldIndex: number, newIndex: number) {
    if (saving || oldIndex === newIndex) {
      return;
    }

    const reorderedPhotographs = [...selectedPhotographs];
    const [movedItem] = reorderedPhotographs.splice(oldIndex, 1);
    reorderedPhotographs.splice(newIndex, 0, movedItem);

    // Update orders
    let updatedPhotographs = [...photographs];
    reorderedPhotographs.forEach((p, index) => {
      const updated = {
        ...p,
        Layout: p.Layout ? { ...p.Layout, Order: index + 1 } : undefined
      };
      updatedPhotographs = updatePhotographInArray(updatedPhotographs, updated);
    });

    setPhotographs(updatedPhotographs);
  }

  function onResize(photographId: string, dimension: "Width" | "Height", delta: number) {
    if (saving) {
      return;
    }

    const photograph = photographs.find(p => p.Id === photographId);
    if (!photograph || !photograph.Layout) {
      return;
    }

    const currentValue = photograph.Layout[dimension] || 1;
    const newValue = Math.max(1, Math.min(3, currentValue + delta));

    if (currentValue === newValue) {
      return;
    }

    const updatedPhotograph: Photograph = {
      ...photograph,
      Layout: {
        ...photograph.Layout,
        [dimension]: newValue
      }
    };

    const updatedPhotographs = updatePhotographInArray(
      photographs,
      updatedPhotograph
    );

    setPhotographs(updatedPhotographs);
  }

  return (
    <LayoutComponent
      availablePhotographs={availablePhotographs}
      selectedPhotographs={selectedPhotographs}
      onAddToLayout={onAddToLayout}
      onRemoveFromLayout={onRemoveFromLayout}
      onReorder={onReorder}
      onResize={onResize}
      loading={loading}
      saving={saving}
      error={error || saveError}
      onSave={save}
    />
  );
}

function updatePhotographInArray(
  photographs: Photograph[],
  photograph: Photograph
) {
  const updatedPhotographs = [...photographs];

  const index = updatedPhotographs.findIndex(p => p.Id === photograph.Id);
  updatedPhotographs[index] = photograph;

  return updatedPhotographs;
}
