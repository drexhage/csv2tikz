import { Box, Button, Stack, Typography, Checkbox } from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FileCard from "./FileCard";
import Legend from "./Legend";
import { useState } from "react";

function SettingsBar() {
  let [compare, setCompare] = useState(false);

  return (
    <Stack spacing={2}>
      <FileCard nr={1} default={0} />
      <Stack direction="row" alignItems="center">
        <Checkbox
          id="compare_with_file"
          sx={{ mr: 1 }}
          checked={compare}
          onChange={(_, c) => setCompare(c)}
        />
        <Typography>Compare</Typography>
      </Stack>
      {compare && <FileCard nr={2} default={-1} />}
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
