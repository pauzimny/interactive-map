import { createContext, useCallback, useState, type ReactNode } from "react";
import type { FeatureCollection } from "geojson";

export type TGeoJSON = FeatureCollection;
export type TLngLat = [number, number];

export interface IGeoJSONContext {
  geoJSON: TGeoJSON | null;
  updateGeoJSON: (data: TGeoJSON | null) => void;
}

const GeoJSONContext = createContext<IGeoJSONContext | undefined>(undefined);

const GeoJSONProvider = ({ children }: { children: ReactNode }) => {
  const [geoJSON, setGeoJSON] = useState<TGeoJSON | null>(null);

  const updateGeoJSON = useCallback((newGeoJSON: TGeoJSON | null) => {
    setGeoJSON(newGeoJSON);
  }, []);

  return (
    <GeoJSONContext.Provider
      value={{
        geoJSON,
        updateGeoJSON,
      }}
    >
      {children}
    </GeoJSONContext.Provider>
  );
};

export { GeoJSONContext, GeoJSONProvider };
