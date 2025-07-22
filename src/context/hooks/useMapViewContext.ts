import { useContext } from "react";
import { MapViewContext } from "../MapViewProvider";

export const useMapViewContext = () => {
  const context = useContext(MapViewContext);
  if (!context) {
    throw new Error("useMapViewContext must be used within a MapViewProvider");
  }
  return context;
};
