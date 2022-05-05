import React from 'react'
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';

type Pathname =
  | "/dashboard"
  | "/dashboard/"
  | "/dashboard/clients"
  | "/dashboard/clients/"
  | "/dashboard/workouts"
  | "/dashboard/workouts/"
  | "/dashboard/nutrition"
  | "/dashboard/nutrition/";

export const DashboardTabs = () => {

  const [value, setValue] = React.useState(0);
  const navigate = useNavigate()
  const location = useLocation();

  // This ensure that hardcoding a dashboard url path activates the correct Tab
  if (Object.keys(LOCATION_VALUES).find(path => path === location.pathname)) {
    const locationValue = LOCATION_VALUES[location.pathname as Pathname]
    if (locationValue !== value) {
      setValue(locationValue)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Tabs
      value={value}
      onChange={handleTabChange}
      sx={TabsStyles}
    >
      <Tab icon={<HomeIcon />} iconPosition="start" label="HOME" onClick={() => navigate('')} />
      <Tab icon={<PersonIcon />} iconPosition="start" label="CLIENTES" onClick={() => navigate('clients')} />
      <Tab icon={<FitnessCenterIcon />} iconPosition="start" label="RUTINAS" onClick={() => navigate('workouts')} />
      <Tab icon={<RestaurantIcon />} iconPosition="start" label="NUTRICIÓN" onClick={() => navigate('nutrition')} />
    </Tabs>
  )
}

const TabsStyles = {
  bgcolor: "#1976d2",
  height: 50,
  minHeight: 50,
  "& .MuiTab-root": { color: "white", width: 200, height: 50, minHeight: 50 },
  "& .MuiTabs-indicator": { height: 5, bgcolor: "#e7ca2c" },
  "& .MuiTab-root.Mui-selected": { color: '#e7ca2c' },
} 

const LOCATION_VALUES = {
  '/dashboard': 0,
  '/dashboard/': 0,
  '/dashboard/clients': 1,
  '/dashboard/clients/': 1,
  '/dashboard/workouts': 2,
  '/dashboard/workouts/': 2,
  '/dashboard/nutrition': 3,
  '/dashboard/nutrition/': 3,
}