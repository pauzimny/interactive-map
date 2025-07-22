import type { TMapFeature } from "../App";
import { useGeoJSONContext, useMapViewContext } from "../context/hooks";
import InteractiveMap from "../features/InteractiveMap";

interface InteractiveMapContainerProps {
  activeFeature?: TMapFeature;
}

function InteractiveMapContainer({
  activeFeature,
}: InteractiveMapContainerProps) {
  const { geoJSON, updateGeoJSON } = useGeoJSONContext();
  const { addLayer, layers, clearLayers, mapViewState, updateFullMapView } =
    useMapViewContext();

  return (
    <InteractiveMap
      geoJSON={geoJSON}
      updateGeoJSON={updateGeoJSON}
      addLayer={addLayer}
      activeFeature={activeFeature}
      layers={layers}
      clearLayers={clearLayers}
      mapViewState={mapViewState}
      updateFullMapView={updateFullMapView}
    />
  );
}

export default InteractiveMapContainer;
