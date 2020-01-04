import { Storage } from "aws-amplify";

export enum ImageType {
  Full = "Full",
  Thumbnail = "Thumbnail"
}
export interface Image {
  Type: ImageType;
  ObjectKey: string;
}

function generateKey(length = 40) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export async function getImageUrl(key: string): Promise<string> {
  const url = await Storage.get(key, {
    customPrefix: { public: "" },
    level: "public",
    download: false
  });

  return url as string;
}

export async function uploadImage(image: File): Promise<string> {
  const { key }: any = await Storage.put("image/" + generateKey(), image, {
    contentType: image.type,
    customPrefix: { public: "" },
    level: "public"
  });

  return key;
}
