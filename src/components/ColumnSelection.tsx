import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface ColumnSelectionProps {
  val: any;
  onChange: (x: string) => void;
  options: (string | undefined)[];
  fieldName: string;
}

export const EMPTY_VALUE = "EMPTY";

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
          value={val ? val : EMPTY_VALUE}
          label={fieldName.toUpperCase()}
          onChange={(g) => onChange(String(g.target.value))}
        >
          <MenuItem key={-1} value={EMPTY_VALUE}>
            undefined
          </MenuItem>
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
