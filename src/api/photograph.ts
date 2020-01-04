import { API } from "aws-amplify";

export enum ImageType {
  Full = "Full",
  Thumbnail = "Thumbnail"
}
export interface Image {
  Type: ImageType;
  ObjectKey: string;
}
export interface Photograph {
  Id: string;
  Title: string;
  // Layout?: LayoutModel;

  Images: Image[];

  CaptureTime: Date;
  UploadTime: Date;
}

export interface PhotographUpdate {
  Title: string;
  CaptureTime: Date;
}

function toAppModel(apiModel: any): Photograph {
  return {
    ...apiModel,

    CaptureTime: new Date(apiModel.CaptureTime),
    UploadTime: new Date(apiModel.UploadTime)
  };
}

export async function loadPhotographs(): Promise<Photograph[]> {
  const apiModels = await API.get("api", "/photograph", {});

  return apiModels.map(toAppModel);
}

export async function loadPhotograph(id: string): Promise<Photograph> {
  const apiModel = await API.get("api", `/photograph/${id}`, {});

  return toAppModel(apiModel);
}

export async function updatePhotograph(
  id: string,
  model: PhotographUpdate
): Promise<Photograph> {
  const apiModel = await API.put("api", `/photograph/${id}`, { body: model });

  return toAppModel(apiModel);
}
