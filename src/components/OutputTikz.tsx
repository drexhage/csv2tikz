import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { CopyAll } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import SyntaxHighlighter from "react-syntax-highlighter";
import { arduinoLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState } from "react";
import { observeNode } from "../app/observe";

function OutputTikz() {
  const [text, setText] = useState("");
  observeNode("tikz_output", (x) => setText(x.target.textContent!));

  const downloadText = () => {
    var downloadLink = document.createElement("a");
    downloadLink.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(text);
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
          <Grid item xs={12}>
            <Paper
              // id="tikz_output"
              variant="outlined"
              sx={{
                p: 1,
                height: "400px",
                overflow: "auto",
                m: 1,
              }}
            >
              <SyntaxHighlighter language="latex" style={arduinoLight}>
                {text}
              </SyntaxHighlighter>
            </Paper>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right", mb: 1, pr: 1 }}>
            <Button
              variant="outlined"
              sx={{ m: "auto" }}
              onClick={downloadText}
              startIcon={<DownloadIcon />}
            >
              Download
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "left", mb: 1, pl: 1 }}>
            <Button
              variant="outlined"
              sx={{ m: "auto" }}
              startIcon={<CopyAll />}
            >
              Copy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default OutputTikz;
