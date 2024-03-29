import React, { useState, useMemo, MouseEvent } from "react";

import { Photograph, loadPhotographs } from "../api/photograph";
import { saveLayout, LayoutModel } from "../api/layout";
import LayoutComponent from "../components/Layout";
import useLoader from "../utils/useLoader";

export default function Layout() {
  const [saving, setSaving] = useState(false);

  const { data: photographs, setData: setPhotographs, loading, error, setError } = useLoader([], loadPhotographs, []);

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
    setError(null);

    try {
      await saveLayout(layout);
    } catch (err) {
      setError("" + err);
    }

    setSaving(false);
  }

  function onAvailableSelected(photograph: Photograph) {
    if (saving) {
      return;
    }

    const updatedPhotographs = updatePhotographInArray(
      photographs,
      setOrder(photograph, selectedPhotographs.length + 1)
    );

    setPhotographs(updatedPhotographs);
  }

  function onPreviewSelected(event: MouseEvent, photograph: Photograph) {
    if (saving) {
      return;
    }

    let updatedPhotographs = handlePreviewSelected(
      event,
      photographs,
      photograph
    );

    setPhotographs(updatedPhotographs);
  }

  return (
    <LayoutComponent
      availablePhotographs={availablePhotographs}
      selectedPhotographs={selectedPhotographs}
      onAvailableSelected={onAvailableSelected}
      onPreviewSelected={onPreviewSelected}
      loading={loading}
      saving={saving}
      error={error}
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

function setOrder(photograph: Photograph, order: number) {
  const layout = photograph.Layout || { Width: null, Height: null };

  return {
    ...photograph,
    Layout: {
      ...layout,
      Order: order
    }
  };
}

function handlePreviewSelected(
  event: MouseEvent,
  photographs: Photograph[],
  photograph: Photograph
) {
  if (event.ctrlKey && event.button === 0) {
    // remove
    photographs = updatePhotographInArray(photographs, {
      ...photograph,
      Layout: undefined
    });

    photographs = photographs
      .filter(p => (p.Layout?.Order || 0) > (photograph.Layout?.Order || 0))
      .map(p => setOrder(p, (p.Layout?.Order || 0) - 1))
      .reduce((acc, p) => updatePhotographInArray(acc, p), photographs);
  } else if (event.shiftKey) {
    event.preventDefault();

    const width = photograph.Layout?.Width || 1;
    switch (event.button) {
      case 0: // inc width
        if (width >= 3) {
          break;
        }

        photographs = updatePhotographInArray(photographs, {
          ...photograph,
          Layout: photograph.Layout && {
            ...photograph.Layout,
            Width: width + 1
          }
        });
        break;
      case 2: // dec width
        if (width <= 1) {
          break;
        }

        photographs = updatePhotographInArray(photographs, {
          ...photograph,
          Layout: photograph.Layout && {
            ...photograph.Layout,
            Width: width - 1
          }
        });
        break;
    }
  } else {
    event.preventDefault();

    let offset = 0;
    switch (event.button) {
      case 0: // inc order
        offset = 1;
        break;
      case 2: // dec order
        offset = -1;
        break;
    }

    const order = photograph.Layout?.Order || -1;
    const newOrder = order + offset;

    const otherPhotograph = photographs.find(
      p => p.Layout && p.Layout.Order === newOrder
    );

    if (otherPhotograph) {
      photographs = updatePhotographInArray(
        photographs,
        setOrder(photograph, newOrder)
      );
      photographs = updatePhotographInArray(
        photographs,
        setOrder(otherPhotograph, order)
      );
    }
  }

  return photographs;
}
