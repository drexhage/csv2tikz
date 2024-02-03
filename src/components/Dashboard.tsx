import { Button, Stack } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { useRef } from "react";
import Papa from "papaparse";
import { loadTable, transformFiles } from "../features/table/tableSlice";
import GraphView from "./GraphView";

export default () => {
  const inputFile = useRef<HTMLInputElement>(null);
  let dispatch = useAppDispatch();

  let loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let multipleFiles = false;
    let files = e.target?.files!;
    multipleFiles = files.length > 1;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const txt = e.target?.result?.toString()!;
        let fileName = files[i].name;
        dispatch(loadTable({ txt, fileName }));
        dispatch(transformFiles());
      };
      reader.readAsText(files[i]);
    }
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
      <input
        type="file"
        id="file"
        name="file"
        ref={inputFile}
        multiple
        accept=".csv"
        style={{ display: "none" }}
        onChange={loadFile}
      />
      <GraphView />
    </Stack>
  );
};
