import * as React from "react";

import { alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Tooltip,
  TextField
} from "@mui/material";
import { DeleteOutline, FilterList } from "@mui/icons-material";

import {
  FieldArrayWithId,
  useFormContext,
} from "react-hook-form";


import { Exercise } from "../Exercises/Exercises";
import { AddWorkoutFormData, WorkoutExercise } from "./AddWorkoutDialog";
import { getExerciseImgUrl } from "../../../../utils/utils";

interface Data {
  name: string;
  sets?: number;
  rpe?: number;
  rest?: number;
  rmPercentage?: number;
}

function createData(
  name: string,
  sets?: number,
  rpe?: number,
  rest?: number,
  rmPercentage?: number
): Data {
  return {
    name,
    sets,
    rpe,
    rest,
    rmPercentage,
  };
}

const rows = [
  createData("Deadlift", 0, 1, 2, 9),
  createData("Squat", 3, 4, 5, 6),
];

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    disablePadding: false,
    label: "Ejercicio",
    align: "left",
  },
  {
    id: "sets",
    disablePadding: false,
    label: "Series",
    align: "center",
  },
  {
    id: "rpe",
    disablePadding: false,
    label: "RPE",
    align: "center",
  },
  {
    id: "rest",
    disablePadding: false,
    label: "Descanso",
    align: "center",
  },
  {
    id: "rmPercentage",
    disablePadding: false,
    label: "%RM",
    align: "center",
  },
];

interface EnhancedTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

interface EnhancedTableProps {
  fields: FieldArrayWithId<AddWorkoutFormData, "workoutExercises", "id">[];
  exercises: Exercise[];
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} ejercicios seleccionados
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Ejercicios
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterList />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function EnhancedTable({
  fields,
  exercises,
}: EnhancedTableProps) {
  // const [exercises, loading, error] = useCollectionData(exercisesRef);
  const { register, control, watch } = useFormContext<AddWorkoutFormData>();
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ width: 1 }}
            aria-labelledby="workout-exercises"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            />
            <TableBody>
              {fields.slice().map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                const exerciseData = exercises.find((e) => e.id === row.id);
                if (!exerciseData) return <></>;
                const isItemSelected = isSelected(exerciseData.name);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, exerciseData.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected} 
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{ width: "150px", marginRight: "20px" }}
                        src={getExerciseImgUrl(exerciseData)}
                        alt=""
                      />
                      <Typography>{exerciseData.name}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        {...register(`workoutExercises.${index}.sets` as any)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField size="small" {...register(`workoutExercises.${index}.rpe` as any)}/>
                    </TableCell>
                    <TableCell align="right">
                      <TextField size="small" {...register(`workoutExercises.${index}.rest` as any)} />
                    </TableCell>
                    <TableCell align="right">
                      <TextField size="small" {...register(`workoutExercises.${index}.rmPercentage` as any)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
