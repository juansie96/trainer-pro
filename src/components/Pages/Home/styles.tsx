import { Card, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import colors from '../../../theme/colors'
import { ClientTask } from './types'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { getFormattedDate } from './utils'

export const HomeContainer = ({ children }: { children: ReactNode }) => (
  <Stack p={3} flexWrap='wrap' spacing={5}>
    {children}
  </Stack>
)

export const HomeRow = ({ children }: { children: ReactNode }) => (
  <Stack direction='row' width={1} height={350} spacing={7}>
    {children}
  </Stack>
)

export const HomeCard = ({ children }: { children: ReactNode }) => (
  <Card
    elevation={4}
    sx={{
      height: 1,
      width: 700,
      boxSizing: 'border-box',
      overflow: 'scroll',
      overflowX: 'hidden',
    }}
  >
    <Stack divider={<Divider orientation='horizontal' flexItem />} position='relative'>
      {children}
    </Stack>
  </Card>
)

export const HomeCardSection = ({
  children,
  title,
  showSpinner,
}: {
  children?: ReactNode
  title: string
  showSpinner: boolean
}) => (
  <Stack spacing={1}>
    <Typography fontWeight={700} color={colors.textGray} letterSpacing={0.5}>
      {title}
    </Typography>
    <HomeCard>{showSpinner ? <Spinner /> : children}</HomeCard>
  </Stack>
)

export const EmptyCardMessage = ({ msg }: { msg: string }) => (
  <Typography fontStyle='italic' color={colors.textGraySecondary} p={2}>
    {msg}
  </Typography>
)

export const ClientRow = ({ fullname, onClick }: { fullname: string; onClick(): void }) => (
  <Stack
    direction='row'
    alignItems='center'
    spacing={1.5}
    py={1}
    px={2}
    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#ddd' } }}
    onClick={onClick}
  >
    <img src='images/person-icon.png' height={38} width={38} />
    <Typography fontWeight={700} color={colors.textGray} letterSpacing={0.3} variant='button'>
      {fullname}
    </Typography>
  </Stack>
)

export const ClientTaskRow = ({ data, onClick }: { data: ClientTask; onClick(): void }) => (
  <Stack
    direction='row'
    alignItems='center'
    spacing={1.5}
    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#ddd' } }}
    py={1}
    px={2}
    onClick={onClick}
  >
    <img src='images/person-icon.png' height={38} width={38} />

    <Stack spacing={0.5} flex={1}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' width={1}>
        <Typography
          fontWeight={700}
          color={colors.textGray}
          letterSpacing={0.3}
          variant='button'
          fontSize={14}
        >
          {data.clientName}
        </Typography>
        <Stack direction='row' color={colors.textGray} spacing={1} alignItems='center'>
          <AccessTimeIcon fontSize='small' />
          <Typography fontStyle='italic' fontWeight={700} fontSize={12}>
            {getFormattedDate(data.completed.date)}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction='row' alignItems='center' spacing={1} color={colors.textGray}>
        <Typography fontSize={14}>completó </Typography>{' '}
        <Stack direction='row' spacing={0.5}>
          <FitnessCenterIcon color='primary' fontSize='small' />
          <Typography fontStyle='italic' fontWeight={700} fontSize={14} color='primary'>
            {data.title}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
)

export const Spinner = () => (
  <CircularProgress
    sx={{
      position: 'absolute',
      top: '110px',
      right: '50%',
      transform: 'translate(50%, 50%)',
    }}
  />
)
