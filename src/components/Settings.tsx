import {
  Box,
  Paper,
  Button,
  Stack,
  Typography,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Checkbox,
  Grid,
} from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useState } from "react";
import { store } from "../app/store";

function Settings() {
  const [file1, setFile1] = useState<String>("0");
  const [file2, setFile2] = useState<String>("0");

  const files = store.getState().table.files;

  const handleChange1 = (e: SelectChangeEvent) =>
    setFile1(e.target.value as String);
  const handleChange2 = (e: SelectChangeEvent) =>
    setFile2(e.target.value as String);

  return (
    <Box m={"1vh"} height={"468px"}>
      <Paper sx={{ height: "100%", padding: "16px" }} variant="outlined">
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Grid item xs={2}>
            <Typography>File 1:</Typography>
          </Grid>
          <Grid item xs={5}>
            <Box sx={{ minWidth: "35%" }}>
              <FormControl id="file_1_form_control" fullWidth>
                <InputLabel>Choose file</InputLabel>
                <Select
                  label="Choose file"
                  onChange={handleChange1}
                  defaultValue="-1"
                >
                  <MenuItem value={-1} key={-1}>
                    None
                  </MenuItem>
                  {files.map((f, i) => (
                    <MenuItem value={i} key={i}>
                      {f.fileName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <TextField id="file_1_name" label="Name" variant="outlined" />
          </Grid>

          <Grid item xs={2}>
            <Typography>File 2:</Typography>
          </Grid>
          <Grid item xs={5}>
            <Box sx={{ minWidth: "35%" }}>
              <FormControl id="file_2_form_control" fullWidth>
                <InputLabel>Choose file</InputLabel>
                <Select
                  label="Choose file"
                  onChange={handleChange2}
                  defaultValue="-1"
                >
                  <MenuItem value={-1} key={-1}>
                    None
                  </MenuItem>
                  {files.map((f, i) => (
                    <MenuItem value={i} key={i}>
                      {f.fileName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <TextField id="file_2_name" label="Name" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center">
              <Typography>Ignore every second column</Typography>
              <Checkbox
                id="ignore_every_second_column"
                defaultChecked
                sx={{ ml: 1 }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              py-click="load_files"
              startIcon={<EqualizerIcon />}
              sx={{ m: 2 }}
            >
              GENERATE
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Settings;
