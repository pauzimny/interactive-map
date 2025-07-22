import Box from "@mui/material/Box";
import Header from "./components/Header";
import { useCallback, useState } from "react";
import UploadGeoJSON from "./features/UploadGeoJSON";
import { useGeoJSONContext } from "./context/useGeoJSONContext";
import InteractiveMapContainer from "./containers/InteractiveMapContainer";

export type TMapFeature = "DRAW_POLYGON" | "UPLOAD_GEO_JSON";

function App() {
  const [activeFeature, setActiveFeature] = useState<TMapFeature>();
  const { updateLayers } = useGeoJSONContext();

  const isDialogOpen = activeFeature === "UPLOAD_GEO_JSON";

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

  return (
    <Box width={"100vw"} height={"100vh"} maxWidth={"100vw"}>
      <Header
        onNavItemClick={updateActiveFeature}
        activeNavItem={activeFeature}
      />
      <InteractiveMapContainer activeFeature={activeFeature} />
      <UploadGeoJSON
        isDialogOpen={isDialogOpen}
        closeDialog={handleCloseDialog}
        updateLayers={updateLayers}
      />
    </Box>
  );
}

export default App;
