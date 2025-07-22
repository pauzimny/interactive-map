import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import type { TGeoJSON } from "../context/GeoJSONProvider";
import { loadGeoJSONFromUrl } from "../api/getGeoJSON";
import { generateGeoJSONLayer } from "../helpers";
import type { TDeckLayer } from "../context/MapViewProvider";

const INITIAL_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson" as const;

interface UploadGeoJSONProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  updateLayers: (newLayers: TDeckLayer[]) => void;
  updateGeoJSON: (data: TGeoJSON | null) => void;
}

function UploadGeoJSON({
  updateLayers,
  isDialogOpen,
  closeDialog,
  updateGeoJSON,
}: UploadGeoJSONProps) {
  const [geoUrl, setGeoUrl] = useState<string>(INITIAL_URL);

  const handleLoad = async () => {
    try {
      const data = await loadGeoJSONFromUrl(geoUrl);

      updateGeoJSON(data);

      const geoLayer = generateGeoJSONLayer(data);

      updateLayers([geoLayer]);
      closeDialog();
    } catch (error) {
      alert("Failed to load GeoJSON!");
      console.error(error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog}>
      <DialogTitle>Load GeoJSON from URL</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <TextField
          label="GeoJSON URL"
          fullWidth
          value={geoUrl}
          onChange={(e) => setGeoUrl(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleLoad} variant="contained">
          Load
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadGeoJSON;
