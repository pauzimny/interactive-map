import Box from "@mui/material/Box";
import Header from "./components/Header";
import { useCallback, useState } from "react";
import UploadGeoJSON from "./features/UploadGeoJSON";
import { useGeoJSONContext } from "./context/useGeoJSONContext";
import InteractiveMapContainer from "./containers/InteractiveMapContainer";
import SearchLocation from "./features/SearchLocation";

export type TMapFeature =
  | "DRAW_POLYGON"
  | "UPLOAD_GEO_JSON"
  | "SEARCH_LOCATION";

function App() {
  const [activeFeature, setActiveFeature] = useState<TMapFeature>();
  const { updateLayers, updateGeoJSON, updateMapViewCoords } =
    useGeoJSONContext();

  const isUpdateDialogOpen = activeFeature === "UPLOAD_GEO_JSON";
  const isSearchLocationDialogOpen = activeFeature === "SEARCH_LOCATION";

  const updateActiveFeature = useCallback(
    (updatedActiveFeature: TMapFeature) => {
      const definedActiveFeature =
        updatedActiveFeature === activeFeature
          ? undefined
          : updatedActiveFeature;
      setActiveFeature(definedActiveFeature);
    },
    [activeFeature]
  );

  const handleCloseDialog = useCallback(() => {
    setActiveFeature(undefined);
  }, []);

  const updateMapView = useCallback(
    (lng: number, lat: number) => {
      updateMapViewCoords({ longitude: lng, latitude: lat });
    },
    [updateMapViewCoords]
  );

  return (
    <Box width={"100vw"} height={"100vh"} maxWidth={"100vw"}>
      <Header
        onNavItemClick={updateActiveFeature}
        activeNavItem={activeFeature}
      />
      <InteractiveMapContainer activeFeature={activeFeature} />
      <UploadGeoJSON
        isDialogOpen={isUpdateDialogOpen}
        closeDialog={handleCloseDialog}
        updateLayers={updateLayers}
        updateGeoJSON={updateGeoJSON}
      />
      <SearchLocation
        isDialogOpen={isSearchLocationDialogOpen}
        closeDialog={handleCloseDialog}
        updateMapView={updateMapView}
      />
    </Box>
  );
}

export default App;
