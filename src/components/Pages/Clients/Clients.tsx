import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { AddClientDialog } from "./AddClientDialog";
import ClientsTable from "./ClientsTable";

const Clients = () => {
  let content;

  const [clients, setClients] = useState(null); // Replace later with useSelector

  const [addClientDialogOpen, setAddClientDialogOpen] =
    useState<boolean>(false);

  const handleClickOpen = () => {
    setAddClientDialogOpen(true);
  };

  const handleClose = () => {
    setAddClientDialogOpen(false);
  };

  if (clients) {
    content = <ClientsTable />;
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
          onClick={handleClickOpen}
        >
          Crea uno nuevo
        </Typography>
      </Box>
    );
  }

  return (
    <Box height={1}>
      {content}
      <AddClientDialog open={addClientDialogOpen} onClose={handleClose} />
    </Box>
  );
};

export default Clients;