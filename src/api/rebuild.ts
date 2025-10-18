import { post } from "aws-amplify/api";

export async function rebuildSite() {
  const operation = post({ apiName: "api", path: "/generate", options: { body: {} } });
  await operation.response;
}
