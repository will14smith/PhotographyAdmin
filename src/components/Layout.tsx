import React, { MouseEvent } from "react";

import LayoutAvailable from "./LayoutAvailable";
import LayoutPreview from "./LayoutPreview";
import LoaderButton from "./LoaderButton";
import { Photograph } from "../api/photograph";

interface Props {
  availablePhotographs: Photograph[];
  selectedPhotographs: Photograph[];

  onAvailableSelected: (photograph: Photograph) => void;
  onPreviewSelected: (event: MouseEvent, photograph: Photograph) => void;

  loading: boolean;
  saving: boolean;
  error: string | null;

  onSave: () => void;
}

export default function Layout({
  availablePhotographs,
  selectedPhotographs,

  onAvailableSelected,
  onPreviewSelected,

  loading: isLoading,
  saving: isSaving,
  error,

  onSave
}: Props) {
  function render() {
    return (
      <div>
        <LayoutPreview
          photographs={selectedPhotographs}
          onSelected={onPreviewSelected}
        />
        <LoaderButton
          type="button"
          size="lg"
          isLoading={isSaving}
          onClick={onSave}
        >
          <span>Save</span>
        </LoaderButton>
        <hr />
        <h3 className="text-muted text-center">Available Images</h3>
        <LayoutAvailable
          photographs={availablePhotographs}
          onSelected={onAvailableSelected}
        />
        <hr />
        <h3 className="text-muted text-center">Controls</h3>
        <dl className="row">
          <dt className="col-sm-3">Left Click</dt>
          <dd className="col-sm-9">Switch image with next image</dd>
          <dt className="col-sm-3">Right Click</dt>
          <dd className="col-sm-9">Switch image with previous image</dd>

          <dt className="col-sm-3">Shift + Left Click</dt>
          <dd className="col-sm-9">Increase size (up to 3)</dd>
          <dt className="col-sm-3">Shift + Right Click</dt>
          <dd className="col-sm-9">Decrease size</dd>

          <dt className="col-sm-3">Ctrl + Left Click</dt>
          <dd className="col-sm-9">Remove image</dd>
        </dl>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {isLoading ? (
        <h2 className="text-center text-muted">Loading...</h2>
      ) : error ? (
        <h2 className="text-center text-danger ">{error}</h2>
      ) : (
        render()
      )}
    </div>
  );
}
