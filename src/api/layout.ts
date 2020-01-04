import { API } from "aws-amplify";

export interface Layout {
  Order: number;

  Width: number | null;
  Height: number | null;
}

export interface LayoutModel {
  [id: string]: Layout;
}

export async function saveLayout(model: LayoutModel) {
  await API.put("api", "/layout", { body: model });
}
