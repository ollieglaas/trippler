import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTrip from "./create-trip/index.tsx";
import Header from "./components/Header.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from "./view-trip/[tripId]/index.tsx";
import MyTrips from "./my-trips/index.tsx";
import { Toaster } from "sonner";
import { UserProvider } from "./context/UserContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-trip",
    element: <CreateTrip />,
  },
  {
    path: "/view-trip/:tripId",
    element: <ViewTrip />,
  },
  {
    path: "/my-trips",
    element: <MyTrips />,
  },
  // {
  //   path: "/skeleton",
  //   element: <Skeleton />,
  // },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <UserProvider>
        <Toaster />
        <Header />
        <RouterProvider router={router} />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
