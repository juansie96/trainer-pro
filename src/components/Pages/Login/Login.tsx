import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Button, LinearProgress } from "@mui/material";
import { MainContainer } from "../../MainContainer/MainContainer";
import { CustomSnackbar } from "../../UI/CustomSnackbar";
import { mapFirebaseErrorCodeToMsg } from "../../../firebase/helperFunctions";
import FormContainer from "../../Form/FormContainer";
import TextFieldElement from "../../Form/TextFieldElement";
import { auth } from "../../../firebase/firebase";
import { UserContext } from "../../../contexts/UserContext";
import { AuthError, signInWithEmailAndPassword } from "firebase/auth";

type RegisterFormValues = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const user = useContext(UserContext);

  const formContext = useForm<RegisterFormValues>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<any>("");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <MainContainer sx={{ mt: 4 }} maxWidth="xs">
      {/* <FormErrors errors={formErrors} /> */}
      <FormContainer
        formContext={formContext}
        handleSubmit={formContext.handleSubmit(loginUser)}
      >
        <TextFieldElement
          sx={{ mb: 2 }}
          fullWidth
          label="Email"
          name="email"
          type="email"
          validation={{ required: "El email es requerido" }}
        />
        <TextFieldElement
          sx={{ mb: 2 }}
          fullWidth
          label="Password"
          name="password"
          type="password"
          validation={{ required: "La contraseña es requerida" }}
        />
        <Button variant="contained" type="submit" fullWidth disabled={loading}>
          {loading ? "INICIANDO SESIÓN" : "INICIAR SESIÓN"}
        </Button>
      </FormContainer>
      <>{loading && <LinearProgress sx={{ my: 3 }} />}</>
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
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = err as AuthError;
      setLoginError(mapFirebaseErrorCodeToMsg(error.code));
      formContext.setValue("password", "");
    }
  }
};
