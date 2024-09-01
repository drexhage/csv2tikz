import {
  Button,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { CopyAll } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";

function OutputTikz() {
  const downloadText = () => {
    var downloadLink = document.createElement("a");
    var txt = document.getElementById("tikz_output")?.children[0]
      .innerHTML as string;
    downloadLink.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(txt);
    downloadLink.download = "tikz_code.txt";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ m: "1vh" }} variant="outlined">
        <Typography sx={{ m: 1 }}>Output:</Typography>
        <Grid container>
          <Grid item xs={10}>
            <Paper
              // id="tikz_output"
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
              <code id="tikz_output"></code>
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
  );
}

export default OutputTikz;
