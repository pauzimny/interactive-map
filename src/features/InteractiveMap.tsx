import { useEffect, useState } from "react";
import { PathLayer } from "@deck.gl/layers";
import { convertPointsToPolygonFeature, downloadGeoJSON } from "../helpers";
import type { IGeoJSONContext, TLngLat } from "../context/GeoJSONProvider";
import type { TMapFeature } from "../App";
import type { TDeckLayer } from "../context/MapViewProvider";
import StaticMap, {
  type ViewState,
  type ViewStateChangeEvent,
} from "react-map-gl";
import DeckGL, {
  PolygonLayer,
  ScatterplotLayer,
  type PickingInfo,
} from "deck.gl";
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

  const finishDrawing = () => {
    if (clickPoints.length < 3) {
      alert("Polygon must have at least 3 points!");
      return;
    }

    const closedPolygon = [...clickPoints];
    const [firstLng, firstLat] = clickPoints[0];
    const [lastLng, lastLat] = clickPoints[clickPoints.length - 1];

    const isPolygonNotClosed = firstLng !== lastLng || firstLat !== lastLat;
    if (isPolygonNotClosed) {
      closedPolygon.push(clickPoints[0]);
    }

    if (closedPolygon.length < 4) {
      alert("Polygon must be closed and have at least 3 sides.");
      return;
    }

    setPolygons((prev) => [...prev, closedPolygon]);

    const geoJSONFeature = convertPointsToPolygonFeature(closedPolygon);
    updateGeoJSON(geoJSONFeature);

    setClickPoints([]);
  };

  const handleClearDrawing = () => {
    clearLayers();
    setClickPoints([]);
    setPolygons([]);
    updateGeoJSON(undefined);
  };

  const handleExportGeoJSON = () => {
    if (!geoJSONFeatures.length) return alert("No geoJSON data found!");
    const fileName = `interactive-map-${new Date().toISOString()}.geojson`;
    downloadGeoJSON(geoJSONFeatures, fileName);
  };

  useEffect(() => {
    // blue dots
    const clickPointLayer = new ScatterplotLayer({
      id: "click-points",
      data: clickPoints,
      getPosition: (d) => d,
      getRadius: 10,
      pickable: false,
      getFillColor: [0, 0, 255, 255],
      radiusMinPixels: 5,
      radiusMaxPixels: 8,
      radiusUnits: "pixels",
    });

    // yellow line
    const lineLayer =
      clickPoints.length > 1
        ? new PathLayer({
            id: "line-layer",
            data: [
              {
                path: clickPoints,
              },
            ],
            getPath: (d) => d.path,
            getColor: [255, 255, 0, 255],
            widthMinPixels: 2,
            pickable: false,
          })
        : null;

    const polygonLayers = polygons.map((coords, i) => {
      return new PolygonLayer({
        id: `polygon-${i}`,
        data: [
          {
            geometry: {
              type: "Polygon",
              coordinates: [[...coords, coords[0]]],
            },
          },
        ],
        getFillColor: [255, 0, 0, 100],
        getLineColor: [0, 0, 0, 255],
        lineWidthMinPixels: 2,
        pickable: false,
        getPolygon: (d) => d.geometry.coordinates,
      });
    });

    clearLayers();
    polygonLayers.forEach(addLayer);
    if (lineLayer) addLayer(lineLayer);
    addLayer(clickPointLayer);
  }, [clickPoints, polygons, addLayer, clearLayers]);

  return (
    <>
      {isDrawingActive && (
        <DrawToolbar
          isFinishDrawingButtonDisabled={clickPoints.length < 3}
          exportGeoJSONClick={handleExportGeoJSON}
          finishDrawingClick={finishDrawing}
          clearDrawing={handleClearDrawing}
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
