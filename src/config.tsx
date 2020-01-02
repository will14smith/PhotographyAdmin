const config = {
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    mandatorySignIn: true
  },
  Storage: {
    bucket: process.env.REACT_APP_IMAGE_BUCKET,
    region: process.env.REACT_APP_AWS_REGION,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID
  }
};

export default config;
