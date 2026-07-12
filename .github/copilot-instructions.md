# Guiding Principles for AI-Powered Development

This document provides essential guidance for AI agents to effectively contribute to this codebase.

## About this Project

This is a React single-page application (SPA) that serves as an admin UI for a serverless photography website. It allows for managing photographs, layouts, and other aspects of the site.

## Core Technologies

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **UI**: React-Bootstrap
- **Routing**: React Router DOM v6
- **AWS Integration**: `aws-amplify` for authentication (Cognito), API calls (API Gateway), and storage (S3).
- **Searching**: `fuse.js` for client-side fuzzy search.

## Architecture Overview

The application is a client-side SPA that communicates with a backend REST API.

- **Authentication**: Handled by AWS Cognito. The root `App.tsx` component is wrapped in the `withAuthenticator` higher-order component (HOC), which enforces user login.
- **API Communication**: All interactions with the backend API are centralized in the `src/api/` directory. Each file in this directory corresponds to a different API resource (e.g., `photograph.ts`, `layout.ts`). These modules use `aws-amplify/api` to make `get`, `post`, and `put` requests.
- **Configuration**: All AWS service configurations are located in `src/config.ts`. This file reads its values from Vite environment variables (e.g., `import.meta.env.VITE_API_ENDPOINT`).
- **Component Structure**:
  - `src/containers`: Page-level components that often correspond to a route.
  - `src/components`: Reusable, smaller components used across the application.

## Key Patterns & Conventions

### Data Fetching with `useLoader`

The primary pattern for fetching data from the API is the `useLoader` custom hook (`src/utils/useLoader.ts`). This hook simplifies handling loading, data, and error states.

**Example from `PhotographsList.tsx`:**
```typescript
// Fetches photographs when the component mounts.
const { data: photographs, loading, error } = useLoader([], loadPhotographs, []);
```
When fetching data in a component, always prefer using the `useLoader` hook.

### API Abstraction

Do not make direct API calls from components. Instead, add a function to the appropriate module in `src/api/` and call that function from your component (often within `useLoader`). This keeps the API logic separate from the UI.

**Example from `src/api/photograph.ts`:**
```typescript
// This function is called from the UI to get all photographs.
export async function loadPhotographs(): Promise<Photograph[]> {
  const operation = get({ apiName: "api", path: "/photograph" });
  const response = await operation.response;
  const apiModels = (await response.body.json()) as any[];

  return apiModels.map(toAppModel);
}
```

### Routing

The application uses `react-router-dom` for navigation. Routes are defined in `src/routes.tsx`. Use the `<Link>` component for internal navigation.

## Developer Workflow

- **To run the app locally**: `npm run dev`
- **To build the app for production**: `npm run build`
- **To run linter**: `npm run lint`

Dependencies are managed with `npm`. If you add a new dependency, run `npm install`.
