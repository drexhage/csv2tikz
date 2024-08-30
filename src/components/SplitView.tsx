import * as React from "react";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Settings from "./Settings";
import DownloadIcon from "@mui/icons-material/Download";
import {
  BarChart,
  CopyAll,
  PieChart,
  StackedBarChart,
} from "@mui/icons-material";

function SplitView() {
  const [open, setOpen] = useState(false);

  const downloadImage = () => {
    if (document.images.length === 0) {
      setOpen(true);
    } else {
      var img = document.images[0];
      var url = img.src.replace(
        /^data:image\/[^;]+/,
        "data:application/octet-stream"
      );

      var downloadLink = document.createElement("a");
      downloadLink.href = url;
      var filename_input = document.getElementById(
        "image_file_name"
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
    reason?: SnackbarCloseReason
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

  // TODO: relies on 'vh' which will not work well when adding a header
  return (
    <Box>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Button
              startIcon={
                <StackedBarChart style={{ transform: "rotate(90deg)" }} />
              }
              color="inherit"
            >
              Horizontal Stacked Bar chart
            </Button>
            <Button startIcon={<PieChart />} sx={{ ml: 2 }} color="inherit">
              Pie chart
            </Button>
            <Button startIcon={<BarChart />} sx={{ ml: 2 }} color="inherit">
              Bar chart
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Grid container mt={8}>
        <Grid item xs={4}>
          <Settings />
        </Grid>
        <Grid item xs={8}>
          <Box height={"560px"} m={"1vh"}>
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              variant="outlined"
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
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ m: "1vh" }} variant="outlined">
            <Typography sx={{ m: 1 }}>Output:</Typography>
            <Grid container>
              <Grid item xs={10}>
                <Paper
                  id="tikz_output"
                  variant="outlined"
                  sx={{ p: 1, height: "100px", overflow: "auto", ml: 1, mb: 1 }}
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
