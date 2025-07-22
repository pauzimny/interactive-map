import { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react";
import StaticMap from "react-map-gl";
import type { TMapFeature } from "../App";
import { PolygonLayer, type PickingInfo } from "deck.gl";
import { convertPointsToPolygonFeature, downloadGeoJSON } from "../helpers";
import DrawToolbar from "./DrawToolbar";
import type { TDeckLayer, TGeoJSON, TLngLat } from "../context/GeoJSONProvider";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const INITIAL_VIEW_STATE = {
  longitude: 21.999121,
  latitude: 50.041187,
  zoom: 4,
};

interface InteractiveMapsProps {
  geoJSON: TGeoJSON | null;
  activeFeature?: TMapFeature;
  updateGeoJSON: (data: TGeoJSON | null) => void;
  addLayer: (layer: TDeckLayer) => void;
  layers: TDeckLayer[];
  clearLayers: () => void;
}

function InteractiveMap({
  activeFeature,
  geoJSON,
  updateGeoJSON,
  addLayer,
  layers,
  clearLayers,
}: InteractiveMapsProps) {
  const [points, setPoints] = useState<TLngLat[]>([]);

  const isDrawingActive = activeFeature === "DRAW_POLYGON";

  const handleAddPolygonPoint = (info: PickingInfo) => {
    if (!isDrawingActive) return;

    if (!info.coordinate)
      return alert("Cannot read coordinates! Please try again.");
    const long = info.coordinate[0];
    const lat = info.coordinate[1];

    setPoints((prev) => [...prev, [long, lat]]);
  };

  const finishDrawing = () => {
    if (points.length < 3) {
      alert("Polygon must have at least 3 points!");
      return;
    }

    updateGeoJSON(convertPointsToPolygonFeature(points));
  };

  const handleExportGeoJSON = () => {
    if (!geoJSON) return alert("No geoJSON data found! Please try again.");

    const fileName = `interactive-map-geojson-${new Date(
      Date.now()
    ).toISOString()}`;

    downloadGeoJSON(geoJSON, fileName);
  };

  const handleClearDrawing = () => {
    clearLayers();
    setPoints([]);
  };

  useEffect(() => {
    if (isDrawingActive && points.length > 0) {
      const polygonCoords = [...points, points[0]];

      const newLayer = new PolygonLayer({
        id: `polygon-layer-${Date.now()}`, // Unikalny ID
        data: [
          {
            geometry: {
              type: "Polygon",
              coordinates: [polygonCoords],
            },
          },
        ],
        getPolygon: (d) => d.geometry.coordinates,
        getFillColor: [255, 0, 0, 100],
        getLineColor: [0, 0, 0, 255],
        lineWidthMinPixels: 2,
      });

      addLayer(newLayer);
    }
  }, [isDrawingActive, addLayer, points]);

  return (
    <>
      {isDrawingActive && (
        <DrawToolbar
          isFinishDrawingButtonDisabled={points.length < 3}
          exportGeoJSONClick={handleExportGeoJSON}
          finishDrawingClick={finishDrawing}
          clearDrawing={handleClearDrawing}
        />
      )}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
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
