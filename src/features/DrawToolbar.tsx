import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CreateIcon from "@mui/icons-material/Create";
import TimelineIcon from "@mui/icons-material/Timeline";
import UndoIcon from "@mui/icons-material/Undo";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import type { TDrawingMode } from "../App";

interface DrawToolbarProps {
  drawingMode?: TDrawingMode;
  setDrawingMode: (mode: TDrawingMode) => void;
  isFinishDrawingButtonDisabled: boolean;
  finishDrawingClick: () => void;
  exportGeoJSONClick: () => void;
  clearDrawing: () => void;
  undoLastPoint: () => void;
}

function DrawToolbar({
  drawingMode,
  setDrawingMode,
  isFinishDrawingButtonDisabled,
  finishDrawingClick,
  exportGeoJSONClick,
  clearDrawing,
  undoLastPoint,
}: DrawToolbarProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        right: 32,
        zIndex: 1,
        margin: 2,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ToggleButtonGroup
        value={drawingMode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode) setDrawingMode(newMode);
        }}
        size="small"
      >
        <ToggleButton value="POLYGON">
          <CreateIcon sx={{ mr: 1 }} />
          Polygon
        </ToggleButton>
        <ToggleButton value="LINE">
          <TimelineIcon sx={{ mr: 1 }} />
          Line
        </ToggleButton>
      </ToggleButtonGroup>

      <Stack direction="column" spacing={1}>
        <Button
          onClick={finishDrawingClick}
          disabled={isFinishDrawingButtonDisabled}
          variant="contained"
        >
          <SaveIcon sx={{ mr: 1 }} />
          Finish Drawing
        </Button>
        <Button onClick={undoLastPoint} variant="outlined">
          <UndoIcon sx={{ mr: 1 }} />
          Undo
        </Button>
        <Button onClick={exportGeoJSONClick} variant="outlined">
          <SaveIcon sx={{ mr: 1 }} />
          Export GeoJSON
        </Button>
        <Button onClick={clearDrawing} variant="outlined" color="error">
          <ClearIcon sx={{ mr: 1 }} />
          Clear Drawing
        </Button>
      </Stack>
    </Paper>
  );
}

export default DrawToolbar;
