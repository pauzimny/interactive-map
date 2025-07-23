import { useEffect, useMemo } from "react";
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

  const highlightLayers = useMemo(() => {
    return geoJSONFeatures
      .filter((feature) =>
        selectedLayersIndices.includes(feature.properties?.id || feature.id)
      )
      .map((feature) =>
        generateHighlightLayer(
          feature,
          `highlighted-${feature.properties?.id || feature.id}`
        )
      );
  }, [geoJSONFeatures, selectedLayersIndices]);

  useEffect(() => {
    if (!geoJSONFeatures.length) return;

    const geoFeatureCollection = {
      type: "FeatureCollection" as const,
      features: geoJSONFeatures,
    };

    updateLayers([
      generateGeoJSONLayer(geoFeatureCollection),
      ...highlightLayers,
    ]);
  }, [geoJSONFeatures, highlightLayers, selectedLayersIndices, updateLayers]);

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
