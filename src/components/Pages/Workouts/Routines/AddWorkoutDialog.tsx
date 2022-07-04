import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system"
import { addDoc, WithFieldValue } from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useFieldArray, useForm } from "react-hook-form";
import { exercisesRef, workoutsRef } from "../../../../firebase/fbRefs";
import FormContainer from "../../../Form/FormContainer";
import TextFieldElement from "../../../Form/TextFieldElement";
import EnhancedTable from "./EnhancedWorkoutExercisesTable";

export interface WorkoutExercise {
  id: string;
  sets?: number;
  rpe?: number;
  rest?: number;
  rmPercentage?: number;
}

interface AddWorkoutDialogProps {
  open: boolean;
  onClose(): void;
}

export interface AddWorkoutFormData {
  name: string;
  workoutExercises: WorkoutExercise[];
}

const AddWorkoutDialog = ({ open, onClose }: AddWorkoutDialogProps) => {
  const [exercises, loading, error] = useCollectionData(exercisesRef);
  const formContext = useForm<AddWorkoutFormData>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: formContext.control,
      name: "workoutExercises", // unique name for your Field Array
    }
  );

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const onSubmit = async (newWorkout: AddWorkoutFormData) => {
    console.log("newWorkout", newWorkout);
    const finalWorkoutExercises = newWorkout.workoutExercises.map((e, idx) => {
      return {
        ...e,
        id: fields[idx].id
      }
    });

    setIsAdding(true);
    // try {
    //   await addDoc(workoutsRef, newWorkout as WithFieldValue<Workout>);
    //   setIsAdding(false);
    //   onClose();
    // } catch (err: any) {
    //   setIsAdding(false);
    // }
  };

  const LeftSideContent = () => {
    console.log('rendering brodacho')
    return (
      <Box width={0.55}>
        <TextFieldElement
          name="name"
          label="Nombre"
          validation={{ required: "El nombre es requerido" }}
          size="small"
          fullWidth
        />
        <TextFieldElement
          name="description"
          label="Descripción"
          validation={{ required: "La descripción es requerida" }}
          size="small"
          fullWidth
          multiline
          rows={3}
          sx={{ my: 2 }}
        />
        {exercises ? (
          <EnhancedTable fields={fields} exercises={exercises} />
        ) : (
          <p>Cargando tabla</p>
        )}
      </Box>
    );
  }
  

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { maxWidth: 0.95, width: 0.95, height: 0.95 } }}
      >
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
          FormProps={{
            style: { height: "100%", display: "flex", flexDirection: "column" },
          }}
        >
          <Box borderBottom="1px solid #e3e3e3">
            <DialogTitle>Agregar Rutina</DialogTitle>
          </Box>
          <DialogContent sx={{ pt: 3, pb: 4 }}>
            <DialogContentText>
              Completa los datos de tu nuevo rutina
            </DialogContentText>

            <Stack
              width={1}
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              mt={2}
              position='relative'
            >
              <LeftSideContent/>
              <Box width={'1px'} bgcolor='#b1aeae71' >
                
              </Box>
              <Box width={0.4}>
                <DialogContentText sx={{mb: 1}}>
                  Selecciona los ejercicios de tu nueva rutina
                </DialogContentText>
                <TextField name="" fullWidth size="small" label='Busca ejercicios por nombre'/>
                {exercises?.map((e) => {
                  return (
                    <p
                      key={e.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        append({ id: e.id });
                      }}
                    >
                      {e.name}
                    </p>
                  );
                })}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e3e3e3" }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isAdding}>
              {isAdding ? "Agregando Rutina" : "Agregar Rutina"}
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  );
};

export default AddWorkoutDialog;
