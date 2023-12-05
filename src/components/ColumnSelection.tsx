import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { selectTable } from "../features/table/tableSlice";

interface ColumnSelectionProps {
  val: any;
  onChange: (x: string) => void;
  options: (string | undefined)[];
  fieldName: string;
}

export default ({
  options,
  fieldName,
  val,
  onChange,
}: ColumnSelectionProps) => {
  let i = 0;
  return (
    <>
      <FormControl>
        <InputLabel id={`${fieldName}-field`}>{fieldName}</InputLabel>
        <Select
          labelId={`${fieldName}-field`}
          id={`${fieldName}-field`}
          value={val}
          label={fieldName.toUpperCase()}
          onChange={(g) => onChange(String(g.target.value))}
        >
          {options.map((x) => (
            <MenuItem key={i++} value={x}>
              {x}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
