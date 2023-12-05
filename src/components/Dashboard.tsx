import { Button, Stack } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { useRef } from "react";
import { buildPyScript, testScript } from "../PyScriptUtils";
import Papa from "papaparse";
import { loadTable } from "../features/table/tableSlice";

export default () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const { execute, remove } = buildPyScript(testScript);
  let dispatch = useAppDispatch();

  let loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result?.toString()!;
      let result = Papa.parse(text, { header: true });
      dispatch(loadTable({ data: result.data, headers: result.meta.fields! }));
    };
    let files = e.target?.files!;
    reader.readAsText(files[0]);
  };
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: 1, height: "100vh" }}
    >
      <label htmlFor="file">
        <Button
          variant="contained"
          style={{ cursor: "pointer" }}
          onClick={() => inputFile.current?.click()}
        >
          Import CSV
        </Button>
      </label>
      <Button
        variant="outlined"
        style={{ cursor: "pointer" }}
        onClick={execute}
      >
        Load script
      </Button>
      <Button variant="outlined" style={{ cursor: "pointer" }} onClick={remove}>
        Remove script
      </Button>
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
    </Stack>
  );
};
