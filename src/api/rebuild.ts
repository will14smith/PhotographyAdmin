import { API } from "aws-amplify";

export async function rebuildSite() {
  await API.post("api", "/generate", { body: {} });
}
