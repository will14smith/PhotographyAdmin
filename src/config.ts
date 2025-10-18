import type { ResourcesConfig } from "aws-amplify";

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID || "",
      userPoolId: import.meta.env.VITE_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || "",      
    }
  },
  API: {
    REST: {
      api: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || "",
        region: import.meta.env.VITE_AWS_REGION
      }
    },
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_IMAGE_BUCKET,
      region: import.meta.env.VITE_AWS_REGION,
    }
  }
};

export default config;
