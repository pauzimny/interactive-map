import Close from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { FeatureCollection } from "geojson";

interface TableViewProps {
  isDialogOpen: boolean;
  geoJSON: FeatureCollection | null;
  closeDialog: () => void;
}

function TableView({ isDialogOpen, closeDialog, geoJSON }: TableViewProps) {
  const features = geoJSON?.features || [];

  const columns: GridColDef[] = Object.keys(features[0]?.properties || {}).map(
    (key) => ({
      field: key,
      headerName: key,
      width: 150,
    })
  );

  const rows = features.map((f, index) => ({
    id: index,
    ...f.properties,
  }));

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
