import React, { useRef } from "react";
import Papa from "papaparse";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  loadTable,
  selectTable,
  unloadTable,
} from "./features/table/tableSlice";
import { buildPyScript, testScript } from "./PyScriptUtils";
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'

function App() {
  let dispatch = useAppDispatch();
  let table = useAppSelector(selectTable);
  const inputFile = useRef<HTMLInputElement>(null);
  const { execute, remove } = buildPyScript(testScript);

  let loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result?.toString()!;
      let result = Papa.parse(text, { header: true });
      console.log(result);
      dispatch(loadTable({ data: result.data, headers: result.meta.fields! }));
    };
    let files = e.target?.files!;
    reader.readAsText(files[0]);
  };
  let columns = table.headers.map(x => ({ field: x, editable: true }))
  let i = 0;
  let rows = table.data.map(x => ({id: i++, ...x}))

  if (table.loaded) {
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
  } else {
    return (
      <div className="App">
        <label htmlFor="file">
          <Button
            variant="contained"
            style={{ cursor: "pointer" }}
            onClick={() => inputFile.current?.click()}
          >
            Import CSV
          </Button>
          <Button variant="outlined" style={{ cursor: "pointer" }} onClick={execute}>
            Load script
          </Button>
          <Button variant="outlined" style={{ cursor: "pointer" }} onClick={remove}>
            Remove script
          </Button>
        </label>
        <input
          type="file"
          id="file"
          name="file"
          ref={inputFile}
          accept=".csv"
          style={{ display: "none" }}
          onChange={loadFile}
        />
        <div id="matplotlib_image" />
        <div id="tikz_output" />
      </div>
    );
  }
}

export default App;
