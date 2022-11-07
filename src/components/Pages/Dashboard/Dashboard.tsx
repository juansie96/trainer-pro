import { Box } from '@mui/material'
import { signOut } from 'firebase/auth'
import { getDocs } from 'firebase/firestore'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getTrainerDataQueryRef } from '../../../firebase/fbRefs'
import { auth } from '../../../firebase/firebase'
import { selectTrainer, userLoggedIn } from '../../../redux/slices/trainerSlice'
import { useAppSelector } from '../../../state/storeHooks'
import { DashboardTabs } from './DashboardTabs'

export const Dashboard = () => {
  const [user, loading] = useAuthState(auth)
  const trainer = useAppSelector(selectTrainer)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && !loading && !user.emailVerified) {
      navigate('/verification')
    }
    if (user && !trainer.id) {
      getTrainerData()
    } else if (!user && !loading) {
      navigate('/login')
    }
  }, [user, loading])

  async function getTrainerData() {
    const querySnapshot = await getDocs(getTrainerDataQueryRef(user?.email as string))
    const userExists = querySnapshot.size > 0
    if (userExists) {
      querySnapshot.forEach((doc) => {
        const trainerdb = doc.data()
        if (trainerdb) {
          dispatch(userLoggedIn({ ...trainerdb, id: doc.id }))
        } else {
          console.log('here, of course')
          signOut(auth)
        }
      })
    } else {
      console.log('here, of very course')
      signOut(auth)
    }
  }

  return (
    <Box className='dashboard'>
      <DashboardTabs />
      <Box
        className='dashboard-content'
        display='flex'
        flexDirection='column'
        height={'calc(100vh - 114px)'}
        sx={{ overflowY: 'scroll' }}
      >
        <Outlet />
      </Box>
    </Box>
    // <CustomSnackbar
    //   open={!!registerError}
    //   message={registerError}
    //   severity="error"
    //   onClose={onSnackbarClose}
    // />
  )
}
