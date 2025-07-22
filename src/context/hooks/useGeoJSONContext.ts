import { useContext } from "react";
import { GeoJSONContext } from "../GeoJSONProvider";

export const useGeoJSONContext = () => {
  const context = useContext(GeoJSONContext);
  if (!context) {
    throw new Error("useGeoJsonContext must be used within a GeoJsonProvider");
  }
  return context;
};
