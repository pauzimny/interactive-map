import Box from "@mui/material/Box";
import InteractiveMap from "./features/InteractiveMap";
import Header from "./components/Header";
import { useCallback, useState } from "react";

export type TMapFeature = "DRAW_POLYGON";

function App() {
  const [activeFeature, setActiveFeature] = useState<TMapFeature>();

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

  return (
    <Box width={"100vw"} height={"100vh"} maxWidth={"100vw"}>
      <Header
        onNavItemClick={updateActiveFeature}
        activeNavItem={activeFeature}
      />
      <InteractiveMap />
    </Box>
  );
}

export default App;
