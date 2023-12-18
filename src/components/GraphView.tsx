import { Box, Button } from "@mui/material";

function GraphView() {
  const remove = () => {
    document.getElementById("matplotlib_image")?.replaceChildren();
    document.getElementById("tikz_output")?.replaceChildren();
    document.getElementById("py-0")?.remove();
  };

  return (
    <Box>
      <Button
        variant="outlined"
        style={{ cursor: "pointer" }}
        py-click="display_graph"
      >
        Load script
      </Button>
      <Button variant="outlined" style={{ cursor: "pointer" }} onClick={remove}>
        Remove script
      </Button>
      <Box maxHeight={500}>
        <div id="matplotlib_image" />
        <div id="tikz_output" />
      </Box>
    </Box>
  );
}

export default GraphView;
export {};
