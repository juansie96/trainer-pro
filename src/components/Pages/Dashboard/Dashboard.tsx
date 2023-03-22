import { Box } from '@mui/material'
import { signOut } from 'firebase/auth'
import { addDoc, getDocs } from 'firebase/firestore'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { getTrainerDataQueryRef, trainersRef } from '../../../firebase/fbRefs'
import { auth } from '../../../firebase/firebase'
import { selectTrainer, userLoggedIn } from '../../../redux/slices/Trainer.slice'
import { populateTestClients, testClients } from '../../../scripts/populateTestClientsScript'
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
      querySnapshot.forEach(async (doc) => {
        const trainerdb = doc.data()
        if (trainerdb) {
          dispatch(userLoggedIn({ ...trainerdb, id: doc.id }))
        } else {
          signOut(auth)
        }
      })
    } else {
      const { id } = await addDoc(trainersRef, {
        email: user.email,
        name: user.displayName,
        lastname: '',
      })
      const testTrainerClients = testClients.map((c) => ({ ...c, trainerId: id }))
      await populateTestClients(testTrainerClients)
      dispatch(
        userLoggedIn({
          id,
          email: user.email,
          name: user.displayName,
          lastname: '',
        }),
      )
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
  )
}
