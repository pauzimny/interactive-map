import { Map } from "react-map-gl/mapbox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const mapStyles = { width: "100vw", height: "100vh" };

function InteractiveMap() {
  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      style={mapStyles}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      dragRotate={false}
      pitchWithRotate={false}
    />
  );
}

export default InteractiveMap;
