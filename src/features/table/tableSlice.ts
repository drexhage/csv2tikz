import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface TableState {
  headers: string[];
  data: any[];
  loaded: boolean;
}

const initialState: TableState = {
  headers: [],
  data: [],
  loaded: false,
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    loadTable: (
      state,
      action: PayloadAction<{ data: any[]; headers: string[] }>,
    ) => {
      state.headers = action.payload.headers;
      state.data = action.payload.data;
      state.loaded = true;
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

export const selectTable = (state: RootState) => state.table;

export const { loadTable, unloadTable, updateCell } = tableSlice.actions;

export default tableSlice.reducer;
