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
  },
});

export const selectTable = (state: RootState) => state.table;

export const { loadTable, unloadTable } = tableSlice.actions;

export default tableSlice.reducer;
