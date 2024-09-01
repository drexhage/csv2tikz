import { Box, CircularProgress } from "@mui/material";

function LoadingScreen() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyItems="center"
      justifyContent={"center"}
      justifySelf="center"
      width="100%"
      height="700px"
    >
      <CircularProgress />
    </Box>
  );
}

export default LoadingScreen;
