import { Box } from "@mui/material";
import React, { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { CustomSnackbar } from "../../UI/CustomSnackbar";
import { DashboardTabs } from "./DashboardTabs";

export const Dashboard = () => {
  const userContext = useContext(UserContext);

  if (!userContext?.user && !userContext?.loading) {
    return <Navigate to="/login" />;
  }

  return (
    <Box className="dashboard" height={dashboardHeight}>
      <DashboardTabs />
      <Box className="dashboard-content" display='flex' flexDirection="column" height={dashboardContentHeight}>
        <Outlet />
      </Box>
    </Box>
    // <CustomSnackbar
    //   open={!!registerError}
    //   message={registerError}
    //   severity="error"
    //   onClose={onSnackbarClose}
    // />
  );
};

const dashboardHeight = "calc(100% - 64px)";
const dashboardContentHeight = "calc(100% - 50px)";
