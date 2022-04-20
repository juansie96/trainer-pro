import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import FormContainer from "../../Form/FormContainer";
import TextFieldElement from "../../Form/TextFieldElement";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { selectLoggedInUser } from "../../App/App.slice";
import { useAppSelector } from "../../../state/storeHooks";
import { UserData } from "../../../types/user";
import { useSaveClientMutation } from "./Clients.api";

export interface AddClientFormData {
  name: string;
  lastname: string;
  email: string;
  age: number;
}

interface AddClientDialogProps {
  onClose(): void;
  open: boolean;
}

export function AddClientDialog({ open, onClose }: AddClientDialogProps) {

  const loggedInUser = useAppSelector(selectLoggedInUser) as UserData;  
  const [addClient, othershit] = useSaveClientMutation()

  const formContext = useForm<AddClientFormData>();
  
  const onSubmit = async (newClient: AddClientFormData) => {
    addClient({newClient, loggedInUser})
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
        >
          <Box borderBottom="1px solid #e3e3e3">
            <DialogTitle>Agregar Cliente</DialogTitle>
          </Box>
          <DialogContent sx={{ pt: 3, pb: 4 }}>
            <DialogContentText>
              Completa los datos de tu nuevo cliente
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
              <TextFieldElement
                name="lastname"
                label="Apellido"
                validation={{ required: "El apellido es requerido" }}
                sx={{ width: 0.475 }}
                size="small"
              />
              <TextFieldElement
                name="email"
                label="Email"
                type="email"
                sx={{ width: 0.475, mt: 2 }}
                validation={{ required: "El email es requerido" }}
                size="small"
              />
              <TextFieldElement
                name="age"
                label="Edad"
                type="number"
                validation={{ required: "La edad es requerida" }}
                sx={{ width: 0.475, mt: 2 }}
                size="small"
                customOnChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  formContext.setValue("age", parseInt(e.target.value))
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e3e3e3" }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Agregar Cliente
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  );
}
