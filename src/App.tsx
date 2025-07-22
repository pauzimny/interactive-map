import Box from "@mui/material/Box";
import InteractiveMap from "./features/InteractiveMap";
import Header from "./components/Header";

function App() {
  return (
    <Box width={"100vw"} height={"100vh"} maxWidth={"100vw"}>
      <Header />
      <InteractiveMap />
    </Box>
  );
}

export default App;
