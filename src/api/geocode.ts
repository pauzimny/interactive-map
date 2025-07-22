import axios from "axios";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

interface Coordinates {
  lng: number;
  lat: number;
}

export const geocodeLocation = async (query: string): Promise<Coordinates> => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${MAPBOX_TOKEN}`;

    const { data } = await axios.get(url);

    if (!data.features || data.features.length === 0) {
      throw new Error("No location found");
    }

    const [lng, lat] = data.features[0].center;
    return { lng, lat };
  } catch (err) {
    console.error("Geocoding error:", err);
    throw err;
  }
};
