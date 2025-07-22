import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
  Polygon,
} from "geojson";
import type { TLngLat } from "./context/GeoJSONProvider";
import { GeoJsonLayer } from "deck.gl";

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
    ring.push(ring[0]); // zamknięcie pierścienia
  }

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
    properties: {
      name: "User drawn",
      createdAt: new Date().toISOString(),
      pointsCount: ring.length,
    },
  };
};

export const downloadGeoJSON = (
  features: Feature[],
  filename = "polygons.geojson"
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
    pointRadiusMinPixels: 2,
    getFillColor: [200, 0, 80, 180],
    getPointRadius: 100,
  });
};
