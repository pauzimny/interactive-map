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
  addLayer: (layer: TDeckLayer) => void;
  layers: TDeckLayer[];
  clearLayers: () => void;
  mapViewState: ViewState;
  updateFullMapView: (newMapViewState: ViewState) => void;
  setDrawingMode: (mode: TDrawingMode) => void;
  drawingMode?: TDrawingMode;
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
  drawingMode,
  setDrawingMode,
}: InteractiveMapsProps) {
  const [clickPoints, setClickPoints] = useState<TLngLat[]>([]);
  const [figures, setFigures] = useState<TLngLat[][]>([]);

  const isDrawingActive = activeFeature === "DRAW";

  const handleAddPolygonPoint = (info: PickingInfo) => {
    if (!isDrawingActive || !info.coordinate) return;
    const [lng, lat] = info.coordinate;
    setClickPoints((prev) => [...prev, [lng, lat]]);
  };

  const handleFinishDrawing = useCallback(() => {
    if (clickPoints.length < 2) {
      alert("You need at least two points to finish a shape.");
      return;
    }

    if (drawingMode === "POLYGON") {
      if (clickPoints.length < 3) {
        alert("Polygon needs at least 3 points.");
        return;
      }

      const polygon = convertPointsToPolygonFeature(clickPoints);
      updateGeoJSON(polygon);
      setFigures((prev) => [
        ...prev,
        polygon.geometry.coordinates[0].map(
          (coord): TLngLat => [coord[0], coord[1]]
        ),
      ]);
    } else if (drawingMode === "LINE") {
      const line = convertPointsToLineFeature(clickPoints);
      updateGeoJSON(line);
      setFigures((prev) => [...prev, clickPoints]); // linia nie zamykana
    }

    setClickPoints([]);
  }, [clickPoints, updateGeoJSON, drawingMode]);

  const handleClearDrawing = useCallback(() => {
    clearLayers();
    setClickPoints([]);
    setFigures([]);
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
    const clickPointLayer = generateTempDrawPoints(clickPoints);
    const lineLayer = generateTempDrawLines(clickPoints);

    const featureLayers = figures.map((coords, i) => {
      const feature =
        coords.length >= 3
          ? convertPointsToPolygonFeature(coords)
          : convertPointsToLineFeature(coords);

      return generateFeatureLayer(feature, i);
    });

    clearLayers();

    featureLayers.forEach((layer) => {
      if (!layer) return;
      addLayer(layer);
    });

    if (lineLayer) addLayer(lineLayer);
    addLayer(clickPointLayer);
  }, [clickPoints, figures, addLayer, clearLayers]);

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
