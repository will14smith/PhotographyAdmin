import { API } from "aws-amplify";

import { Image } from "./image";
import { Layout } from "./layout";

export interface Photograph {
  Id: string;
  Title: string;
  Layout?: Layout;

  Images: Image[];

  CaptureTime: Date;
  UploadTime: Date;
}

export interface PhotographNew {
  Title: string;
  ImageKey: string;
  CaptureTime: Date;
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

export async function newPhotograph(model: PhotographNew): Promise<Photograph> {
  const apiModel = await API.post("api", `/photograph`, { body: model });

  return toAppModel(apiModel);
}

export async function updatePhotograph(
  id: string,
  model: PhotographUpdate
): Promise<Photograph> {
  const apiModel = await API.put("api", `/photograph/${id}`, { body: model });

  return toAppModel(apiModel);
}
