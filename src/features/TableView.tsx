import Close from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import type { Feature } from "geojson";
import { defineFeatureId, generateHighlightLayer } from "../helpers";
import type { TDeckLayer } from "../context/MapViewProvider";
import { useMemo } from "react";

const defaultTableColumns = [
  { field: "type", headerName: "Geometry Type", width: 150 },
  { field: "id", headerName: "ID", width: 100 },
];

type TFeatureRow = {
  id: string;
  [key: string]: unknown;
};
interface TableViewProps {
  isDialogOpen: boolean;
  geoJSONFeatures: Feature[];
  selectedLayersIndices: string[];
  closeDialog: () => void;
  addLayer: (layer: TDeckLayer) => void;
  updateSelectedLayerIndices: (indices: string[]) => void;
}

function TableView({
  isDialogOpen,
  closeDialog,
  geoJSONFeatures,
  addLayer,
  updateSelectedLayerIndices,
  selectedLayersIndices,
}: TableViewProps) {
  const firstFeatureWithProps = geoJSONFeatures.find(
    (f) => f.properties && Object.keys(f.properties).length > 0
  );

  const columns: GridColDef[] = firstFeatureWithProps
    ? Object.keys(firstFeatureWithProps.properties!).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
      }))
    : defaultTableColumns;

  const rows = useMemo(() => {
    return geoJSONFeatures.map((feature) => ({
      id: feature.properties?.id || defineFeatureId(),
      ...(feature.properties || {}),
      type: feature.geometry.type,
    }));
  }, [geoJSONFeatures]);

  const rowSelectionModel: GridRowSelectionModel = {
    type: "include",
    ids: new Set(selectedLayersIndices),
  };

  const handleRowClick = (params: GridRowParams<TFeatureRow>) => {
    const featureId = params.id;

    const selectedFeature = geoJSONFeatures.find(
      (feature) => feature.properties?.id === featureId
    );

    if (!selectedFeature) return;

    const highlightLayer = generateHighlightLayer(selectedFeature);
    addLayer(highlightLayer);
  };

  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    const ids =
      selectionModel &&
      typeof selectionModel === "object" &&
      "ids" in selectionModel
        ? Array.from(selectionModel.ids)
        : (selectionModel as (string | number)[]);

    const idStrings = ids.map(String);
    updateSelectedLayerIndices(idStrings);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          height: "50vh",
          width: "90vw",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>
        GeoJSON Table
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ flexGrow: 1 }}>
        {rows.length > 0 ? (
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              sx={{ flexGrow: 1 }}
              pageSizeOptions={[10, 50, 100]}
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection}
              onRowClick={handleRowClick}
              rowSelectionModel={rowSelectionModel}
            />
          </div>
        ) : (
          <Box
            alignItems="center"
            height="100%"
            justifyContent={"center"}
            sx={{ display: "flex" }}
          >
            <Typography sx={{ width: "100%", textAlign: "center" }}>
              No data to display. Load GeoJSON data or draw a polygon.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TableView;
