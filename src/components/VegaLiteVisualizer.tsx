import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectTable, unloadTable } from "../features/table/tableSlice";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Container, Divider, Grid, Toolbar } from "@mui/material";
import ColumnSelection from "./ColumnSelection";
import { Aggregate } from "vega-lite/build/src/aggregate";
import { VegaLite } from "react-vega";
import { VisualizationSpec } from "vega-embed";

const AGGREGATE_FUNCTIONS = ["sum", "mean"];

export default () => {
  let dispatch = useAppDispatch();
  let table = useAppSelector(selectTable);
  const [data, setData] = useState<{ table: any[] }>({ table: [] });
  let [xField, setXField] = useState(table.headers[0]);
  let [yField, setYField] = useState(table.headers[2]);
  let [colorField, setColorField] = useState(table.headers[1]);
  let [yAggregate, setYAggregate] = useState<Aggregate | undefined>("sum");
  let [xAggregate, setXAggregate] = useState<Aggregate | undefined>(undefined);

  let config = useMemo<VisualizationSpec>(
    () => ({
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      mark: "bar",
      data: {
        name: "table",
      },
      encoding: {
        x: {
          field: xField,
          aggregate: xAggregate,
        },
        y: {
          field: yField,
          aggregate: yAggregate,
        },
        color: {
          field: colorField,
        },
      },
    }),
    [xField, xAggregate, yField, yAggregate, colorField],
  );

  useEffect(() => {
    // passing the redux data directly to the vega lite fails on first try and requires reload
    let result: { table: any[] } = { table: [] };
    for (let row of table.data) {
      let t: any = {};
      for (let column of table.headers) {
        t[column] = row[column];
      }
      result.table.push(t);
    }
    setData(result);
  }, [table, config]);

  let setAggregate = (setterFunction: any) => {
    return (q: string) => {
      let agg: Aggregate = q as Aggregate;
      setterFunction(agg);
    };
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Grid
        container
        alignContent="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={1}>
          <VegaLite actions={false} spec={config} data={data} />
        </Grid>
      </Grid>
      <div>
        <Divider />
        <Toolbar>
          <ColumnSelection
            val={xField}
            options={table.headers}
            onChange={setXField}
            fieldName={"X"}
          />
          <ColumnSelection
            val={yField}
            options={table.headers}
            onChange={setYField}
            fieldName={"Y"}
          />
          <ColumnSelection
            val={colorField}
            options={table.headers}
            onChange={setColorField}
            fieldName={"color"}
          />
          <ColumnSelection
            val={yAggregate}
            options={AGGREGATE_FUNCTIONS}
            onChange={setAggregate(setYAggregate)}
            fieldName={"Y-Aggregate"}
          />
          <ColumnSelection
            val={xAggregate}
            options={AGGREGATE_FUNCTIONS}
            onChange={setAggregate(setXAggregate)}
            fieldName={"X-Aggregate"}
          />
          <Button variant="contained" onClick={() => dispatch(unloadTable())}>
            Unload
          </Button>
        </Toolbar>
      </div>
    </div>
  );
};
