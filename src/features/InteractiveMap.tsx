import { useState } from "react";
import DeckGL from "@deck.gl/react";
import StaticMap from "react-map-gl";
import { PolygonLayer } from "@deck.gl/layers";
import type { Feature, Polygon } from "geojson";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import type { TMapFeature } from "../App";
import type { PickingInfo } from "deck.gl";
import { convertPointsToPolygonFeature } from "../helpers";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export type TGeoJSON = Feature<Polygon>;
export type TLngLat = [number, number];

const INITIAL_VIEW_STATE = {
  longitude: 21.999121,
  latitude: 50.041187,
  zoom: 4,
};

interface InteractiveMapsProps {
  activeFeature?: TMapFeature;
}

function InteractiveMap({ activeFeature }: InteractiveMapsProps) {
  const [points, setPoints] = useState<TLngLat[]>([]);
  const [geoJSON, setGeoJSON] = useState<TGeoJSON>();

  const isDrawingActive = activeFeature === "DRAW_POLYGON";

  const handleAddPolygonPoint = (info: PickingInfo) => {
    if (!isDrawingActive) return;

    if (!info.coordinate)
      return alert("Cannot read coordinates! Please try again");
    const long = info.coordinate[0];
    const lat = info.coordinate[1];

    setPoints((prev) => [...prev, [long, lat]]);
  };

  const finishDrawing = () => {
    if (points.length < 3) {
      alert("Polygon must have at least 3 points!");
      return;
    }

    setGeoJSON(convertPointsToPolygonFeature(points));
  };

  const layers = [];

  if (points.length > 0) {
    layers.push(
      new PolygonLayer({
        id: "polygon-layer",
        data: [
          {
            geometry: {
              type: "Polygon",
              coordinates: [
                [...points, isDrawingActive ? [] : points[0]].filter(Boolean),
              ],
            },
          },
        ],
        getPolygon: (d) => d.geometry.coordinates,
        getFillColor: [255, 0, 0, 100],
        getLineColor: [0, 0, 0, 255],
        lineWidthMinPixels: 2,
      })
    );
  }

  return (
    <>
      {isDrawingActive && (
        <Paper sx={{ position: "absolute", right: 32, zIndex: 1, margin: 2 }}>
          <Button onClick={finishDrawing} disabled={points.length < 3}>
            Finish Drawing
          </Button>

          <Button onClick={() => console.log(JSON.stringify(geoJSON, null, 2))}>
            Show GeoJSON in Console
          </Button>
        </Paper>
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
