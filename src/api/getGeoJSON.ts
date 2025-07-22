import axios from "axios";
import type { FeatureCollection } from "geojson";

export const loadGeoJSONFromUrl = async (
  url: string
): Promise<FeatureCollection> => {
  try {
    const { data } = await axios.get<FeatureCollection>(url);
    return data;
  } catch (err) {
    console.error("Failed to load GeoJSON:", err);
    throw new Error("Invalid or inaccessible GeoJSON URL");
  }
};
