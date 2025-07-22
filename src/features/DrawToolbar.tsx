import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

interface DrawToolbarProps {
  isFinishDrawingButtonDisabled: boolean;
  finishDrawingClick: () => void;
  exportGeoJSONClick: () => void;
  clearDrawing: () => void;
}

function DrawToolbar({
  isFinishDrawingButtonDisabled,
  finishDrawingClick,
  exportGeoJSONClick,
  clearDrawing,
}: DrawToolbarProps) {
  return (
    <Paper
      sx={{
        position: "absolute",
        right: 32,
        zIndex: 1,
        margin: 2,
        paddingY: 6,
        paddingX: 4,
      }}
    >
      <Button
        onClick={finishDrawingClick}
        disabled={isFinishDrawingButtonDisabled}
      >
        Finish Drawing
      </Button>

      <Button onClick={exportGeoJSONClick}>Export GeoJSON</Button>
      <Button onClick={clearDrawing}>Clear drawing</Button>
    </Paper>
  );
}

export default DrawToolbar;
