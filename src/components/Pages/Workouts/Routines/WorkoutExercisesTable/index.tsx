import { useState } from 'react'
import { Controller, FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form'
import { AddWorkoutFormData } from '../AddWorkoutDialog'
import { IProps } from './types'
import {
  Paper,
  TextField,
  Typography,
  Box,
  TableCell,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  Checkbox,
  Select,
  MenuItem,
} from '@mui/material'
import { getExerciseImgUrl } from '../../../../../utils/utils'
import WorkoutExercisesTableToolbar from './WorkoutExercisesTableToolbar'
import WorkoutExercisesTableHead from '../WorkoutExercisesTableHead'
import { restDropdownItems } from './data'
import { Exercise } from '../../Exercises/Exercises'
import { SingleExercise } from '../../../../../types/workout'

const WorkoutExercisesTable = ({
  fields,
  exercises,
  onRemoveExercises,
}: // onSupersetClick,
IProps) => {
  const { register, control } = useFormContext<AddWorkoutFormData>()
  const [selected, setSelected] = useState<readonly string[]>([])

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = fields.map((field) => field.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const handleDeleteExercisesClick = () => {
    onRemoveExercises(selected)
    setSelected([])
  }

  return (
    <Box sx={{ width: 1 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <WorkoutExercisesTableToolbar
          numSelected={selected.length}
          onDeleteClick={handleDeleteExercisesClick}
          selected={selected}
          // onSupersetClick={onSupersetClick}
        />
        <TableContainer>
          <Table sx={{ width: 1 }} aria-labelledby='workout-exercises' size='medium'>
            <WorkoutExercisesTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={fields.length}
            />
            <TableBody>
              {fields.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`

                // if (row.type === 'single') {
                const exerciseData = exercises.find((e) => e.id === row.exerciseId)
                if (!exerciseData) return <></>
                const isItemSelected = isSelected(row.id)

                return (
                  <SingleExerciseRow
                    isItemSelected={isItemSelected}
                    row={row}
                    exerciseData={exerciseData}
                    labelId={labelId}
                    index={index}
                    handleClick={handleClick}
                    key={row.id}
                  />
                )
                // }

                // else if (row.type === 'superset') {
                //   return (
                //     <SupersetRow
                //       row={row}
                //       labelId={labelId}
                //       index={index}
                //       exercises={exercises}
                //       key={row.id}
                //     />
                //   )
                // }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default WorkoutExercisesTable

const smallTextFieldStyles = {
  '& .MuiInputBase-root': {
    height: 33,
    fontSize: 12,
  },
  '& .MuiOutlinedInput-input': { padding: '0 6px' },
}

const SingleExerciseRow = ({
  isItemSelected,
  row,
  handleClick,
  exerciseData,
  labelId,
  index,
}: {
  isItemSelected: boolean
  row: FieldArrayWithId<AddWorkoutFormData, 'workoutExercises', 'id'>
  handleClick(event: React.MouseEvent<unknown>, id: string): void
  exerciseData: Exercise
  labelId: string
  index: number
}) => {
  const { register, control } = useFormContext<AddWorkoutFormData>()

  return (
    <TableRow
      hover
      role='checkbox'
      aria-checked={isItemSelected}
      tabIndex={-1}
      selected={isItemSelected}
    >
      <TableCell padding='checkbox'>
        <Checkbox
          color='primary'
          checked={isItemSelected}
          inputProps={{
            'aria-labelledby': labelId,
          }}
          onClick={(event) => handleClick(event, row.id)}
        />
      </TableCell>
      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img style={{ width: '130px' }} src={getExerciseImgUrl(exerciseData)} alt='' />
        <Typography fontSize='14px' sx={{ ml: 2 }}>
          {exerciseData.name}
        </Typography>
      </TableCell>
      <TableCell align='right' sx={{ width: 50, p: 0.5 }}>
        <TextField
          {...register(`workoutExercises.${index}.sets` as any)}
          placeholder='Series'
          sx={smallTextFieldStyles}
        />
      </TableCell>
      <TableCell align='right' sx={{ width: 130, p: 1 }}>
        <TextField
          {...register(`workoutExercises.${index}.objective` as any)}
          placeholder='Reps/RIR/%RM'
          sx={smallTextFieldStyles}
        />
      </TableCell>
      <TableCell align='right' sx={{ width: 50, p: 1 }}>
        <Controller
          name={`workoutExercises.${index}.rest` as any}
          control={control}
          render={({ field }: { field: any }) => (
            <Select {...field} sx={{ w: 1, height: '33px', fontSize: '12px' }}>
              {restDropdownItems.map((item) => (
                <MenuItem value={item.value} key={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </TableCell>
    </TableRow>
  )
}

// const SupersetRow = ({
//   row,
//   labelId,
//   index,
//   exercises,
// }: {
//   row: Superset & Record<'id', string>
//   labelId: string
//   index: number
//   exercises: Exercise[]
// }) => {
//   const { register, control } = useFormContext<AddWorkoutFormData>()

//   const { fields, remove, append } = useFieldArray({
//     control,
//     name: `workoutExercises.${index}.exercises` as `workoutExercises.${number}.exercises`,
//   })

//   return (
//     <TableRow
//       hover
//       role='checkbox'
//       tabIndex={-1}
//       // aria-checked={isItemSelected}
//       // selected={isItemSelected}
//     >
//       <TableCell padding='checkbox' colSpan={5}>
//         <Box display={'flex'} alignItems={'center'} pb={2} pt={2}>
//           <Checkbox
//             color='primary'
//             // checked={isItemSelected}
//             inputProps={{
//               'aria-labelledby': labelId,
//             }}
//             onClick={
//               (event) => null
//               // handleClick(event, exerciseData.id)
//             }
//           />
//           <Typography variant='caption' fontSize='0.85rem'>
//             Super serie de
//             <TextField
//               sx={{
//                 ml: 1,
//                 mr: 1,
//                 '& .MuiInputBase-root': {
//                   height: 25,
//                   width: 35,
//                   fontSize: 12,
//                 },
//               }}
//             />
//             rondas
//           </Typography>
//         </Box>
//         {fields.map((ssExercise, ssExerciseIdx) => {
//           const exerciseData = exercises.find(
//             (e) => e.id === (ssExercise as SingleExercise).exerciseId,
//           )
//           if (!exerciseData) return <></>
//           // const isItemSelected = isSelected(exerciseData.id);
//           return (
//             <Box
//               pl={2}
//               position='relative'
//               display='flex'
//               alignItems='center'
//               pb={2}
//               pt={2}
//               justifyContent='space-between'
//               key={ssExercise.id}
//             >
//               <Box display='flex' alignItems='center'>
//                 <Checkbox
//                   color='primary'
//                   // checked={isItemSelected}
//                   inputProps={{
//                     'aria-labelledby': labelId,
//                   }}
//                   onClick={
//                     (event) => null
//                     // handleClick(event, exerciseData.id)
//                   }
//                 />
//                 <Box display='flex' alignItems='center' width='20%'>
//                   <img style={{ width: '100px' }} src={getExerciseImgUrl(exerciseData)} alt='' />
//                   <Typography fontSize='14px' sx={{ ml: 2 }}>
//                     {exerciseData.name}
//                   </Typography>
//                 </Box>
//               </Box>
//               <Box display='flex' alignItems='center' justifyContent='space-between' pr={1}>
//                 <Box width={130} sx={{ mr: 3 }}>
//                   <TextField
//                     placeholder='Reps/RIR/%RM'
//                     {...register(
//                       `workoutExercises.${index}.exercises.${ssExerciseIdx}.objective` as any,
//                     )}
//                     sx={smallTextFieldStyles}
//                     fullWidth
//                   />
//                 </Box>
//                 <Box width={90}>
//                   <Controller
//                     name={`workoutExercises.${index}.exercises.${ssExerciseIdx}.rest` as any}
//                     control={control}
//                     render={({ field }: { field: any }) => (
//                       <Select
//                         {...field}
//                         sx={{
//                           w: 1,
//                           height: '33px',
//                           fontSize: '12px',
//                         }}
//                         fullWidth
//                       >
//                         {restDropdownItems.map((item) => (
//                           <MenuItem value={item.value} key={item.value}>
//                             {item.label}
//                           </MenuItem>
//                         ))}
//                       </Select>
//                     )}
//                   />
//                 </Box>
//               </Box>
//             </Box>
//           )
//         })}
//       </TableCell>
//     </TableRow>
//   )
// }
