import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useGeoJSONContext } from "../context/useGeoJSONContext";
import { useState } from "react";
import { generatePinLayer } from "../helpers";
import { geocodeLocation } from "../api/geocode";

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
      const { lng, lat } = await geocodeLocation(query);

      updateMapView(lng, lat);

      const pinLayer = generatePinLayer({ lng, lat });
      addLayer(pinLayer);

      setQuery("");
      closeDialog();
    } catch (err) {
      console.error(err);
      alert("Location not found or geocoding failed.");
    }
  };

  const handleCloseDialog = () => {
    setQuery("");
    closeDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth>
      <DialogTitle>Search Location</DialogTitle>
      <DialogContent>
        <TextField
          label="Enter location"
          fullWidth
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSearch} variant="contained">
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SearchLocation;
