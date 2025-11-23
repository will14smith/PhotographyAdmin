import { lazy } from "react";
import {
  type RouteObject,
} from "react-router-dom";

const App = lazy(() => import('./App'));
const NotFound = lazy(() => import("./containers/NotFound"));
const Home = lazy(() => import("./containers/Home"));
const PhotographsList = lazy(() => import("./containers/PhotographsList"));
const PhotographNew = lazy(() => import("./containers/PhotographNew"));
const PhotographDetails = lazy(() => import("./containers/PhotographDetails"));
const Layout = lazy(() => import("./containers/Layout"));
const StoriesList = lazy(() => import("./containers/StoriesList"));
const StoryNew = lazy(() => import("./containers/StoryNew"));
const StoryDetails = lazy(() => import("./containers/StoryDetails"));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'photographs',
        children: [
          {
            index: true,
            element: <PhotographsList />,
          },
          {
            path: 'new',
            element: <PhotographNew />,
          },
          {
            path: ':id',
            element: <PhotographDetails />,
          },
        ],
      },
      {
        path: 'layout',
        element: <Layout />,
      },
      {
        path: 'stories',
        children: [
          {
            index: true,
            element: <StoriesList />,
          },
          {
            path: 'new',
            element: <StoryNew />,
          },
          {
            path: ':id',
            element: <StoryDetails />,
          },
        ],
      },
    ],
  },
];

export default routes;