import { Box, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { selectTable } from "../features/table/tableSlice";
import { useAppSelector } from "../app/hooks";
import VegaLiteVisualizer from "./VegaLiteVisualizer";

export default () => {
  let table = useAppSelector(selectTable);
  let columns = table.headers.map((x) => ({ field: x, editable: true }));
  let i = 0;
  let rows = table.data.map((x) => ({ id: i++, ...x }));

  return (
    <Grid container>
      <Grid item xs={6}>
        <Box height={"98vh"} m={"1vh"}>
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box height={"98vh"} m={"1vh"}>
          <VegaLiteVisualizer />
        </Box>
      </Grid>
    </Grid>
  );
};
