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
import { exercisesRef, workoutsRef } from "../../../../firebase/fbRefs";
import { CenteredLayout } from "../../../UI/CenteredLayout";

export const ExercisesLayout = ({
  openAddExerciseDialog,
}: {
  openAddExerciseDialog(): void;
}) => {
  const [exercises, loading] = useCollectionData(exercisesRef);

  const [query, setQuery] = useState("");

  let filteredExercises = exercises?.slice(0);

  if (query && exercises) {
    filteredExercises = exercises.filter((workout) =>
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
          onClick={openAddExerciseDialog}
        >
          Agregar ejercicio
        </Button>
      </Box>
      {filteredExercises && filteredExercises.length > 0 ? (
        // <RoutinesTable workouts={filteredWorkouts as Workout[]} />
        <p>Aca irian todos los ejercicios, no mas tabla...</p>
      ) : (
        <CenteredLayout>
          <Typography variant="h5">No se encontró ningun ejercicio</Typography>
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
    label="Buscar un ejercicio"
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
