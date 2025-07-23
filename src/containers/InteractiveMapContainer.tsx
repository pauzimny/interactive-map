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
  const { state, dispatch } = useGeoJSONContext();
  const {
    addLayer,
    layers,
    clearLayers,
    mapViewState,
    updateFullMapView,
    updateLayers,
    selectedLayersIndices,
  } = useMapViewContext();

  const geoJSONFeatures = useMemo(() => {
    return [...state.importedFeatures, ...state.drawnFeatures];
  }, [state.drawnFeatures, state.importedFeatures]);

  // useEffect(() => {
  //   if (!geoJSONFeatures.length) return;

  //   const highlightLayers = geoJSONFeatures
  //     .filter((feature) =>
  //       selectedLayersIndices.includes(feature.properties?.id)
  //     )
  //     .map((feature) =>
  //       generateHighlightLayer(feature, `highlighted-${feature.properties?.id}`)
  //     );

  //   const geoFeatureCollection = {
  //     type: "FeatureCollection" as const,
  //     features: geoJSONFeatures,
  //   };

  //   updateLayers([
  //     generateGeoJSONLayer(geoFeatureCollection),
  //     ...highlightLayers,
  //   ]);
  // }, [geoJSONFeatures, selectedLayersIndices, updateLayers]);

  return (
    <InteractiveMap
      geoJSONFeatures={geoJSONFeatures}
      dispatch={dispatch}
      // updateGeoJSON={updateGeoJSON}
      addLayer={addLayer}
      layers={layers}
      clearLayers={clearLayers}
      mapViewState={mapViewState}
      updateFullMapView={updateFullMapView}
      // updateLayers={updateLayers}
      {...props}
    />
  );
}

export default InteractiveMapContainer;
