import { put } from "aws-amplify/api";

export interface Layout {
  Order: number;

  Width: number | null;
  Height: number | null;
}

export interface LayoutModel {
  [id: string]: Layout;
}

export async function saveLayout(model: LayoutModel) {
  const operation = put({ apiName: "api", path: "/layout", options: { body: model as any } });
  await operation.response
}
