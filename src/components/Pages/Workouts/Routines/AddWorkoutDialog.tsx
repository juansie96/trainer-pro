import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, WithFieldValue } from "firebase/firestore";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { workoutsRef } from "../../../../firebase/fbRefs";
import FormContainer from "../../../Form/FormContainer";
import TextFieldElement from "../../../Form/TextFieldElement";
import { Workout } from "./Routines";

interface AddWorkoutDialogProps {
  open: boolean;
  onClose(): void;
}

export interface AddWorkoutFormData {
  name: string;
}

const AddWorkoutDialog = ({ open, onClose }: AddWorkoutDialogProps) => {
  const formContext = useForm<AddWorkoutFormData>();

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const onSubmit = async (newWorkout: AddWorkoutFormData) => {
    setIsAdding(true);
    try {
      await addDoc(workoutsRef, newWorkout as WithFieldValue<Workout>);
      setIsAdding(false);
      onClose();
    } catch (err: any) {
      setIsAdding(false);
    }
  };

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
            >
              <TextFieldElement
                name="name"
                label="Nombre"
                validation={{ required: "El nombre es requerido" }}
                sx={{ width: 0.475 }}
                size="small"
              />
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
