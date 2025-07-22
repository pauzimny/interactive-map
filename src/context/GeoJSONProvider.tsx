import { createContext, useCallback, useState, type ReactNode } from "react";
import type { Feature, Polygon } from "geojson";
import { Layer } from "deck.gl";

export type TDeckLayer = Layer<any>;
export type TGeoJSON = Feature<Polygon>;
export type TLngLat = [number, number];

interface IGeoJSONContext {
  geoJSON: TGeoJSON | null;
  layers: TDeckLayer[];
  updateGeoJSON: (data: TGeoJSON | null) => void;
  updateLayers: (layers: TDeckLayer[]) => void;
  addLayer: (layer: TDeckLayer) => void;
  clearLayers: () => void;
}

const GeoJSONContext = createContext<IGeoJSONContext | undefined>(undefined);

const GeoJSONProvider = ({ children }: { children: ReactNode }) => {
  const [geoJSON, setGeoJSON] = useState<TGeoJSON | null>(null);
  const [deckLayers, setDeckLayers] = useState<TDeckLayer[]>([]);

  const updateGeoJSON = useCallback((newGeoJSON: TGeoJSON | null) => {
    setGeoJSON(newGeoJSON);
  }, []);

  const addLayer = useCallback((layer: TDeckLayer) => {
    setDeckLayers((prev) => [...prev, layer]);
  }, []);

  const clearLayers = useCallback(() => {
    setDeckLayers([]);
  }, []);

  const updateLayers = useCallback((layers: TDeckLayer[]) => {
    setDeckLayers(layers);
  }, []);

  return (
    <GeoJSONContext.Provider
      value={{
        geoJSON,
        updateGeoJSON,
        updateLayers,
        addLayer,
        layers: deckLayers,
        clearLayers,
      }}
    >
      {children}
    </GeoJSONContext.Provider>
  );
};

export { GeoJSONContext, GeoJSONProvider };
