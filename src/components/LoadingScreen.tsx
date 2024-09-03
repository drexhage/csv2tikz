import { CircularProgress, Stack } from "@mui/material";

function LoadingScreen() {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: 1, height: "100vh" }}
    >
      <CircularProgress />
    </Stack>
  );
}

export default LoadingScreen;
