import * as React from "react";

import { ImageType } from "../api/image";
import { Photograph } from "../api/photograph";
import S3Image from "./S3Image";

import "./PhotographThumbnail.css";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  photograph: Photograph;
  width?: string;
}

export default function PhotographThumbnail({
  photograph,
  width,
  ...props
}: Props) {
  const thumbnail = photograph.Images.find(x => x.Type === ImageType.Thumbnail);
  if (!thumbnail) {
    return (
      <img
        className="PhotographThumbnail"
        src={`https://via.placeholder.com/${width || "350px"}?text=?`}
        alt={photograph.Title}
        title={photograph.Title}
        {...props}
      />
    );
  }

  return (
    <S3Image
      className="PhotographThumbnail"
      imageKey={thumbnail.ObjectKey}
      alt={photograph.Title}
      title={photograph.Title}
      style={{ width }}
      {...props}
    />
  );
}
