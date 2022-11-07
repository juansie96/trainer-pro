import { Header } from '../Header/Header'
import { UserProvider } from '../../contexts/UserContext'
import AppRoutes from './AppRoutes'
import { useLocation } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebase'
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
// import { useAppSelector } from '../../state/storeHooks'
// import { selectTrainer } from '../../redux/slices/trainerSlice'

function App() {
  const [user] = useAuthState(auth)
  console.log('user', user)
  // const trainer = useAppSelector(selectTrainer)

  // Confirm the link is a sign-in with email link.
  if (isSignInWithEmailLink(auth, window.location.href)) {
    console.log('here')
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation')
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email as string, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn')
        // You can access the new user via result.user
        // Additional user info profile not available via:
        console.log('result.user', result.user)
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      })
  } else {
    console.log('else')
  }

  // fetchSignInMethodsForEmail(auth, email)
  //   .then((signInMethods) => {
  //     // This returns the same array as fetchProvidersForEmail but for email
  //     // provider identified by 'password' string, signInMethods would contain 2
  //     // different strings:
  //     // 'emailLink' if the user previously signed in with an email/link
  //     // 'password' if the user has a password.
  //     // A user could have both.
  //     if (signInMethods.indexOf(EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
  //       // User can sign in with email/password.
  //     }
  //     if (signInMethods.indexOf(EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
  //       // User can sign in with email/link.
  //     }
  //   })
  //   .catch((error) => {
  //     // Some error occurred, you can inspect the code: error.code
  //   })

  return (
    <UserProvider>
      {!useLocation().pathname.includes('/client-activation') && <Header />}
      <AppRoutes />
    </UserProvider>
  )
}

export default App
