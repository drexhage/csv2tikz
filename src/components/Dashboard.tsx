import { Button, Stack } from "@mui/material";
import { useAppDispatch } from "../app/hooks";
import { useRef } from "react";
import Papa from "papaparse";
import { loadTable } from "../features/table/tableSlice";
import GraphView from "./GraphView";

function readCsvTxt(txt: string): [string[], any[]] {
  let lines = txt.split("\n");
  let h = lines[0];
  let headers: string[] = [];
  for (let header of h.split(",")) {
    let candidate = header;
    while (headers.includes(candidate)) {
      candidate = `${candidate} (duplicate)`;
    }
    headers.push(candidate);
  }
  let result = [];
  for (let line of lines.slice(1)) {
    let isInQuotes = false;
    let j = 0;
    let accumulated = "";
    let entry: any = {};
    for (let i = 0; i < line.length; i++) {
      let char = line.charAt(i);
      if (char === ',' && !isInQuotes) {
        entry[headers[j]] = accumulated;
        j++;
        accumulated = "";
      } else if (char === '"' && isInQuotes) {
        isInQuotes = false;
      } else if (char === '"' && !isInQuotes) {
        isInQuotes = true;
      } else if (i == line.length - 1) {
        entry[headers[j]] = accumulated;
      } else {
        accumulated = `${accumulated}${char}`;
      }
    }

    result.push(entry);
  }
  return [headers, result]
}

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
        const text = e.target?.result?.toString()!;
        //let result = Papa.parse(text, { header: true, delimiter: ",", newline: "\n" });
        let fileName = files[i].name;
        let [headers, result] = readCsvTxt(text);
        dispatch(loadTable({ data: result, headers, fileName }));
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
