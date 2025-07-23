import { useCallback, useEffect, useMemo, useState } from "react";
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
import type {
  FeatureData,
  IGeoJSONContext,
  TLngLat,
} from "../context/GeoJSONProvider";
import type { TDrawingMode, TMapFeature } from "../App";
import type { TDeckLayer } from "../context/MapViewProvider";
import DrawToolbar from "./DrawToolbar";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface InteractiveMapsProps {
  geoJSONFeatures: FeatureData[];
  // geoJSONFeatures: IGeoJSONContext["geoJSONFeatures"];
  activeFeature?: TMapFeature;
  // updateGeoJSON: IGeoJSONContext["updateGeoJSON"];
  dispatch: IGeoJSONContext["dispatch"];
  // updateLayers: (layers: TDeckLayer[]) => void;
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
  // updateGeoJSON,
  // updateLayers,
  mapViewState,
  updateFullMapView,
  drawingMode,
  setDrawingMode,
  layers,
  dispatch,
}: InteractiveMapsProps) {
  const [clickPoints, setClickPoints] = useState<TLngLat[]>([]);
  // const [drawnFeatures, setDrawnFeatures] = useState<typeof geoJSONFeatures>(
  //   []
  // );

  console.log("layers,", layers);

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

    dispatch({ type: "ADD_DRAWN_FEATURE", payload: newFeature });
    // setDrawnFeatures((prev) => [...prev, newFeature]);
    setClickPoints([]);
  }, [clickPoints, drawingMode, dispatch]);

  const handleClearDrawing = useCallback(() => {
    setClickPoints([]);
    dispatch({ type: "CLEAR_DRAWN" });
    // setDrawnFeatures([]);
  }, [dispatch]);

  const handleExportGeoJSON = useCallback(() => {
    const combined = geoJSONFeatures.map((f) => f.feature);
    if (!combined.length) return alert("No geoJSON data found!");
    const fileName = `interactive-map-${new Date().toISOString()}.geojson`;
    downloadGeoJSON(combined, fileName);
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

  // const runDrawing = useCallback(() => {
  //   const featureLayers = geoJSONFeatures
  //     .map((geoItem, i) => generateFeatureLayer(geoItem.feature, i))
  //     .filter(Boolean);

  //   const tempLine = generateTempDrawLines(clickPoints);
  //   const tempPoints = generateTempDrawPoints(clickPoints);
  //   const tempLayers = [tempLine, tempPoints].filter(Boolean);

  //   updateLayers([...featureLayers, ...tempLayers] as TDeckLayer[]);
  // }, [clickPoints, geoJSONFeatures, updateLayers]);

  // useEffect(() => {
  //   runDrawing();
  // }, [runDrawing]);

  const renderedLayers = useMemo(() => {
    const featureLayers = geoJSONFeatures
      .map((feature) => generateFeatureLayer(feature.feature))
      .filter(Boolean);

    const tempLine = generateTempDrawLines(clickPoints);
    const tempPoints = generateTempDrawPoints(clickPoints);
    const tempLayers = [tempLine, tempPoints].filter(Boolean);

    return [...featureLayers, ...tempLayers] as TDeckLayer[];
  }, [clickPoints, geoJSONFeatures]);

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
        layers={renderedLayers}
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
