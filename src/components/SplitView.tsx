import { Box, Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { selectTable, unloadTable } from "../features/table/tableSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default () => {
    let dispatch = useAppDispatch();
    let table = useAppSelector(selectTable);
    let columns = table.headers.map(x => ({ field: x, editable: true }));
    let i = 0;
    let rows = table.data.map(x => ({id: i++, ...x}));
    return (
      <Grid container>
        <Grid item xs={6}>
           <Box height={"100vh"}  gap={20}>
             <DataGrid rows={rows} columns={columns} />
           </Box>
        </Grid>
        <Grid item xs={6}>
           <Button variant="contained" onClick={() => dispatch(unloadTable())}>Unload</Button>
        </Grid>
     </Grid>
    );
}