import { Box, Paper, Button, Stack, Typography, Checkbox } from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FileCard from "./FileCard";

function SettingsNormChart() {
  return (
    <Box m={"1vh"} height={"528px"}>
      <Paper sx={{ height: "100%", padding: "16px" }} variant="outlined">
        <Stack spacing={2}>
          <FileCard nr={1} default={0} />
          <FileCard nr={2} default={1} />
          <Stack direction="row" alignItems="center">
            <Checkbox
              id="ignore_every_second_column"
              defaultChecked
              sx={{ mr: 1 }}
            />
            <Typography>Ignore every second column</Typography>
          </Stack>
          <Box sx={{ m: 2, alignSelf: "center" }}>
            <Button
              variant="outlined"
              py-click="generate_graph_norm"
              startIcon={<EqualizerIcon />}
            >
              GENERATE
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default SettingsNormChart;
