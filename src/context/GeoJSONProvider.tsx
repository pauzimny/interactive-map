import { createContext, useCallback, useState, type ReactNode } from "react";
import type { Feature } from "geojson";

export type TLngLat = [number, number];

export interface IGeoJSONContext {
  geoJSONFeatures: Feature[];
  updateGeoJSON: (feature?: Feature[]) => void;
}

const GeoJSONContext = createContext<IGeoJSONContext | undefined>(undefined);

const GeoJSONProvider = ({ children }: { children: ReactNode }) => {
  const [geoJSONFeatures, setGeoJSONFeatures] = useState<Feature[]>([]);

  const updateGeoJSON = useCallback((newFeature: Feature[] | undefined) => {
    if (!newFeature?.length) {
      setGeoJSONFeatures([]);
    } else {
      setGeoJSONFeatures((prev) => [...prev, ...newFeature]);
    }
  }, []);

  return (
    <GeoJSONContext.Provider
      value={{
        geoJSONFeatures,
        updateGeoJSON,
      }}
    >
      {children}
    </GeoJSONContext.Provider>
  );
};

export { GeoJSONContext, GeoJSONProvider };
