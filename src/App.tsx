import Box from "@mui/material/Box";
import Header from "./components/Header";
import { useCallback, useState } from "react";
import InteractiveMapContainer from "./containers/InteractiveMapContainer";
import UploadGeoJSON from "./features/UploadGeoJSON";
import SearchLocation from "./features/SearchLocation";
import TableView from "./features/TableView";
import { useGeoJSONContext, useMapViewContext } from "./context/hooks";

export type TMapFeature =
  | "DRAW"
  | "UPLOAD_GEO_JSON"
  | "SEARCH_LOCATION"
  | "DISPLAY_TABLE";

export type TDrawingMode = "POLYGON" | "LINE";

function App() {
  const [activeFeature, setActiveFeature] = useState<TMapFeature>();
  const [drawingMode, setDrawingMode] = useState<TDrawingMode>("POLYGON");
  const { updateGeoJSON, geoJSONFeatures } = useGeoJSONContext();
  const {
    updateLayers,
    updateMapViewCoords,
    addLayer,
    updateSelectedLayerIndices,
  } = useMapViewContext();

  const isUploadDialogOpen = activeFeature === "UPLOAD_GEO_JSON";
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
      <InteractiveMapContainer
        activeFeature={activeFeature}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
      />
      <UploadGeoJSON
        isDialogOpen={isUploadDialogOpen}
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
        addLayer={addLayer}
        updateSelectedLayerIndices={updateSelectedLayerIndices}
      />
    </Box>
  );
}

export default App;
