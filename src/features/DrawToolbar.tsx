import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

interface DrawToolbarProps {
  isFinishDrawingButtonDisabled: boolean;
  finishDrawingClick: () => void;
  exportGeoJSONClick: () => void;
  clearDrawing: () => void;
  undoLastPoint: () => void;
}

function DrawToolbar({
  isFinishDrawingButtonDisabled,
  finishDrawingClick,
  exportGeoJSONClick,
  clearDrawing,
  undoLastPoint,
}: DrawToolbarProps) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: "absolute",
        right: 32,
        top: 75,
        zIndex: 10,
        p: 2,
        borderRadius: 3,
        bgcolor: "#fff",
      }}
    >
      <Stack spacing={1} direction="column">
        <Tooltip title="Undo last point">
          <span>
            <Button
              onClick={undoLastPoint}
              variant="outlined"
              startIcon={<UndoIcon />}
              disabled={isFinishDrawingButtonDisabled}
              fullWidth
            >
              Undo
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Finish current polygon">
          <span>
            <Button
              onClick={finishDrawingClick}
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              disabled={isFinishDrawingButtonDisabled}
              fullWidth
            >
              Finish
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Export all polygons as GeoJSON">
          <Button
            onClick={exportGeoJSONClick}
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            fullWidth
          >
            Export
          </Button>
        </Tooltip>

        <Tooltip title="Clear all points & polygons">
          <Button
            onClick={clearDrawing}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            fullWidth
          >
            Clear
          </Button>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

export default DrawToolbar;
