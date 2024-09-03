import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface TableState {
  files: { fileName: string; txt: string }[];
  loaded: boolean;
}

const initialState: TableState = {
  files: [],
  loaded: false,
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    loadTable: (
      state,
      action: PayloadAction<{ txt: string; fileName: string }>,
    ) => {
      state.files.push({
        fileName: action.payload.fileName,
        txt: action.payload.txt,
      });
    },
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },
    unloadTable: (state) => {
      state.loaded = false;
      state.files = [];
    },
  },
});

export const selectTable = (state: RootState) => state.table;

export const selectFiles = (state: RootState) => state.table.files;

export const { setLoaded, unloadTable, loadTable } = tableSlice.actions;

export default tableSlice.reducer;
