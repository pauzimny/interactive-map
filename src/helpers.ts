import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  Point,
  Polygon,
} from "geojson";
import { v4 as uuidv4 } from "uuid";
import type { TLngLat } from "./context/GeoJSONProvider";
import {
  GeoJsonLayer,
  PathLayer,
  PolygonLayer,
  ScatterplotLayer,
} from "deck.gl";

export const defineFeatureId = () => {
  return uuidv4();
};

export const convertPointsToPolygonFeature = (
  points: TLngLat[]
): Feature<Polygon> => {
  if (points.length < 3) {
    throw new Error("Polygon needs at least 3 points");
  }

  const ring = [...points];
  if (
    ring[0][0] !== ring[ring.length - 1][0] ||
    ring[0][1] !== ring[ring.length - 1][1]
  ) {
    ring.push(ring[0]);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
    properties: {
      id: defineFeatureId(),
      name: "User drawn",
      createdAt: new Date().toISOString(),
      pointsCount: ring.length,
      type: "POLYGON",
    },
  };
};

export const convertPointsToLineFeature = (
  points: TLngLat[]
): Feature<LineString> => {
  if (points.length < 2) {
    throw new Error("LineString needs at least 2 points");
  }

  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points,
    },
    properties: {
      id: defineFeatureId(),
      name: "User drawn line",
      createdAt: new Date().toISOString(),
      pointsCount: points.length,
      type: "LINE",
    },
  };
};

export const downloadGeoJSON = (
  features: Feature[],
  filename = "interactive-map.geojson"
) => {
  const data = {
    type: "FeatureCollection",
    features,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/geo+json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

const definePointGeoJSON = ({
  lng,
  lat,
}: {
  lng: number;
  lat: number;
}): FeatureCollection<Point> => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {},
      },
    ],
  };
};

export const generatePinLayer = ({
  lng,
  lat,
}: {
  lng: number;
  lat: number;
}) => {
  const pointGeoJSON = definePointGeoJSON({ lng, lat });
  return new GeoJsonLayer({
    id: `search-result-pin-${Date.now()}`,
    data: pointGeoJSON,
    getPointRadius: 10,
    getFillColor: [0, 0, 255, 200],
    pointRadiusMinPixels: 5,
  });
};

export const generateGeoJSONLayer = (
  data: FeatureCollection<Geometry, GeoJsonProperties>
) => {
  return new GeoJsonLayer({
    id: "loaded-geojson",
    data,
    pickable: true,
    stroked: false,
    filled: true,
    pointRadiusMinPixels: 5,
    getFillColor: [200, 0, 80, 180],
    getPointRadius: 100,
  });
};

export const generateTempDrawPoints = (points: TLngLat[]) => {
  return new ScatterplotLayer({
    id: "click-points",
    data: points,
    getPosition: (d) => d,
    getRadius: 10,
    pickable: false,
    getFillColor: [0, 0, 255, 255],
    radiusMinPixels: 5,
    radiusMaxPixels: 8,
    radiusUnits: "pixels",
  });
};

export const generateTempDrawLines = (points: TLngLat[]) => {
  return points.length > 1
    ? new PathLayer({
        id: "line-layer",
        data: [
          {
            path: points,
          },
        ],
        getPath: (d) => d.path,
        getColor: [13, 19, 28, 255],
        widthMinPixels: 2,
        pickable: false,
      })
    : null;
};

export const generatePolygonLayer = (polygons: TLngLat[][]) => {
  return polygons.map((coords, i) => {
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
};

export const generateFeatureLayer = (feature: Feature, index: number) => {
  const id = `feature-layer-${index}`;
  const geometry = feature.geometry;

  if (geometry.type === "Polygon") {
    return new PolygonLayer({
      id,
      data: [feature],
      getPolygon: (d) => d.geometry.coordinates,
      getFillColor: [255, 0, 0, 100],
      getLineColor: [0, 0, 0, 255],
      lineWidthMinPixels: 2,
      pickable: true,
    });
  }

  if (geometry.type === "LineString") {
    return new PathLayer({
      id,
      data: [{ path: geometry.coordinates }],
      getPath: (d) => d.path,
      getColor: [13, 19, 28, 255],
      widthMinPixels: 3,
      pickable: true,
    });
  }

  return null;
};

export const generateHighlightLayer = (
  feature: Feature,
  id = `highlight-${feature.id ?? Date.now()}`
) =>
  new GeoJsonLayer({
    id,
    data: {
      type: "FeatureCollection",
      features: [feature],
    },
    filled: true,
    stroked: true,
    getFillColor: [0, 255, 0, 80],
    getLineColor: [0, 255, 0, 255],
    lineWidthMinPixels: 4,
    pickable: false,
  });
