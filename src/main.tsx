import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppContainer from "./containers/AppContainer.tsx";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContainer />
  </StrictMode>
);
