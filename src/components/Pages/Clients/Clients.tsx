import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { AddClientDialog } from "./AddClientDialog";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { clientsRef } from "../../../firebase/fbRefs";
import { CenteredLayout } from "../../UI/CenteredLayout";
import { ClientsLayout } from "./ClientsLayout";

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
  } else if (clients && clients.length > 0) {
    content = <ClientsLayout openAddClientDialog={openAddClientDialog}/>
  } else {
    content = (
      <CenteredLayout>
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
      </CenteredLayout>
    );
  }

  return (
    <Box height={1}>
      {content}
      <AddClientDialog
        open={addClientDialogOpen}
        onClose={closeAddClientDialog}
      />
    </Box>
  );
};

export default Clients;
