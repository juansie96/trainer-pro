import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { query, where } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { metricsRef } from '../../../firebase/fbRefs'
import { selectClient } from '../../../redux/slices/Client.slice'
import { useAppSelector } from '../../../state/storeHooks'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { IMetrics } from '../../../types/metrics'
Chart.register(...registerables)

export const userMetricsQuery = (userId: string) => query(metricsRef, where('userId', '==', userId))

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
}

const getData = (metrics: IMetrics[]) => {
  const metricsSorted = metrics.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
  return {
    labels: metricsSorted.map((m) => m.date.split('T')[0]),
    datasets: [
      {
        label: 'Peso corporal',
        data: metricsSorted.map((m) => +m.values.weight),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Grasa corporal',
        data: metricsSorted.map((m) => +m.values.fat),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
}

const ClientEvolution = () => {
  const client = useAppSelector(selectClient)
  console.log(client)
  const [metrics, isMetricsLoading] = useCollectionData(userMetricsQuery(client?.id as string))
  console.log(metrics)

  return (
    <div>
      <Typography variant='h6' fontWeight={500}>
        Registro de métricas
      </Typography>
      <hr />
      <TableContainer component={Paper} sx={{ maxWidth: 'calc(100vw - 4em)' }}>
        <Table sx={{ minWidth: 650 }} aria-label='clients table'>
          <TableHead sx={{ bgcolor: '#1677d2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'white', width: 80 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Peso corporal (kg)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Grasa corporal (%)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Cuello (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Hombros (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Pecho (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Biceps (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Antebrazo (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Cintura (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Cadera (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Muslo (cm)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'white' }}>Gemelo (cm)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics &&
              metrics
                .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
                .map((metric) => (
                  <TableRow
                    key={metric.id}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{}}>{metric.date.slice(0, 10)}</TableCell>
                    <TableCell sx={{}}>{metric.values.weight}</TableCell>
                    <TableCell sx={{}}>{metric.values.fat}</TableCell>
                    <TableCell sx={{}}>{metric.values.neck}</TableCell>
                    <TableCell sx={{}}>{metric.values.shoulders}</TableCell>
                    <TableCell sx={{}}>{metric.values.chest}</TableCell>
                    <TableCell sx={{}}>{metric.values.biceps}</TableCell>
                    <TableCell sx={{}}>{metric.values.forearm}</TableCell>
                    <TableCell sx={{}}>{metric.values.hip}</TableCell>
                    <TableCell sx={{}}>{metric.values.waist}</TableCell>
                    <TableCell sx={{}}>{metric.values.thigh}</TableCell>
                    <TableCell sx={{}}>{metric.values.calf}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant='h6' fontWeight={500} sx={{ mt: 7 }}>
        Gráfico de evolución peso y grasa corporal
      </Typography>
      <hr />
      {metrics && <Line data={getData(metrics)} style={{ maxHeight: 700 }} />}
    </div>
  )
}

export default ClientEvolution
