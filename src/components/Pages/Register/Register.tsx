import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, LinearProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { registerUserFB } from "./RegisterAPI";
import { Input } from "../../Form/Input";
import { MainContainer } from "../../MainContainer/MainContainer";
import { FormErrors } from "../../UI/Errors";
import { CustomSnackbar } from "../../UI/CustomSnackbar";

import { useAppDispatch, useAppSelector } from "../../../state/storeHooks";
import { loadUserIntoApp, selectLoggedInUser } from "../../App/App.slice";
import { validEmailRegex, validPwRegex } from "../../../constants/constants";
import { mapFirebaseErrorCodeToMsg } from "../../../firebase/helperFunctions";

type RegisterFormValues = {
  Email: string;
  Contraseña: string;
};

export const Register = () => {
  const user = useAppSelector(selectLoggedInUser);
  const dispatch = useAppDispatch();

  const [signingUp, setSigningUp] = useState(false);
  const [registerError, setRegisterError] = useState<any>("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: "onBlur",
    defaultValues: {
      Email: "",
      Contraseña: "",
    },
    resolver: yupResolver(schema),
  });

  const formErrors: string[] = Object.values(errors)
    .filter((e) => typeof e !== "undefined")
    .map((e) => e!.message!);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainContainer maxWidth="xs">
      <FormErrors errors={formErrors} />
      <>{signingUp && <LinearProgress sx={{ my: 3 }} />}</>
      <form onSubmit={handleSubmit(onSignUp)}>
        {/* <Box my={2}>
          <Controller
            control={control}
            name="Email"
            render={(control) => <Input control={control} type="email" />}
          />
        </Box>
        <Box my={2}>
          <Controller
            control={control}
            name="Contraseña"
            render={(control) => <Input control={control} type="password" />}
          />
        </Box> */}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={signingUp}
        >
          {signingUp ? "Creando cuenta" : "Registrarse"}
        </Button>
      </form>

      <CustomSnackbar
        open={!!registerError}
        message={registerError}
        severity="error"
        onClose={onSnackbarClose}
      />
    </MainContainer>
  );

  function onSnackbarClose() {
    setRegisterError("");
  }

  async function onSignUp(user: RegisterFormValues) {
    try {
      setSigningUp(true);
      const response = await registerUserFB(user.Email, user.Contraseña);
      setSigningUp(false);
      setRegisterError("");
      dispatch(loadUserIntoApp(response));
    } catch (err: any) {
      setSigningUp(false);
      setRegisterError(mapFirebaseErrorCodeToMsg(err.code));
    }
  }
};

const schema = yup.object().shape({
  Email: yup
    .string()
    .required("El email es requerido")
    .matches(validEmailRegex, "El email ingresado no es correcto"),
  Contraseña: yup
    .string()
    .required("La contraseña es requerida")
    // .matches(
    //   validPwRegex,
    //   "La contraseña debe contener como mínimo una letra en mayúscula, otra en minúscula, un número y como mínimo debe tener 6 carácteres"
    // ),
});