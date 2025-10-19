import { get, post, put } from "aws-amplify/api";

import type { Image } from "./image";
import type { Layout } from "./layout";

export interface Photograph {
  Id: string;
  Title: string;
  Layout?: Layout;

  Images: Image[];

  CaptureTime: Date;
  UploadTime: Date;
}

export interface PhotographCreate {
  ImageKey: string;
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

export interface TitleSuggestion {
  Title: string;
}

export interface ThumbnailRequest {
  Width?: number;
  Height?: number;
}

function toAppModel(apiModel: any): Photograph {
  return {
    ...apiModel,

    CaptureTime: new Date(apiModel.CaptureTime),
    UploadTime: new Date(apiModel.UploadTime)
  };
}

export async function loadPhotographs(): Promise<Photograph[]> {
  const operation = get({ apiName: "api", path: "/photograph" });
  const response = await operation.response;
  const apiModels = (await response.body.json()) as any[];

  return apiModels.map(toAppModel);
}

export async function loadPhotograph(id: string): Promise<Photograph> {
  const operation = get({ apiName: "api", path: `/photograph/${id}` });
  const response = await operation.response;

  return toAppModel(await response.body.json());
}

export async function createPhotograph(model: PhotographCreate): Promise<Photograph> {
  const operation = post({ apiName: "api", path: `/photograph`, options: { body: model as any } });
  const response = await operation.response;

  return toAppModel(await response.body.json());
}

export async function newPhotograph(model: PhotographNew): Promise<Photograph> {
  const operation = post({ apiName: "api", path: `/photograph`, options: { body: model as any } });
  const response = await operation.response;

  return toAppModel(await response.body.json());
}

export async function updatePhotograph(
  id: string,
  model: PhotographUpdate
): Promise<Photograph> {
  const operation = put({ apiName: "api", path: `/photograph/${id}`, options: { body: model as any } });
  const response = await operation.response;

  return toAppModel(await response.body.json());
}

export async function getSuggestions(id: string): Promise<TitleSuggestion[]> {
  const operation = post({ apiName: "api", path: `/photograph/${id}/suggestions` });
  const response = await operation.response;
  const suggestions = (await response.body.json()) as any;

  return suggestions.map((x: any) => ({ Title: x })) as TitleSuggestion[];
}

export async function generateThumbnail(id: string, request: ThumbnailRequest): Promise<Photograph> {
  const operation = post({ 
    apiName: "api", 
    path: `/photograph/${id}/thumbnail`, 
    options: { body: request as any } 
  });
  const response = await operation.response;

  return toAppModel(await response.body.json());
}
