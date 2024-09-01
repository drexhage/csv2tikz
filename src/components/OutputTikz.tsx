import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { CopyAll } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import SyntaxHighlighter from "react-syntax-highlighter";
import { arduinoLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useState } from "react";

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

  const [text, setText] = useState("");
  const targetNode = document.getElementById("tikz_output")!;
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver((target) => {
    setText(target[0].target.textContent!);
  });
  observer.observe(targetNode, config);

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
