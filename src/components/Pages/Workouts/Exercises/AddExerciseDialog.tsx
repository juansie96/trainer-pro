import React, { ChangeEvent, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import FormContainer from "../../../Form/FormContainer";
import { useForm } from "react-hook-form";
import { addDoc, WithFieldValue } from "firebase/firestore";
import { exercisesRef } from "../../../../firebase/fbRefs";
import { Exercise } from "./Exercises";
import { Box } from "@mui/system";
import TextFieldElement from "../../../Form/TextFieldElement";
import RadioButtonGroup from "../../../Form/RadioButtonGroup";

interface AddExerciseDialogProps {
  open: boolean;
  onClose(): void;
}

export interface AddExerciseFormData {
  name: string;
  description: string;
  videoUrl?: string;
  imgUrl?: string;
  tags: string[] | null
}

type MediaType = "video" | "image" | "none";

const AddExerciseDialog = ({ open, onClose }: AddExerciseDialogProps) => {
  const formContext = useForm<AddExerciseFormData>();
  const {name} = formContext.getValues();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<MediaType>("video");
  let selectMediaTypeContent;

  const onSubmit = async (newExercise: AddExerciseFormData) => {
    setIsAdding(true);
    try {
      await addDoc(exercisesRef, {
        ...newExercise,
        videoUrl: "",
        imgUrl: "",
        description: "",
        tags: null,
      } as WithFieldValue<Exercise>);
      setIsAdding(false);
      onClose();
    } catch (err: any) {
      setIsAdding(false);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMediaType(e.target.value as MediaType);
  };

  if (mediaType === "video") {
    selectMediaTypeContent = (
      <Box
        mt={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width={1}
      >
        <TextFieldElement
          name="videoUrl"
          label="URL del video"
          validation={{ required: "El nombre es requerido" }}
          size="small"
          fullWidth={true}
        />
        <iframe
          style={{ marginTop: "16px" }}
          width="560"
          height="315"
          src="https://www.youtube.com/embed/JwBf_9M1S7k"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        ></iframe>
      </Box>
    );
  } else if (mediaType === "image") {
    selectMediaTypeContent = (
      <Box>
        <Box></Box>
        <Box></Box>
        <Box></Box>
      </Box>
    );
  } else if (mediaType === "none") {
    selectMediaTypeContent = <></>;
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
          FormProps={{
            style: { height: "100%", display: "flex", flexDirection: "column" },
          }}
        >
          <Box borderBottom="1px solid #e3e3e3">
            <DialogTitle>Crear Ejercicio</DialogTitle>
          </Box>
          <DialogContent sx={{ pt: 3, pb: 4 }}>
            <DialogContentText>
              Completa los datos de tu nuevo ejercicio
            </DialogContentText>

            <Stack
              width={1}
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              mt={2}
              sx={{ width: 1 }}
            >
              <TextFieldElement
                name="name"
                label="Nombre"
                validation={{ required: "El nombre es requerido" }}
                size="small"
                fullWidth={true}
              />
              {/* <Typography>¿Quieres añadir contenido gráfico?</Typography> */}
              <FormControl sx={{ mt: 2 }}>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  ¿Quieres añadir contenido gráfico?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={mediaType}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="video"
                    control={<Radio />}
                    label="Video de Youtube"
                  />
                  <FormControlLabel
                    value="image"
                    control={<Radio />}
                    label="Imagen"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="Sin video ni imagen"
                  />
                </RadioGroup>
              </FormControl>
              {selectMediaTypeContent}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e3e3e3" }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isAdding}>
              {isAdding ? "Creando Ejercicio" : "Crear Ejercicio"}
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  );
};

export default AddExerciseDialog;
