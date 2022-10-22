import React from "react";
import {
  RouteObject,
} from "react-router-dom";

import App from './App';
import NotFound from "./containers/NotFound";
import Home from "./containers/Home";
import PhotographsList from "./containers/PhotographsList";
import PhotographNew from "./containers/PhotographNew";
import PhotographDetails from "./containers/PhotographDetails";
import Layout from "./containers/Layout";


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