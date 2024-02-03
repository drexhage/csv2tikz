import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const FILE_NAME_COLUMN = "filename";

enum DuplicateColumn {
  takeFirst,
  takeLast,
  mark,
}

export interface TableState {
  headers: string[];
  data: any[];
  files: {fileName: string, txt: string}[];
  loaded: boolean;
  transformation: {
    delimiter: string;
    duplicateColumn: DuplicateColumn;
    normalize: boolean,
  };
}

const initialState: TableState = {
  headers: [],
  data: [],
  files: [],
  loaded: false,
  transformation: {
    normalize: false,
    delimiter: ",",
    duplicateColumn: DuplicateColumn.mark,
  }
};

function headersAreTheSame(headers1: string[], headers2: string[]): boolean {
  return JSON.stringify(headers1)==JSON.stringify(headers2);
}

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    loadTable: (
      state,
      action: PayloadAction<{ txt: string; fileName: string }>,
    ) => {
      state.files.push({ fileName: action.payload.fileName, txt: action.payload.txt})
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    setTable: (state, action: PayloadAction<{headers: string[], data: any[]}>) => {
      state.data = action.payload.data;
      state.headers = action.payload.headers;
    },
    setTransformationDelimiter: (state, action: PayloadAction<string>) => {
      state.transformation.delimiter = action.payload;
    },
    unloadTable: (state) => {
      state.headers = [];
      state.data = [];
      state.loaded = false;
      state.files = [];
    },
    updateCell: (
      state,
      action: PayloadAction<{ idx: number; column: string; value: any }>,
    ) => {
      state.data[action.payload.idx][action.payload.column] =
        action.payload.value;
    },
  },
});

export const transformFiles = () => {
  return (dispatch: any, getState: any) => {
    let state = getState().table;
    const { files, transformation } = state;
    let result = [];
    let resultHeaders: string[] = [];
    for (let file of files) {
      let [headers, data] = readCsvTxt(file.txt, transformation.delimiter, transformation.duplicateColumn);
      resultHeaders = headers;
      // TODO: assert same headers
      // add new entries
      if (transformation.normalize) {
        [headers, data] = normalizeTable(headers, data);
      }
      for (let i = 0; i < data.length; i++) {
        let entry: any = data[i];
        entry[FILE_NAME_COLUMN] = file.fileName;
        result.push(entry);
      }
    }
    resultHeaders.push(FILE_NAME_COLUMN);
    dispatch(setLoaded(true))
    dispatch(setTable({headers: resultHeaders, data: result}));
  };
}

function normalizeTable(headers: string[], data: any[]): [string[], any[]] {
  let resultHeaders: string[] = [];
  let resultData: any[] = [];
  // TODO
  return [resultHeaders, resultData];
}

function readCsvTxt(txt: string, delimiter: string, duplicateColumn: DuplicateColumn): [string[], any[]] {
  let lines = txt.split("\n");
  let h = lines[0];
  let headers: string[] = [];
  for (let header of h.split(delimiter)) {
    let candidate = header;
    //if (duplicateColumn === DuplicateColumn.mark) {
      while (headers.includes(candidate)) {
        candidate = `${candidate} (duplicate)`;
      }
    //}
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
      if (char === delimiter && !isInQuotes) {
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


/*
function applySlicerColumns(slicerColumns: SlicerColumns, headers: string[], values: any[]): [string[], any[]] {
  if (SlicerColumnsTactic.prefixColumns !== slicerColumns.tactic) {
    throw "Tactic invalid";
  }

  // generate new headers
  let resultHeaders: string[] = [];
  let g: string | undefined = undefined;
  for (let header of headers) {
    if (slicerColumns.columns.includes(header)) {
      g = header;
    } else {
      let newHeader = g ? `${g} - ${header}` : header;
      resultHeaders.push(newHeader);
    }
  }

  // generate new data
  let resultData: any[] = [];
  for (let entry of values) {
    let newEntry = {};
    for (let i = 0; i < headers.length; i++) {

    }
    resultData.push(newEntry);
  }

  return [resultHeaders, resultData];
}
*/

export const selectTable = (state: RootState) => state.table;

export const { setTable, setLoaded, loadTable, unloadTable, updateCell, setTransformationDelimiter } = tableSlice.actions;

export default tableSlice.reducer;
