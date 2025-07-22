import Box from "@mui/material/Box";
import Header from "./components/Header";
import { useCallback, useState } from "react";
import InteractiveMapContainer from "./containers/InteractiveMapContainer";
import UploadGeoJSON from "./features/UploadGeoJSON";
import SearchLocation from "./features/SearchLocation";
import TableView from "./features/TableView";
import { useGeoJSONContext, useMapViewContext } from "./context/hooks";

export type TMapFeature =
  | "DRAW_POLYGON"
  | "UPLOAD_GEO_JSON"
  | "SEARCH_LOCATION"
  | "DISPLAY_TABLE";

function App() {
  const [activeFeature, setActiveFeature] = useState<TMapFeature>();
  const { updateGeoJSON, geoJSONFeatures } = useGeoJSONContext();
  const { updateLayers, updateMapViewCoords } = useMapViewContext();

  const isUpdateDialogOpen = activeFeature === "UPLOAD_GEO_JSON";
  const isSearchLocationDialogOpen = activeFeature === "SEARCH_LOCATION";
  const isTableViewDialogOpen = activeFeature === "DISPLAY_TABLE";

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
      <TableView
        isDialogOpen={isTableViewDialogOpen}
        geoJSONFeatures={geoJSONFeatures}
        closeDialog={handleCloseDialog}
      />
    </Box>
  );
}

export default App;
