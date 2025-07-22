import { useCallback, useEffect, useState } from "react";
import {
  convertPointsToPolygonFeature,
  definePolygonData,
  downloadGeoJSON,
  generatePolygonLayer,
  generateTempDrawLines,
  generateTempDrawPoints,
} from "../helpers";
import type { IGeoJSONContext, TLngLat } from "../context/GeoJSONProvider";
import type { TMapFeature } from "../App";
import type { TDeckLayer } from "../context/MapViewProvider";
import StaticMap, {
  type ViewState,
  type ViewStateChangeEvent,
} from "react-map-gl";
import DeckGL, { type PickingInfo } from "deck.gl";
import DrawToolbar from "./DrawToolbar";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
interface InteractiveMapsProps {
  geoJSONFeatures: IGeoJSONContext["geoJSONFeatures"];
  activeFeature?: TMapFeature;
  updateGeoJSON: IGeoJSONContext["updateGeoJSON"];
  addLayer: (layer: TDeckLayer) => void;
  layers: TDeckLayer[];
  clearLayers: () => void;
  mapViewState: ViewState;
  updateFullMapView: (newMapViewState: ViewState) => void;
}

function InteractiveMap({
  activeFeature,
  geoJSONFeatures,
  updateGeoJSON,
  addLayer,
  layers,
  clearLayers,
  mapViewState,
  updateFullMapView,
}: InteractiveMapsProps) {
  const [clickPoints, setClickPoints] = useState<TLngLat[]>([]);
  const [polygons, setPolygons] = useState<TLngLat[][]>([]);

  const isDrawingActive = activeFeature === "DRAW_POLYGON";

  const handleAddPolygonPoint = (info: PickingInfo) => {
    if (!isDrawingActive || !info.coordinate) return;
    const [lng, lat] = info.coordinate;
    setClickPoints((prev) => [...prev, [lng, lat]]);
  };

  const handleFinishDrawing = useCallback(() => {
    const drawnPolygon = definePolygonData(clickPoints);

    if (!drawnPolygon) return;

    setPolygons((prev) => [...prev, drawnPolygon]);

    const geoJSONFeature = convertPointsToPolygonFeature(drawnPolygon);
    updateGeoJSON(geoJSONFeature);

    setClickPoints([]);
  }, [clickPoints, updateGeoJSON]);

  const handleClearDrawing = useCallback(() => {
    clearLayers();
    setClickPoints([]);
    setPolygons([]);
    updateGeoJSON(undefined);
  }, [clearLayers, updateGeoJSON]);

  const handleExportGeoJSON = useCallback(() => {
    if (!geoJSONFeatures.length) return alert("No geoJSON data found!");

    const fileName = `interactive-map-${new Date().toISOString()}.geojson`;

    downloadGeoJSON(geoJSONFeatures, fileName);
  }, [geoJSONFeatures]);

  const handleUndoLastPoint = useCallback(() => {
    setClickPoints((prev) => prev.slice(0, -1));
  }, []);

  const runDrawing = useCallback(() => {
    const clickPointLayer = generateTempDrawPoints(clickPoints);

    const lineLayer = generateTempDrawLines(clickPoints);

    const polygonLayers = generatePolygonLayer(polygons);

    clearLayers();
    polygonLayers.forEach(addLayer);

    if (lineLayer) addLayer(lineLayer);

    addLayer(clickPointLayer);
  }, [clickPoints, polygons, addLayer, clearLayers]);

  useEffect(() => {
    runDrawing();
  }, [runDrawing]);

  return (
    <>
      {isDrawingActive && (
        <DrawToolbar
          isFinishDrawingButtonDisabled={clickPoints.length < 3}
          exportGeoJSONClick={handleExportGeoJSON}
          finishDrawingClick={handleFinishDrawing}
          clearDrawing={handleClearDrawing}
          undoLastPoint={handleUndoLastPoint}
        />
      )}
      <DeckGL
        viewState={mapViewState}
        onViewStateChange={(e: ViewStateChangeEvent) =>
          updateFullMapView(e.viewState)
        }
        controller
        layers={layers}
        onClick={handleAddPolygonPoint}
      >
        <StaticMap
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        />
      </DeckGL>
    </>
  );
}

export default InteractiveMap;
