import { Box, Typography } from "@mui/material";
import React from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InfoIcon from '@mui/icons-material/Info';
import { useLocation } from "react-router-dom";

const ClientSidebar = () => {

  let active = true;
  const location = useLocation();

  
  return (
    <Box sx={sidebarStyles} style={{position: 'absolute'}} className='client-sidebar'>
      <MenuItem active={location.pathname.includes('planification')}>
        <EventNoteIcon sx={{ p: 1 }} />
        <Typography>Planificación</Typography>
      </MenuItem>
      <MenuItem active={location.pathname.includes('information')}>
        <InfoIcon sx={{ p: 1 }} />
        <Typography>Información</Typography>
      </MenuItem>
    </Box>
  );
};

const MenuItem: React.FC<{ active: boolean }> = ({ children, active }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="90px"
      justifyContent="center"
      bgcolor={active ? '#b49a11' : 'inherit'}
      sx={{cursor: 'pointer'}}
    >
      {children}
    </Box>
  );
};

const sidebarStyles = {
  flex: 1,
  width: 150,
  background: "#1976d2",
  boxShadow: "0px 3px 6px 4px rgb(0 0 0 / 20%)",
  color: "white",
  height: 'calc(100% - 64px - 72px)'
};

export default ClientSidebar;
