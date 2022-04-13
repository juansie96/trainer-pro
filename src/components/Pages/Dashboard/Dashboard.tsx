import { Box } from "@mui/material";
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { CustomSnackbar } from "../../UI/CustomSnackbar";
import { DashboardTabs } from "./DashboardTabs";

export const Dashboard = () => {
  return (
    <Box className='dashboard' height={dashboardHeight}>
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

const dashboardHeight = 'calc(100% - 64px)'
const dashboardContentHeight = 'calc(100% - 72px)'
