import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useGeoJSONContext } from "../context/useGeoJSONContext";
import { useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import type { FeatureCollection, Point } from "geojson";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

interface SearchLocationProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  updateMapView: (lng: number, lat: number) => void;
}

function SearchLocation({
  isDialogOpen,
  closeDialog,
  updateMapView,
}: SearchLocationProps) {
  const [query, setQuery] = useState<string>("");
  const { addLayer } = useGeoJSONContext();

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();

      if (!data.features || data.features.length === 0) {
        alert("No location found!");
        return;
      }

      const [lng, lat] = data.features[0].center;

      updateMapView(lng, lat);

      const pointGeoJSON: FeatureCollection<Point> = {
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

      const pinLayer = new GeoJsonLayer({
        id: `search-result-pin-${Date.now()}`,
        data: pointGeoJSON,
        getPointRadius: 10,
        getFillColor: [0, 0, 255, 200],
        pointRadiusMinPixels: 5,
      });

      addLayer(pinLayer);
      closeDialog();
    } catch (err) {
      alert("Geocoding failed");
      console.error(err);
    }
  };

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth>
      <DialogTitle>Search Location</DialogTitle>
      <DialogContent>
        <TextField
          label="Enter location"
          fullWidth
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleSearch} variant="contained">
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SearchLocation;
