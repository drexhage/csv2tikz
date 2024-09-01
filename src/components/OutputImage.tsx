import { Box, Button, Skeleton, Stack, TextField } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

function OutputImage(props: { onDownloadError: () => void }) {
  const downloadImage = () => {
    if (document.images.length === 0) {
      props.onDownloadError();
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

  return (
    <Stack spacing={2}>
      <Box id="graph_output">
        <Skeleton variant="rounded" width={900} height={480} />
      </Box>
      <Stack spacing={2} direction={"row"} sx={{ alignSelf: "center" }}>
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
  );
}

export default OutputImage;
