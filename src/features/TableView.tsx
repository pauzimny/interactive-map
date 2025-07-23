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
import { generateHighlightLayer } from "../helpers";
import type { TDeckLayer } from "../context/MapViewProvider";

const defaultTableColumns = [
  { field: "type", headerName: "Geometry Type", width: 150 },
  { field: "id", headerName: "ID", width: 100 },
];

interface TableViewProps {
  isDialogOpen: boolean;
  geoJSONFeatures: Feature[];
  closeDialog: () => void;
  addLayer: (layer: TDeckLayer) => void;
  updateSelectedLayerIndices: (indices: number[]) => void;
}

function TableView({
  isDialogOpen,
  closeDialog,
  geoJSONFeatures,
  addLayer,
  updateSelectedLayerIndices,
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

  const rows = geoJSONFeatures.map((feature, index) => ({
    id: `${feature.geometry.type}-${index}`,
    ...(feature.properties || {}),
    type: feature.geometry.type,
  }));

  const handleRowClick = (params: GridRowParams<any>) => {
    const index = params.id;
    const selectedFeature = geoJSONFeatures[index as number];
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

    const indices = ids.map((id) => {
      const parts = `${id}`.split("-");
      return Number(parts[1]);
    });

    updateSelectedLayerIndices(indices);
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
              sx={{ flexGrow: 1 }}
              pageSizeOptions={[10, 50, 100]}
              checkboxSelection
              onRowSelectionModelChange={handleRowSelection}
              onRowClick={handleRowClick}
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
