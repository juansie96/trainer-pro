import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Exercise } from '../../../../../types/workout'
import { getExerciseImgUrl } from '../../../../../utils'
import EditExerciseDialog from '../EditExerciseDialog'
import {
  ExerciseDataContainer,
  ExerciseImage,
  ExercisesCardContainer,
  ExercisesGridContainer,
  ShadowBackground,
  TagContainer,
} from './styles'
import { IProps } from './types'

const ExercisesGrid = ({ exercises }: IProps) => {
  return (
    <ExercisesGridContainer className='exercises-grid'>
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </ExercisesGridContainer>
  )
}

export default ExercisesGrid

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const [editExerciseDialogOpen, setEditExerciseDialogOpen] = useState<boolean>(false)

  return (
    <ExercisesCardContainer>
      <ExerciseImage
        src={getExerciseImgUrl(exercise)}
        onClick={() => setEditExerciseDialogOpen(true)}
        alt=''
      />
      <ShadowBackground onClick={() => setEditExerciseDialogOpen(true)}></ShadowBackground>
      <ExerciseDataContainer>
        <Typography variant='subtitle1' color='white' fontWeight={600}>
          {exercise.name}
        </Typography>
        <Box display='flex' mt={0.5}>
          {exercise.tags?.map((tag) => (
            <TagContainer key={tag}>
              <Typography variant='caption' color='white'>
                {tag}
              </Typography>
            </TagContainer>
          ))}
        </Box>
      </ExerciseDataContainer>
      {editExerciseDialogOpen && (
        <EditExerciseDialog
          open={editExerciseDialogOpen}
          onClose={() => setEditExerciseDialogOpen(false)}
          exercise={exercise}
        />
      )}
    </ExercisesCardContainer>
  )
}
