import { Typography } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InfoIcon from '@mui/icons-material/Info';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar, { MenuItem } from "../../Sidebar";

const WorkoutSidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const {clientId} = useParams();
  
  return (
    <Sidebar>
      <MenuItem
        active={location.pathname.includes("planification")}
        onClick={() => navigate(`/dashboard/client/${clientId}/planification`)}
      >
        <EventNoteIcon sx={{ p: 1 }} />
        <Typography>Rutinas</Typography>
      </MenuItem>
      <MenuItem
        active={location.pathname.includes("information")}
        onClick={() => navigate(`/dashboard/client/${clientId}/information`)}
      >
        <InfoIcon sx={{ p: 1 }} />
        <Typography>Ejercicios</Typography>
      </MenuItem>
    </Sidebar>
  );
};


export default WorkoutSidebar;
