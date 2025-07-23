import {
  createContext,
  useCallback,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { Feature } from "geojson";

export type TLngLat = [number, number];

export interface FeatureData {
  id: string;
  type: "drawn" | "imported";
  feature: GeoJSON.Feature;
}

export interface GeoState {
  importedFeatures: FeatureData[];
  drawnFeatures: FeatureData[];
}

export type GeoAction =
  | { type: "IMPORT_GEOJSON"; payload: GeoJSON.Feature[] }
  | { type: "ADD_DRAWN_FEATURE"; payload: GeoJSON.Feature }
  | { type: "DELETE_FEATURE"; id: string }
  | { type: "CLEAR_DRAWN" }
  | { type: "CLEAR_IMPORTED" };

export interface IGeoJSONContext {
  state: GeoState;
  dispatch: React.Dispatch<GeoAction>;
}

function geoReducer(state: GeoState, action: GeoAction): GeoState {
  switch (action.type) {
    case "IMPORT_GEOJSON":
      return {
        ...state,
        importedFeatures: action.payload.map((f) => ({
          id: crypto.randomUUID(),
          type: "imported",
          feature: f,
        })),
      };
    case "ADD_DRAWN_FEATURE":
      return {
        ...state,
        drawnFeatures: [
          ...state.drawnFeatures,
          {
            id: crypto.randomUUID(),
            type: "drawn",
            feature: action.payload,
          },
        ],
      };
    case "DELETE_FEATURE":
      return {
        ...state,
        drawnFeatures: state.drawnFeatures.filter((f) => f.id !== action.id),
        importedFeatures: state.importedFeatures.filter(
          (f) => f.id !== action.id
        ),
      };
    default:
      return state;
  }
}

const GeoJSONContext = createContext<IGeoJSONContext | undefined>(undefined);

const GeoJSONProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(geoReducer, {
    importedFeatures: [],
    drawnFeatures: [],
  });

  return (
    <GeoJSONContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </GeoJSONContext.Provider>
  );
};

export { GeoJSONContext, GeoJSONProvider };
