import React, { useEffect, useState } from "react";

import { getImageUrl } from "../api/image";

export interface Props extends React.HTMLAttributes<HTMLElement> {
  imageKey: string;
  alt?: string;
}

export default function S3Image(props: Props) {
  const [isLoading, setLoading] = useState(true);
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    async function loadImage() {
      setLoading(true);

      try {
        const url = await getImageUrl(props.imageKey);

        setSrc(url);
        setLoading(false);
      } catch (err) {
        alert(err);
      }
    }

    loadImage();
  }, [props.imageKey]);

  return isLoading ? (
    <div {...props}>Loading...</div>
  ) : (
    <img {...props} alt={props.alt} src={src} />
  );
}
