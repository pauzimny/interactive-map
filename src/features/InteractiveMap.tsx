import { Map } from "react-map-gl/mapbox";
import { DeckGL, ZoomWidget } from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const mapStyles = { width: "100vw", height: "100vh" };

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 21.999121,
  latitude: 50.041187,
  zoom: 4,
};

function InteractiveMap() {
  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        style={mapStyles}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        dragRotate={false}
        pitchWithRotate={false}
      />

      <ZoomWidget />
    </DeckGL>
  );
}

export default InteractiveMap;
