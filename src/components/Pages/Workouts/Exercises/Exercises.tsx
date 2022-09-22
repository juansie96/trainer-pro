import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { CenteredLayout } from '../../../UI/CenteredLayout';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { ExercisesLayout } from './ExercisesLayout';
import AddExerciseDialog from './AddExerciseDialog';
import { exercisesRef, workoutsRef } from '../../../../firebase/fbRefs';

export interface Exercise {
  name: string;
  description?: string;
  id: string;
  videoUrl: string;
  imgUrls: string[] | null;
  tags: string[] | null;
  ref: DocumentReference<DocumentData>;
}

const Exercises = () => {
  let content;
  const [exercises, loading, error] = useCollectionData(exercisesRef);

  const [addExerciseDialogOpen, setAddExerciseDialogOpen] =
    useState<boolean>(false);

  const openAddExerciseDialog = () => {
    setAddExerciseDialogOpen(true);
  };

  const closeAddExerciseDialog = () => {
    setAddExerciseDialogOpen(false);
  };

  if (loading) {
    content = <p>Cargando..</p>;
  } else if (exercises && exercises.length > 0) {
    content = <ExercisesLayout openAddExerciseDialog={openAddExerciseDialog} />;
  } else {
    content = (
      <CenteredLayout>
        <Typography variant="h5">
          Todavía no creaste ningun ejercicio
        </Typography>
        <Typography
          fontSize={20}
          variant="subtitle1"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={openAddExerciseDialog}
        >
          Crea uno nuevo
        </Typography>
      </CenteredLayout>
    );
  }

  return (
    <Box height={1}>
      {content}
      {addExerciseDialogOpen && (
        <AddExerciseDialog
          open={addExerciseDialogOpen}
          onClose={closeAddExerciseDialog}
        />
      )}
    </Box>
  );
};

export default Exercises;
