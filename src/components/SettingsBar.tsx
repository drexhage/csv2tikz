import { Box, Button, Stack, Typography, Checkbox } from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FileCard from "./FileCard";
import Legend from "./Legend";

function SettingsBar() {
  return (
    <Stack spacing={2}>
      <FileCard nr={1} default={0} ignoreNr />
      <Stack direction="row" alignItems="center">
        <Checkbox
          id="ignore_every_second_column"
          defaultChecked
          sx={{ mr: 1 }}
        />
        <Typography>Ignore every second column</Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Checkbox id="use_absolute_values" sx={{ mr: 1 }} />
        <Typography>Absolute values</Typography>
      </Stack>
      <Legend />
      <Box sx={{ m: 2, alignSelf: "center" }}>
        <Button
          variant="outlined"
          py-click="generate_graph_bar"
          startIcon={<EqualizerIcon />}
        >
          GENERATE
        </Button>
      </Box>
    </Stack>
  );
}

export default SettingsBar;
