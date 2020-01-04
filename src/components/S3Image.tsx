import React, { useEffect, useState } from "react";

import { getImageUrl } from "../api/image";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  imageKey: string;
  alt?: string;
}

export default function S3Image({ imageKey, alt, ...props }: Props) {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    async function loadImage() {
      setLoading(true);

      try {
        const url = await getImageUrl(imageKey);

        setSrc(url);
        setLoading(false);
      } catch (err) {
        alert(err);
      }
    }

    loadImage();
  }, [imageKey]);

  return isLoading ? (
    <div {...props}>Loading...</div>
  ) : (
    <img {...props} alt={alt} src={src} />
  );
}
