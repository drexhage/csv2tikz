import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectTable, unloadTable } from "../features/table/tableSlice";
import { useEffect, useMemo, useState } from "react";
import { Button, Divider, Grid, Toolbar } from "@mui/material";
import ColumnSelection, { EMPTY_VALUE } from "./ColumnSelection";
import { Aggregate } from "vega-lite/build/src/aggregate";
import { VegaLite } from "react-vega";
import { VisualizationSpec } from "vega-embed";

const AGGREGATE_FUNCTIONS = ["sum", "mean", "count"];

export default () => {
  let dispatch = useAppDispatch();
  let table = useAppSelector(selectTable);
  const [data, setData] = useState<{ table: any[] }>({ table: [] });
  let [yOffsetField, setYOffsetField] = useState<string | null>(
    table.headers[2]
  );
  let [xField, setXField] = useState<string | null>(null);
  let [yField, setYField] = useState<string | null>(table.headers[0]);
  let [colorField, setColorField] = useState(table.headers[1]);
  let [yAggregate, setYAggregate] = useState<Aggregate | null>(null);
  let [xAggregate, setXAggregate] = useState<Aggregate | null>("count");
  let [xStack, setXStack] = useState<"normalize" | null>("normalize");

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
          aggregate: xAggregate ? xAggregate : undefined,
          stack: xStack ? xStack : undefined,
        },
        y: {
          field: yField ? yField : undefined,
          aggregate: yAggregate ? yAggregate : undefined,
        },
        yOffset: {
          field: yOffsetField ? yOffsetField : undefined,
        },
        color: {
          field: colorField,
        },
      },
    }),
    [xField, xAggregate, yField, yAggregate, colorField]
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
      if (q === EMPTY_VALUE) {
        setterFunction(null);
      } else {
        let agg: Aggregate = q as Aggregate;
        setterFunction(agg);
      }
    };
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "auto",
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
            val={yOffsetField}
            options={table.headers}
            onChange={(a) => a && setYOffsetField(a)}
            fieldName={"X Offset"}
          />
          <ColumnSelection
            val={xField}
            options={table.headers}
            onChange={(a) => a && setXField(a)}
            fieldName={"X"}
          />
          <ColumnSelection
            val={yField}
            options={table.headers}
            onChange={(x) => x && setYField(x)}
            fieldName={"Y"}
          />
          <ColumnSelection
            val={colorField}
            options={table.headers}
            onChange={(x) => x && setColorField(x)}
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
          <ColumnSelection
            val={xStack}
            options={["normalize"]}
            onChange={setAggregate(setXStack)}
            fieldName={"X-Stack"}
          />
          <Button variant="contained" onClick={() => dispatch(unloadTable())}>
            Unload
          </Button>
        </Toolbar>
      </div>
    </div>
  );
};
