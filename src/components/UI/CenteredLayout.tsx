import { Box } from '@mui/material';
import React from 'react';

export const CenteredLayout: React.FC = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height={1}
      textAlign="center"
      justifyContent="center"
    >
      {children}
    </Box>
  );
};
