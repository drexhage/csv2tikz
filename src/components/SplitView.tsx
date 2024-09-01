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
  Snackbar,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SettingsNormChart from "./SettingsNormChart";
import { Analytics, ClearAll } from "@mui/icons-material";
import SettingsPie from "./SettingsPie";
import { useAppDispatch } from "../app/hooks";
import { unloadTable } from "../features/table/tableSlice";
import UploadButton from "./UploadButton";
import SettingsBar from "./SettingsBar";
import OutputTikz from "./OutputTikz";
import OutputImage from "./OutputImage";

function SplitView() {
  const [open, setOpen] = useState(false);
  let dispatch = useAppDispatch();

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
                <OutputImage onDownloadError={() => setOpen(true)} />
              </Box>
              <Box
                sx={{
                  display: activeOuptut === OutputType.tikz ? "flex" : "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <OutputTikz />
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
