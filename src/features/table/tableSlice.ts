import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const FILE_NAME_COLUMN = "filename";

export interface TableState {
  headers: string[];
  data: any[];
  fileNames: string[];
  loaded: boolean;
}

const initialState: TableState = {
  headers: [],
  data: [],
  fileNames: [],
  loaded: false,
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
      action: PayloadAction<{ data: any[]; headers: string[]; fileName: string }>,
    ) => {
      if (!state.loaded) {
        state.headers = action.payload.headers;
        state.data = action.payload.data;
        state.fileNames = [action.payload.fileName];
        state.loaded = true;
      } else {
        // assert that headers are the same, add one header (excluding FILE_NAME_COLUMN) and append data
        if (state.headers.includes(FILE_NAME_COLUMN)) {
          // TODO
        } else if (headersAreTheSame(state.headers, action.payload.headers)) {
          state.headers.push(FILE_NAME_COLUMN);
          let result = [];
          // add existing entries
          for (let i = 0; i < state.data.length; i++) {
            let entry: any = JSON.parse(JSON.stringify(state)).data[i];
            entry[FILE_NAME_COLUMN] = state.fileNames[0];
            result.push(entry)
          }
          // add new entries
          for (let i = 0; i < action.payload.data.length; i++) {
            let entry: any = JSON.parse(JSON.stringify((action.payload))).data[i];
            entry[FILE_NAME_COLUMN] = action.payload.fileName;
            result.push(entry);
          }
          state.data = result;
        }
      }
    },
    unloadTable: (state) => {
      state.headers = [];
      state.data = [];
      state.loaded = false;
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

export const { loadTable, unloadTable, updateCell } = tableSlice.actions;

export default tableSlice.reducer;
