import { ArrowRight } from '@mui/icons-material';
import { Box, Card, Typography } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';

export const Error = ({ errorMessage }: { errorMessage: string }) => (
  <Box sx={{ display: 'flex' }}>
    <ArrowRight />
    <Typography variant="body1">{errorMessage}</Typography>
  </Box>
);

export const FormErrors = ({ errors }: { errors: string[] }): React.ReactElement => {
  if (errors.length) {
    return <Card sx={errorContainerStyle}>
      {errors.map((errorMsg: string) => (
        <Error errorMessage={errorMsg} key={nanoid(4)} />
      ))}
    </Card>;
  } else {
    return <></>;
  }
};

const errorContainerStyle = {
  my: 3,
  p: 2,
  bgcolor: 'error.main',
  color: 'error.contrastText',
};
