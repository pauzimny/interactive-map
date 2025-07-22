import App from "../App";
import { GeoJSONProvider } from "../context/GeoJSONProvider";

function AppContainer() {
  return (
    <GeoJSONProvider>
      <App />
    </GeoJSONProvider>
  );
}

export default AppContainer;
