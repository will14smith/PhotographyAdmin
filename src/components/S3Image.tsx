import React from "react";

import { getImageUrl } from "../api/image";
import useLoader from "../utils/useLoader";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  imageKey: string;
  alt?: string;
}

export default function S3Image({ imageKey, alt, ...props }: Props) {
  const { data: src, loading, error } = useLoader("", () => getImageUrl(imageKey), [imageKey]);

   return loading ? (
    <div {...props}>Loading...</div>
  ) : error ? (
    <div {...props}>Error: {error}</div>
  ) : (
    <img {...props} alt={alt} src={src} />
  );
}
