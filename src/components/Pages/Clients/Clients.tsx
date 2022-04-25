import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { AddClientDialog } from "./AddClientDialog";
import ClientsTable from "./ClientsTable";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { clientsRef } from "../../../firebase/fbRefs";

export interface Client {
  name: string;
  lastname: string;
  email: string;
  age: number;
  id: string;
  trainerId: string;
  ref: DocumentReference<DocumentData>;
}

const Clients = () => {
  let content;

  const [clients, loading, error] = useCollectionData(clientsRef);

  console.log("clients", clients);
  console.log("loading", loading);
  console.log("error", error);

  const [addClientDialogOpen, setAddClientDialogOpen] =
    useState<boolean>(false);

  const openAddClientDialog = () => {
    setAddClientDialogOpen(true);
  };

  const closeAddClientDialog = () => {
    setAddClientDialogOpen(false);
  };

  if (loading) {
    content = <p>Cargando..</p>;
  } else if (clients?.length) {
    content = <ClientsTable clients={clients} onAddClient={openAddClientDialog} />;
  } else {
    content = (
      <Box
        display="flex"
        flexDirection="column"
        height={1}
        textAlign="center"
        justifyContent="center"
      >
        <Typography variant="h5">Todavía no tienes ningún cliente</Typography>
        <Typography
          fontSize={20}
          variant="subtitle1"
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={openAddClientDialog}
        >
          Crea uno nuevo
        </Typography>
      </Box>
    );
  }

  return (
    <Box height={1}>
      {content}
      <AddClientDialog open={addClientDialogOpen} onClose={closeAddClientDialog} />
    </Box>
  );
};

export default Clients;
