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
        element: <Layout />
      },
    ],
  },
];

export default routes;