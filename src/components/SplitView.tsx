import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  selectTable,
  setNormalize,
  setTransformationDelimiter,
  transformFiles,
  updateCell,
} from "../features/table/tableSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import VegaLiteVisualizer from "./VegaLiteVisualizer";
import { useState } from "react";
import ColumnSelection from "./ColumnSelection";
import Settings from "./Settings";

export default () => {
  let dispatch = useAppDispatch();
  let table = useAppSelector(selectTable);
  let columns = table.headers.map((x) => ({ field: x, editable: true }));
  let i = 0;
  let rows = table.data.map((x) => ({ id: i++, ...x }));
  let [tab, setTab] = useState(1);

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

  // TODO: relies on 'vh' which will not work well when adding a header
  return (
    <Grid container>
      <Grid item xs={6}>
        <Box height={"98vh"} m={"1vh"}>
          <Paper sx={{ height: "100%" }} variant="outlined">
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
              <Tab label="Transformed data" />
              <Tab label="Raw data" />
            </Tabs>
            <Divider />
            <>
              {tab === 0 && (
                <>
                  <ColumnSelection
                    val={table.transformation.delimiter}
                    options={[",", ";", "tab"]}
                    onChange={(x: string) =>
                      x &&
                      dispatch(setTransformationDelimiter(x)) &&
                      dispatch(transformFiles())
                    }
                    fieldName={"Delimiter"}
                  />
                  <Switch
                    checked={table.transformation.normalize}
                    onChange={(_) =>
                      dispatch(setNormalize(!table.transformation.normalize)) &&
                      dispatch(transformFiles())
                    }
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </>
              )}
            </>
            <>
              {tab === 1 && (
                <Box
                  p={2}
                  height={"calc(100% - 12vh)"}
                  sx={{ position: "relative" }}
                >
                  <DataGrid
                    onProcessRowUpdateError={console.log}
                    processRowUpdate={updateCellCallback}
                    rows={rows}
                    columns={columns}
                  />
                </Box>
              )}
            </>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box height={"98vh"} m={"1vh"}>
          <Paper sx={{ height: "100%" }} variant="outlined">
            <VegaLiteVisualizer />
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={4}>
            <Settings />
          </Grid>
          <Grid item xs={8}>
            <Box height={"500px"} m={"1vh"}>
              <Paper
                id="graph_output"
                sx={{ height: "100%" }}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ m: "1vh" }} variant="outlined">
              <Typography sx={{ m: 1 }}>Output:</Typography>
              <Box
                id="tikz_output"
                sx={{ p: 1, height: "100px", overflow: "auto" }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
