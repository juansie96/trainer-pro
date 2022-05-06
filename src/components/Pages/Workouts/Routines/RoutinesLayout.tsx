import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { workoutsRef } from "../../../../firebase/fbRefs";
import RoutinesTable from "./RoutinesTable";
import { Workout } from "./Routines";
import { CenteredLayout } from "../../../UI/CenteredLayout";

export const RoutinesLayout = ({
  openAddWorkoutDialog,
}: {
  openAddWorkoutDialog(): void;
}) => {
  const [workouts, loading] = useCollectionData(workoutsRef);

  const [query, setQuery] = useState("");

  let filteredWorkouts = workouts?.slice(0);

  if (query && workouts) {
    filteredWorkouts = workouts.filter((workout) =>
      workout.name.toUpperCase().includes(query.toUpperCase())
    );
  }

  return (
    <Box mt={5}>
      <Box display="flex" justifyContent="center" mb={5}>
        <SearchClientInput
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        <Button
          variant="contained"
          disabled={loading}
          onClick={openAddWorkoutDialog}
        >
          Agregar rutina
        </Button>
      </Box>
      {filteredWorkouts && filteredWorkouts.length > 0 ? (
        <RoutinesTable workouts={filteredWorkouts as Workout[]} />
      ) : (
        <CenteredLayout>
          <Typography variant="h5">No se encontró ninguna rutina</Typography>
        </CenteredLayout>
      )}
    </Box>
  );
};

const SearchClientInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}): JSX.Element => (
  <TextField
    sx={{ width: 600, mr: 2 }}
    type="text"
    size="small"
    label="Buscar una rutina"
    value={value}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton aria-label="toggle password visibility">
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);
