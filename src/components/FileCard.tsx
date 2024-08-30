import {
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { store } from "../app/store";

interface FileCardProps {
  nr: number;
  default: number;
}

function FileCard(props: FileCardProps) {
  const files = store.getState().table.files;

  return (
    <Card sx={{ minWidth: "35%" }} variant="outlined">
      <CardHeader title={`File ${props.nr}`} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl id={`file_${props.nr}_form_control`} fullWidth>
              <InputLabel>Choose file</InputLabel>
              <Select label="Choose file" defaultValue={`${props.default}`}>
                <MenuItem value={-1} key={-1}>
                  None
                </MenuItem>
                {files.map((f, i) => (
                  <MenuItem value={i} key={i}>
                    {f.fileName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id={`file_${props.nr}_name`}
              label="Name"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FileCard;
