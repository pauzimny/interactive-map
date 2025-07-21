import Grid from "@mui/material/Grid";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import "./App.css";

function App() {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <div>Interactive maps app</div>
      </Grid>
      <Grid item>
        <RocketLaunch />
      </Grid>
    </Grid>
  );
}

export default App;
