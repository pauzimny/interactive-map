import type { TMapFeature } from "../App";
import { useGeoJSONContext } from "../context/useGeoJSONContext";
import InteractiveMap from "../features/InteractiveMap";

interface InteractiveMapContainerProps {
  activeFeature?: TMapFeature;
}

function InteractiveMapContainer({
  activeFeature,
}: InteractiveMapContainerProps) {
  const { geoJSON, updateGeoJSON, addLayer, layers, clearLayers } =
    useGeoJSONContext();

  return (
    <InteractiveMap
      geoJSON={geoJSON}
      updateGeoJSON={updateGeoJSON}
      addLayer={addLayer}
      activeFeature={activeFeature}
      layers={layers}
      clearLayers={clearLayers}
    />
  );
}

export default InteractiveMapContainer;
