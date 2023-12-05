import { Box, Grid, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { selectTable, updateCell } from "../features/table/tableSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import VegaLiteVisualizer from "./VegaLiteVisualizer";

export default () => {
  let dispatch = useAppDispatch();
  let table = useAppSelector(selectTable);
  let columns = table.headers.map((x) => ({ field: x, editable: true }));
  let i = 0;
  let rows = table.data.map((x) => ({ id: i++, ...x }));

  let updateCellCallback = (updatedRow: any, originalRow: any) => {
    for (let header of table.headers) {
      if (updatedRow[header] != originalRow[header]) {
        let updatePayload = {
          idx: updatedRow.id,
          column: header,
          value: updatedRow[header],
        };
        dispatch(updateCell(updatePayload));
      }
    }
    return updatedRow;
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Box height={"98vh"} m={"1vh"}>
          <DataGrid
            onProcessRowUpdateError={console.log}
            processRowUpdate={updateCellCallback}
            rows={rows}
            columns={columns}
          />
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box height={"98vh"} m={"1vh"}>
          <Paper sx={{ height: "100%" }} variant="outlined">
            <VegaLiteVisualizer />
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};
