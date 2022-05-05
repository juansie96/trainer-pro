import { Box, Typography } from "@mui/material";
import React from "react";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InfoIcon from '@mui/icons-material/Info';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ClientSidebar = () => {

  let active = true;
  const location = useLocation();
  const navigate = useNavigate();
  const {clientId} = useParams();
  console.log('clientId', clientId)
  
  return (
    <Box
      sx={sidebarStyles}
      style={{ position: "absolute" }}
      className="client-sidebar"
    >
      <MenuItem
        active={location.pathname.includes("planification")}
        onClick={() => navigate(`/dashboard/client/${clientId}/planification`)}
      >
        <EventNoteIcon sx={{ p: 1 }} />
        <Typography>Planificación</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes("information")}
        onClick={() => navigate(`/dashboard/client/${clientId}/information`)}
      >
        <InfoIcon sx={{ p: 1 }} />
        <Typography>Información</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes("nutrition")}
        onClick={() => navigate(`/dashboard/client/${clientId}/nutrition`)}
      >
        <RestaurantIcon sx={{ p: 1 }} />
        <Typography>Nutrición</Typography>
      </MenuItem>
    </Box>
  );
};

const MenuItem: React.FC<{ active: boolean; onClick(): void }> = ({
  children,
  active,
  onClick,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="90px"
      justifyContent="center"
      bgcolor={active ? "#b49a11" : "inherit"}
      sx={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

const sidebarStyles = {
  flex: 1,
  width: 110,
  background: "#1976d2",
  boxShadow: "0px 3px 6px 4px rgb(0 0 0 / 20%)",
  color: "white",
  height: 'calc(100% - 64px - 50px)'
};

export default ClientSidebar;
