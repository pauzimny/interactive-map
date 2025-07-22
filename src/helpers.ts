import type { Feature, Polygon } from "geojson";
import type { TLngLat } from "./features/InteractiveMap";

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
    properties: {},
  };
};

export const downloadGeoJSON = (
  feature: Feature<Polygon>,
  filename = "polygon.geojson"
) => {
  const data = {
    type: "FeatureCollection",
    features: [feature],
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
