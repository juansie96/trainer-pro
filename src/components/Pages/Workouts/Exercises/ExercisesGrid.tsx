import { Box, Typography } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../../../../firebase/firebase";
import { extractVideoID } from "../../../../utils/utils";
import EditExerciseDialog from "./EditExerciseDialog";
import { Exercise } from "./Exercises";
import styles from "./Exercises.module.css";

interface ExercisesGridProps {
  exercises: Exercise[];
}

const ExercisesGrid: React.FC<ExercisesGridProps> = ({ exercises }) => {
  console.log("styles", styles);
  return (
    <Box
      className="exercises-grid"
      display="grid"
      gridTemplateColumns="repeat(4,1fr)"
      rowGap={2}
      columnGap={4}
      m={3}
    >
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </Box>
  );
};

export default ExercisesGrid;

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const [editExerciseDialogOpen, setEditExerciseDialogOpen] =
    useState<boolean>(false);

  const openEditExerciseDialog = () => {
    setEditExerciseDialogOpen(true);
  };

  const closeEditExerciseDialog = () => {
    setEditExerciseDialogOpen(false);
  };

  return (
    <Box
      height={200}
      position="relative"
      sx={{ cursor: "pointer" }}
      borderRadius={2}
    >
      <img
        height="100%"
        style={{ width: "100%" }}
        src={getExerciseImgUrl(exercise)}
        onClick={openEditExerciseDialog}
        className={styles.ImgInsetShadow}
      />
      <Box
        boxShadow="0px 0px 50px 11px rgba(0,0,0,0.75) inset"
        position="absolute"
        top={0}
        width={1}
        height={1}
      ></Box>
      <Box position="absolute" bottom={10} left={10}>
        <Typography variant="subtitle1" color="white" fontWeight={600}>
          {exercise.name}
        </Typography>
        <Box display="flex" mt={0.5}>
          {exercise.tags?.map((tag) => (
            <Tag key={tag + Math.random()} name={tag} />
          ))}
        </Box>
      </Box>
      {editExerciseDialogOpen && (
        <EditExerciseDialog
          open={editExerciseDialogOpen}
          onClose={closeEditExerciseDialog}
          exercise={exercise}
        />
      )}
    </Box>
  );
};

const Tag = ({ name }: { name: string }) => (
  <Box borderRadius={1} paddingX={1} bgcolor="#769395" flexWrap="wrap" mr={0.5}>
    <Typography variant="caption" color="white">
      {name}
    </Typography>
  </Box>
);

function getExerciseImgUrl(exercise: Exercise): string {
  if (exercise.videoUrl && exercise.videoUrl.length > 0) {
    const videoId = extractVideoID(exercise.videoUrl);
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  } else if (exercise.imgUrls && exercise.imgUrls.length) {
    return exercise.imgUrls[0];
  } else {
    return "https://reviverestore.org/wp-content/uploads/2017/05/placeholder-image-cropped.jpg";
  }

  return "";
}

// Video Image: https://img.youtube.com/vi/${id}/mqdefault.jpg
