import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAppDispatch } from "../app/hooks";
import { useRef } from "react";
import { loadTable, transformFiles } from "../features/table/tableSlice";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadButton() {
  const inputFile = useRef<HTMLInputElement>(null);
  let dispatch = useAppDispatch();

  let loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let files = e.target?.files!;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const txt = e.target?.result?.toString()!;
        let fileName = files[i].name;
        dispatch(loadTable({ txt, fileName }));
        dispatch(transformFiles());
      };
      reader.readAsText(files[i]);
    }
  };
  return (
    <Button
      color="inherit"
      component="label"
      role={undefined}
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        id="file"
        name="file"
        ref={inputFile}
        multiple
        accept=".csv"
        style={{ display: "none" }}
        onChange={loadFile}
      />
    </Button>
  );
}
