import { useCallback, useEffect, useState } from "react";
import StaticMap, {
  type ViewState,
  type ViewStateChangeEvent,
} from "react-map-gl";
import DeckGL, { type PickingInfo } from "deck.gl";
import {
  convertPointsToLineFeature,
  convertPointsToPolygonFeature,
  downloadGeoJSON,
  generateFeatureLayer,
  generateTempDrawLines,
  generateTempDrawPoints,
} from "../helpers";
import type { IGeoJSONContext, TLngLat } from "../context/GeoJSONProvider";
import type { TDrawingMode, TMapFeature } from "../App";
import type { TDeckLayer } from "../context/MapViewProvider";
import DrawToolbar from "./DrawToolbar";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface InteractiveMapsProps {
  geoJSONFeatures: IGeoJSONContext["geoJSONFeatures"];
  activeFeature?: TMapFeature;
  updateGeoJSON: IGeoJSONContext["updateGeoJSON"];
  updateLayers: (layers: TDeckLayer[]) => void;
  addLayer: (layer: TDeckLayer) => void;
  layers: TDeckLayer[];
  clearLayers: () => void;
  mapViewState: ViewState;
  updateFullMapView: (newMapViewState: ViewState) => void;
  setDrawingMode: (mode: TDrawingMode) => void;
  drawingMode?: TDrawingMode;
}

function InteractiveMap({
  geoJSONFeatures,
  activeFeature,
  updateGeoJSON,
  updateLayers,
  mapViewState,
  updateFullMapView,
  drawingMode,
  setDrawingMode,
  layers,
}: InteractiveMapsProps) {
  const [clickPoints, setClickPoints] = useState<TLngLat[]>([]);
  const [drawnFeatures, setDrawnFeatures] = useState<typeof geoJSONFeatures>(
    []
  );

  const isDrawingActive = activeFeature === "DRAW";

  const handleAddPolygonPoint = (info: PickingInfo) => {
    if (!isDrawingActive || !info.coordinate) return;
    const [lng, lat] = info.coordinate;
    setClickPoints((prev) => [...prev, [lng, lat]]);
  };

  const handleFinishDrawing = useCallback(() => {
    if (clickPoints.length < 2) return;

    const newFeature =
      drawingMode === "POLYGON"
        ? convertPointsToPolygonFeature(clickPoints)
        : convertPointsToLineFeature(clickPoints);

    setDrawnFeatures((prev) => [...prev, newFeature]);
    setClickPoints([]);
  }, [clickPoints, drawingMode]);

  const handleClearDrawing = useCallback(() => {
    setClickPoints([]);
    setDrawnFeatures([]);
  }, []);

  const handleExportGeoJSON = useCallback(() => {
    const combined = [...geoJSONFeatures, ...drawnFeatures];
    if (!combined.length) return alert("No geoJSON data found!");
    const fileName = `interactive-map-${new Date().toISOString()}.geojson`;
    downloadGeoJSON(combined, fileName);
  }, [geoJSONFeatures, drawnFeatures]);

  const handleUndoLastPoint = useCallback(() => {
    setClickPoints((prev) => prev.slice(0, -1));
  }, []);

  const defineIsFinishButtonDisabled = () => {
    switch (drawingMode) {
      case "POLYGON":
        return clickPoints.length < 3;
      case "LINE":
        return clickPoints.length < 2;
      default:
        return true;
    }
  };

  const runDrawing = useCallback(() => {
    const allFeatures = [...geoJSONFeatures, ...drawnFeatures];

    const featureLayers = allFeatures
      .map((feature, i) => generateFeatureLayer(feature, i))
      .filter(Boolean);

    const tempLine = generateTempDrawLines(clickPoints);
    const tempPoints = generateTempDrawPoints(clickPoints);
    const tempLayers = [tempLine, tempPoints].filter(Boolean);

    updateLayers([...featureLayers, ...tempLayers] as TDeckLayer[]);
  }, [geoJSONFeatures, drawnFeatures, clickPoints, updateLayers]);

  useEffect(() => {
    runDrawing();
  }, [runDrawing]);

  return (
    <>
      {isDrawingActive && (
        <DrawToolbar
          isFinishDrawingButtonDisabled={defineIsFinishButtonDisabled()}
          exportGeoJSONClick={handleExportGeoJSON}
          finishDrawingClick={handleFinishDrawing}
          clearDrawing={handleClearDrawing}
          undoLastPoint={handleUndoLastPoint}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
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
