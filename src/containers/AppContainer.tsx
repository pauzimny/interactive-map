import App from "../App";
import { GeoJSONProvider } from "../context/GeoJSONProvider";
import { MapViewProvider } from "../context/MapViewProvider";

function AppContainer() {
  return (
    <MapViewProvider>
      <GeoJSONProvider>
        <App />
      </GeoJSONProvider>
    </MapViewProvider>
  );
}

export default AppContainer;
