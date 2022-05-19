import { Box } from "@mui/material";
import React from "react";
import { extractVideoID } from "../../../../utils/utils";
import { Exercise } from "./Exercises";

interface ExercisesGridProps {
  exercises: Exercise[];
}

const ExercisesGrid: React.FC<ExercisesGridProps> = ({ exercises }) => {
  return (
    <Box
      className="exercises-grid"
      display="grid"
      gridTemplateColumns="repeat(4,1fr)"
      rowGap={2}
      columnGap={4}
      m={3}
    >
      {exercises.map((exercise) => <ExerciseCard exercise={exercise}/>)}
    </Box>
  );
};

export default ExercisesGrid;

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => (
  <Box height={200}>
    <img height='100%' style={{width: '100%'}} src={getExerciseImgUrl(exercise)}/>
  </Box>
);

function getExerciseImgUrl(exercise: Exercise): string {
  if (exercise.videoUrl && exercise.videoUrl.length > 0) {
    const videoId = extractVideoID(exercise.videoUrl);
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }

  return ''
}

// Video Image: https://img.youtube.com/vi/${id}/mqdefault.jpg