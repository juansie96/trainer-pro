export function mapFirebaseErrorCodeToMsg(errorCode: string): string {
  switch(errorCode) {
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'El nombre de usuario o contraseña es incorrecto'
    case 'auth/email-already-in-use':
      return 'El email ingresado ya se encuentra registrado en el sistema'
    default: return 'Ocurrió un error inesperado, por favor intente nuevamente'
  }
}