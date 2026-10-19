import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../../layouts/dashboard/dashboard";
import Auth from "../../layouts/auth/auth";

import NotFound from "../../page/notFound/notFound";
import Login from "../../page/login/login";

const router = createBrowserRouter([
  {
    element: <Auth />,
    children: [
      {
        path: "/login",
        element: <Login/>
      },
    ],
  },

  {
    element: <Dashboard />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("../../page/home/home");
          return { Component };
        },
      },
      {
        path: "profile",
        lazy: async () => {
          const { default: Component } = await import("../../page/profile/profile");
          return { Component };
        },
      },
      {
        path: "users",
        lazy: async () => {
          const { default: Component } = await import("../../page/users/users");
          return { Component };
        },
      },
      {
        path: "users/:userid",
        lazy: async () => {
          const { default: Component } = await import("../../page/users/userProfile");
          return { Component };
        },
      },
      {
        path: "products",
        lazy: async () => {
          const { default: Component } = await import("../../page/products/products");
          return { Component };
        },
      },
      {
        path: "products/new",
        lazy: async () => {
          const { default: Component } = await import("../../page/products/newProduct");
          return { Component };
        },
      },
      {
        path: "products/:id/edit",
        lazy: async () => {
          const { default: Component } = await import("../../page/products/editProduct");
          return { Component };
        },
      },
      {
        path: "products/:id",
        lazy: async () => {
          const { default: Component } = await import("../../page/products/productDetails");
          return { Component };
        },
      },
      {
        path: "new-user",
        lazy: async () => {
          const { default: Component } = await import("../../page/users/newUser");
          return { Component };
        },
      },
      {
        path: "notifications",
        lazy: async () => {
          const { default: Component } = await import("../../page/notifications/notifications");
          return { Component };
        },
      },
      {
        path: "orders",
        lazy: async () => {
          const { default: Component } = await import("../../page/orders/orders");
          return { Component };
        },
      },
      {
        path: "transactions",
        lazy: async () => {
          const { default: Component } = await import("../../page/transactions/transactions");
          return { Component };
        },
      },
      {
        path: "*",
        element: <NotFound/>
      },
    ],
  },
]);

export default router;