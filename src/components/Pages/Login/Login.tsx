import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  LinearProgress,
} from "@mui/material";

import { MainContainer } from "../../MainContainer/MainContainer";
import { Input } from "../../Form/Input";
import { FormErrors } from "../../UI/Errors";
import { CustomSnackbar } from "../../UI/CustomSnackbar";

import { validEmailRegex } from "../../../constants/constants";
import { useAppDispatch, useAppSelector } from "../../../state/storeHooks";
import { loadUserIntoApp, selectLoggedInUser } from "../../App/App.slice";
import { signInUserFB } from "./LoginAPI";
import { mapFirebaseErrorCodeToMsg } from "../../../firebase/helperFunctions";
import FormContainer from '../../Form/FormContainer'
import TextFieldElement from "../../Form/TextFieldElement";

type RegisterFormValues = {
  email: string;
  password: string;
};

export const Login: React.FC<any> = () => {

  const user = useAppSelector(selectLoggedInUser);
  const dispatch = useAppDispatch();
  const [signingUp, setSigningUp] = useState(false);
  const [loginError, setLoginError] = useState<any>("");

  const formContext = useForm<RegisterFormValues>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    }
  });

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainContainer sx={{mt: 4}} maxWidth="xs">
      {/* <FormErrors errors={formErrors} /> */}
      <FormContainer formContext={formContext} handleSubmit={formContext.handleSubmit(loginUser)} >
        <TextFieldElement sx={{mb: 2}} fullWidth label='Email' name='email' type='email' validation={{required: 'El email es requerido'}} />
        <TextFieldElement sx={{mb: 2}} fullWidth label='Password' name='password' type='password' validation={{required: 'La contraseña es requerida'}} />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={signingUp}
        >
          {signingUp ? "INICIANDO SESIÓN" : "INICIAR SESIÓN"}
        </Button>
      </FormContainer>
      <>{signingUp && <LinearProgress sx={{ my: 3 }} />}</>
      <CustomSnackbar
        open={!!loginError}
        message={loginError}
        severity="error"
        onClose={onSnackbarClose}
      />
    </MainContainer>
  );

  function onSnackbarClose() {
    setLoginError("");
  }

  async function loginUser(user: RegisterFormValues) {
    try {
      setSigningUp(true);
      const response = await signInUserFB(user.email, user.password);
      setSigningUp(false);
      dispatch(loadUserIntoApp(response))
      setLoginError("");
    } catch (err: any) {
      setSigningUp(false);
      setLoginError(mapFirebaseErrorCodeToMsg(err.code));
      formContext.setValue("password", "")
    }
  }
};