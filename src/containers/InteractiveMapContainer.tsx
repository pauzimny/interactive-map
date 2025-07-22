import type { TDrawingMode, TMapFeature } from "../App";
import { useGeoJSONContext, useMapViewContext } from "../context/hooks";
import InteractiveMap from "../features/InteractiveMap";

interface InteractiveMapContainerProps {
  activeFeature?: TMapFeature;
  drawingMode?: TDrawingMode;
  setDrawingMode: (mode: TDrawingMode) => void;
}

function InteractiveMapContainer(props: InteractiveMapContainerProps) {
  const { geoJSONFeatures, updateGeoJSON } = useGeoJSONContext();
  const { addLayer, layers, clearLayers, mapViewState, updateFullMapView } =
    useMapViewContext();

  return (
    <InteractiveMap
      geoJSONFeatures={geoJSONFeatures}
      updateGeoJSON={updateGeoJSON}
      addLayer={addLayer}
      layers={layers}
      clearLayers={clearLayers}
      mapViewState={mapViewState}
      updateFullMapView={updateFullMapView}
      {...props}
    />
  );
}

export default InteractiveMapContainer;
