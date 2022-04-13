import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Input } from "../../Form/Input";
import { Controller, useForm } from "react-hook-form";
import FormContainer from "../../Form/FormContainer";
import TextFieldElement from "../../Form/TextFieldElement";
import { Stack } from "@mui/material";

interface AddClientFormData {
  name: string;
  lastname: string;
  email: string;
  age: number;
}

export function AddClientDialog() {
  const [open, setOpen] = React.useState(true);
  const formContext = useForm<AddClientFormData>();
  const [addingClient, setAddingClient] = React.useState(false);

  const onSubmit = async (newClient: AddClientFormData) => {
    console.log(newClient);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <FormContainer
          formContext={formContext}
          handleSubmit={formContext.handleSubmit(onSubmit)}
        >
          <DialogTitle>Agregar Cliente</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Completa los datos de tu nuevo cliente
            </DialogContentText>

            <Stack
              width={1}
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              mt={1}
            >
              <TextFieldElement
                name="name"
                label="Nombre"
                validation={{ required: "El nombre es requerido" }}
                sx={{ width: 0.475 }}
              />
              <TextFieldElement
                name="lastname"
                label="Apellido"
                validation={{ required: "El apellido es requerido" }}
                sx={{ width: 0.475 }}
              />
              <TextFieldElement
                name="email"
                label="Email"
                type="email"
                validation={{ required: "El email es requerido" }}
                sx={{ width: 0.475, mt: 1 }}
              />
              <TextFieldElement
                name="age"
                label="Edad"
                type="number"
                validation={{ required: "La edad es requerida" }}
                sx={{ width: 0.475, mt: 1 }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleClose}>
              Subscribe
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
    </div>
  );
}
