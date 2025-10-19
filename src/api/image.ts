import { getUrl, uploadData } from "aws-amplify/storage";

export type ImageType = "Full" | "Thumbnail";
export const ImageTypeFull: ImageType = "Full";
export const ImageTypeThumbnail: ImageType = "Thumbnail";

export interface Image {
  Type: ImageType;
  ObjectKey: string;
  Width?: number;
  Height?: number;
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
  const result = await getUrl({ path: key });

  return result.url.toString();
}

export async function uploadImage(image: File): Promise<string> {
  var upload = uploadData({
    path: "image/" + generateKey(),
    data: image,
    options: {
      contentType: image.type,
    }
  });

  const result = await upload.result;

  return result.path;
}
