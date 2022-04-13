import { Alert, AlertProps, Snackbar, SnackbarProps } from '@mui/material'

export const CustomSnackbar = (props: SnackbarProps & AlertProps) => {
  return (
    <Snackbar
        open={props.open}
        // message={registerError ? ERROR_MESSAGES[registerError] : ""}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        onClose={props.onClose}
        autoHideDuration={5000}
      >
        <Alert
          onClose={props.onClose}
          severity={props.severity}
          variant="filled"
          elevation={6}
          sx={{ width: "100%" }}
        >
          {props.message}
        </Alert>
      </Snackbar>
  )
}
