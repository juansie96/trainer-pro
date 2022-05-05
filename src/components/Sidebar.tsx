import { Box, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Sidebar: React.FC = ({ children }) => (
  <Box
    sx={sidebarStyles}
    style={{ position: "absolute" }}
    className="client-sidebar"
  >
    {children}
  </Box>
);

export const MenuItem: React.FC<{ active: boolean; onClick(): void }> = ({
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
  height: "calc(100% - 64px - 50px)",
};

export default Sidebar;
