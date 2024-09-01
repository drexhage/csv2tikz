import { useState } from "react";
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  TextField,
} from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { selectFiles } from "../features/table/tableSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { DragHandle } from "@mui/icons-material";

function Legend() {
  let files = useAppSelector(selectFiles);
  const valueLabelMap = new Map();

  let indices = [];
  if (!!document.getElementById("file_1_form_control")) {
    let index = document
      ?.getElementById("file_1_form_control")
      ?.getElementsByTagName("input")[0].value;
    if (!!index && +index >= 0) {
      indices.push(+index);
    }
  }
  if (!!document.getElementById("file_2_form_control")) {
    let index = document
      ?.getElementById("file_2_form_control")
      ?.getElementsByTagName("input")[0].value;
    if (!!index && +index >= 0) {
      indices.push(+index);
    }
  }

  for (let i in indices) {
    let rows = files[i].txt.trim().split("\n");
    rows.splice(0, 1);

    rows.forEach((row) => {
      const columns = row.split(",");

      for (let i = 0; i < columns.length; i += 2) {
        const label = columns[i];
        const value = columns[i + 1];

        if (value !== "" && !valueLabelMap.has(value)) {
          valueLabelMap.set(value, label);
        }
      }
    });
  }

  const distinctValuesAndLabels = Array.from(valueLabelMap);
  distinctValuesAndLabels.sort();

  // --------

  const [data, setData] = useState(distinctValuesAndLabels);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    console.log("Result:", result);

    if (!destination) return;

    const newData = Array.from(data);
    newData.splice(source.index, 1);
    newData.splice(destination.index, 0, data[source.index]);

    console.log("Data:", data);
    console.log("New data:", newData);

    setData(newData);
    return;
  };

  // --------

  return (
    <Stack>
      <Typography variant="h5">Legend</Typography>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List ref={provided.innerRef}>
              {data.map((item, index) => (
                <Draggable key={item[0]} draggableId={item[0]} index={index}>
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                        {item[0]}
                      </Avatar>
                      <TextField defaultValue={item[1]} sx={{ flexGrow: 1 }} />
                      <ListItemIcon sx={{ ml: 1 }}>
                        <DragHandle />
                      </ListItemIcon>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
}

export default Legend;
