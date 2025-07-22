import { createContext, useCallback, useState, type ReactNode } from "react";
import type { ViewState } from "react-map-gl";
import { GeoJsonLayer, PolygonLayer } from "deck.gl";

export type TDeckLayer = PolygonLayer | GeoJsonLayer;

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

const MapViewContext = createContext<IMapViewContext | undefined>(undefined);

interface IMapViewContext {
  layers: TDeckLayer[];
  mapViewState: ViewState;
  updateLayers: (layers: TDeckLayer[]) => void;
  addLayer: (layer: TDeckLayer) => void;
  clearLayers: () => void;
  updateMapViewCoords: (data: { longitude: number; latitude: number }) => void;
  updateFullMapView: (newMapViewState: ViewState) => void;
}

const MapViewProvider = ({ children }: { children: ReactNode }) => {
  const [deckLayers, setDeckLayers] = useState<TDeckLayer[]>([]);
  const [mapViewState, setMapViewState] =
    useState<ViewState>(INITIAL_VIEW_STATE);

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
      setMapViewState({
        ...BASE_VIEW_STATE,
        longitude,
        latitude,
        zoom: 12,
      } as ViewState);
    },
    []
  );

  const updateFullMapView = useCallback((newMapViewState: ViewState) => {
    setMapViewState(newMapViewState);
  }, []);

  return (
    <MapViewContext.Provider
      value={{
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
    </MapViewContext.Provider>
  );
};

export { MapViewProvider, MapViewContext };
