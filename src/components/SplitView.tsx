import * as React from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SettingsNormChart from "./SettingsNormChart";
import DownloadIcon from "@mui/icons-material/Download";
import { Analytics, CopyAll, ClearAll } from "@mui/icons-material";
import SettingsPie from "./SettingsPie";
import { useAppDispatch } from "../app/hooks";
import { unloadTable } from "../features/table/tableSlice";
import UploadButton from "./UploadButton";
import SettingsBar from "./SettingsBar";

function SplitView() {
  const [open, setOpen] = useState(false);
  let dispatch = useAppDispatch();

  const downloadImage = () => {
    if (document.images.length === 0) {
      setOpen(true);
    } else {
      var img = document.images[0];
      var url = img.src.replace(
        /^data:image\/[^;]+/,
        "data:application/octet-stream",
      );

      var downloadLink = document.createElement("a");
      downloadLink.href = url;
      var filename_input = document.getElementById(
        "image_file_name",
      ) as HTMLInputElement;
      downloadLink.download = filename_input.value ?? "graph.png";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const downloadText = () => {
    if (document.images.length === 0) {
      setOpen(true);
    } else {
      var downloadLink = document.createElement("a");
      var txt = document.getElementById("tikz_output")?.children[0]
        .innerHTML as string;
      downloadLink.href =
        "data:text/plain;charset=utf-8," + encodeURIComponent(txt);
      downloadLink.download = "tikz_code.txt";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const closeAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  // define different tabs
  enum OutputType {
    image,
    tikz,
  }
  let [activeOuptut, setActiveOutput] = useState(OutputType.image);
  enum ChartType {
    normStacked,
    pie,
    bar,
  }
  let [activeTab, setActiveTab] = useState(ChartType.normStacked);

  // TODO: relies on 'vh' which will not work well when adding a header
  return (
    <Box>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters variant={"dense"}>
            <Analytics sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              CSV2TikZ
            </Typography>
            <UploadButton />
            <Button
              onClick={() => dispatch(unloadTable())}
              startIcon={<ClearAll />}
              sx={{ ml: 2 }}
              color="inherit"
            >
              Unload
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Grid container mt={7}>
        <Grid item xs={4}>
          <Box m={"1vh"} height={"100%"}>
            <Paper sx={{ height: "100%" }} variant="outlined">
              <Tabs value={activeTab} onChange={(_, x) => setActiveTab(x)}>
                <Tab label="Horizontal Stacked Bar Chart" />
                <Tab label="Pie Chart" />
                <Tab label="Bar Chart" />
              </Tabs>
              <Divider />
              <Box sx={{ padding: "16px" }}>
                {activeTab === ChartType.pie && <SettingsPie />}
                {activeTab === ChartType.normStacked && <SettingsNormChart />}
                {activeTab === ChartType.bar && <SettingsBar />}
              </Box>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box height={"100%"} m={"1vh"}>
            <Paper sx={{ height: "100%" }} variant="outlined">
              <Tabs
                value={activeOuptut}
                onChange={(_, x) => setActiveOutput(x)}
              >
                <Tab label="Image" />
                <Tab label="Tikz Code" />
              </Tabs>
              <Divider />
              <Box
                sx={{
                  display: activeOuptut === OutputType.image ? "flex" : "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack spacing={2}>
                  <Box id="graph_output">
                    <Skeleton variant="rounded" width={900} height={480} />
                  </Box>
                  <Stack
                    spacing={2}
                    direction={"row"}
                    sx={{ alignSelf: "center" }}
                  >
                    <TextField
                      id={"image_file_name"}
                      label="Image file name"
                      variant="outlined"
                      size="small"
                      defaultValue={"graph.png"}
                    />
                    <Box sx={{ alignSelf: "center" }}>
                      <Button
                        onClick={downloadImage}
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                      >
                        Download image
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: activeOuptut === OutputType.tikz ? "flex" : "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item xs={12}>
                  <Paper sx={{ m: "1vh" }} variant="outlined">
                    <Typography sx={{ m: 1 }}>Output:</Typography>
                    <Grid container>
                      <Grid item xs={10}>
                        <Paper
                          id="tikz_output"
                          variant="outlined"
                          sx={{
                            p: 1,
                            height: "100px",
                            overflow: "auto",
                            ml: 1,
                            mb: 1,
                          }}
                        >
                          <Skeleton variant="rounded" height={"100%"} />
                        </Paper>
                      </Grid>
                      <Grid item xs={2}>
                        <Stack sx={{ height: "100%" }}>
                          <Button
                            variant="outlined"
                            sx={{ m: "auto" }}
                            onClick={downloadText}
                            startIcon={<DownloadIcon />}
                          >
                            Download
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{ m: "auto" }}
                            startIcon={<CopyAll />}
                          >
                            Copy
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="No image generated"
        action={closeAction}
      />
    </Box>
  );
}

export default SplitView;
