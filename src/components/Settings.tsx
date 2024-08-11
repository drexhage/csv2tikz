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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useState } from "react";

function Settings() {
  const [file1, setFile1] = useState<String>("0");
  const [file2, setFile2] = useState<String>("0");

  const handleChange1 = (e: SelectChangeEvent) =>
    setFile1(e.target.value as String);
  const handleChange2 = (e: SelectChangeEvent) =>
    setFile2(e.target.value as String);

  return (
    <Box m={"1vh"}>
      <Paper sx={{ height: "100%", padding: "16px" }} variant="outlined">
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>File 1:</Typography>
            <Box sx={{ minWidth: "35%" }}>
              <FormControl fullWidth>
                <InputLabel>Choose file</InputLabel>
                <Select label="Choose file" onChange={handleChange1}>
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={1}>File 1</MenuItem>
                  <MenuItem value={2}>File 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField label="File 1" variant="outlined" />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>File 2:</Typography>
            <Box sx={{ minWidth: "35%" }}>
              <FormControl fullWidth>
                <InputLabel>Choose file</InputLabel>
                <Select label="Choose file" onChange={handleChange2}>
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={1}>File 1</MenuItem>
                  <MenuItem value={2}>File 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField label="File 2" variant="outlined" />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography>Ignore every second column</Typography>
            <Checkbox defaultChecked sx={{ ml: 1 }} />
          </Stack>
          <Stack>
            <Typography sx={{ mb: 2 }}>Legend:</Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell align="right">Priority</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    key={"table-row-1"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      10
                    </TableCell>
                    <TableCell>Never heard of it</TableCell>
                    <TableCell align="right">1</TableCell>
                  </TableRow>
                  <TableRow
                    key={"table-row-2"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      1
                    </TableCell>
                    <TableCell>Not at all</TableCell>
                    <TableCell align="right">2</TableCell>
                  </TableRow>
                  <TableRow
                    key={"table-row-3"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      2
                    </TableCell>
                    <TableCell>Never heard of it</TableCell>
                    <TableCell align="right">3</TableCell>
                  </TableRow>
                  <TableRow
                    key={"table-row-4"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      3
                    </TableCell>
                    <TableCell>Never heard of it</TableCell>
                    <TableCell align="right">4</TableCell>
                  </TableRow>
                  <TableRow
                    key={"table-row-5"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      4
                    </TableCell>
                    <TableCell>Never heard of it</TableCell>
                    <TableCell align="right">5</TableCell>
                  </TableRow>
                  <TableRow
                    key={"table-row-6"}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      5
                    </TableCell>
                    <TableCell>Never heard of it</TableCell>
                    <TableCell align="right">6</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
        <Button
          py-click="load_files"
          startIcon={<EqualizerIcon />}
          sx={{ m: 2 }}
        >
          GENERATE
        </Button>
      </Paper>
    </Box>
  );
}

export default Settings;
