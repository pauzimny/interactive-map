import { useEffect } from "react";
import type { TDrawingMode, TMapFeature } from "../App";
import { useGeoJSONContext, useMapViewContext } from "../context/hooks";
import InteractiveMap from "../features/InteractiveMap";
import { generateGeoJSONLayer, generateHighlightLayer } from "../helpers";

interface InteractiveMapContainerProps {
  activeFeature?: TMapFeature;
  drawingMode?: TDrawingMode;
  setDrawingMode: (mode: TDrawingMode) => void;
}

function InteractiveMapContainer(props: InteractiveMapContainerProps) {
  const { geoJSONFeatures, updateGeoJSON } = useGeoJSONContext();
  const {
    addLayer,
    layers,
    clearLayers,
    mapViewState,
    updateFullMapView,
    updateLayers,
    selectedLayersIndices,
  } = useMapViewContext();

  useEffect(() => {
    if (!geoJSONFeatures.length) return;

    const highlightLayers = selectedLayersIndices.map((index) => {
      const feature = geoJSONFeatures[index];
      return generateHighlightLayer(feature, `highlighted-${index}`);
    });

    const geoFeatureCollection = {
      type: "FeatureCollection" as const,
      features: geoJSONFeatures,
    };

    updateLayers([
      generateGeoJSONLayer(geoFeatureCollection),
      ...highlightLayers,
    ]);
  }, [geoJSONFeatures, selectedLayersIndices, updateLayers]);

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
