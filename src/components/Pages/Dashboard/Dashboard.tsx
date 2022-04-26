import { Box } from "@mui/material";
import React, { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { CustomSnackbar } from "../../UI/CustomSnackbar";
import { DashboardTabs } from "./DashboardTabs";

export const Dashboard = () => {
  const user = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Box className="dashboard" height={dashboardHeight}>
      <DashboardTabs />
      <Box className="dashboard-content" height={dashboardContentHeight}>
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
const dashboardContentHeight = "calc(100% - 72px)";
