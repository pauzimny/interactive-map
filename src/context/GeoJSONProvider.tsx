import { createContext, useCallback, useState, type ReactNode } from "react";
import type { FeatureCollection } from "geojson";
import { GeoJsonLayer, PolygonLayer } from "deck.gl";
import type { ViewState } from "react-map-gl";

export type TDeckLayer = PolygonLayer | GeoJsonLayer;
export type TGeoJSON = FeatureCollection;
export type TLngLat = [number, number];

const INITIAL_VIEW_STATE: ViewState = {
  longitude: 21.999121,
  latitude: 50.041187,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  padding: { top: 40, bottom: 40, left: 40, right: 40 },
};

const BASE_VIEW_STATE: Partial<ViewState> = {
  zoom: 4,
  pitch: 0,
  bearing: 0,
  padding: { top: 40, bottom: 40, left: 40, right: 40 },
};

interface IGeoJSONContext {
  geoJSON: TGeoJSON | null;
  layers: TDeckLayer[];
  updateGeoJSON: (data: TGeoJSON | null) => void;
  updateLayers: (layers: TDeckLayer[]) => void;
  addLayer: (layer: TDeckLayer) => void;
  clearLayers: () => void;
  mapViewState: ViewState;
  updateMapViewCoords: (data: { longitude: number; latitude: number }) => void;
  updateFullMapView: (newMapViewState: ViewState) => void;
}

const GeoJSONContext = createContext<IGeoJSONContext | undefined>(undefined);

const GeoJSONProvider = ({ children }: { children: ReactNode }) => {
  const [geoJSON, setGeoJSON] = useState<TGeoJSON | null>(null);
  const [deckLayers, setDeckLayers] = useState<TDeckLayer[]>([]);
  const [mapViewState, setMapViewState] =
    useState<ViewState>(INITIAL_VIEW_STATE);

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

  const updateMapViewCoords = useCallback(
    ({ longitude, latitude }: { longitude: number; latitude: number }) => {
      setMapViewState({ ...BASE_VIEW_STATE, longitude, latitude } as ViewState);
    },
    []
  );

  const updateFullMapView = useCallback((newMapViewState: ViewState) => {
    setMapViewState(newMapViewState);
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
        updateMapViewCoords,
        mapViewState,
        updateFullMapView,
      }}
    >
      {children}
    </GeoJSONContext.Provider>
  );
};

export { GeoJSONContext, GeoJSONProvider };
