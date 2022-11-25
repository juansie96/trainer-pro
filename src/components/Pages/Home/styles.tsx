import { Card, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { ReactNode } from 'react'
import colors from '../../../theme/colors'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'

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
      p: 2,
      boxSizing: 'border-box',
      overflow: 'scroll',
      overflowX: 'hidden',
    }}
  >
    <Stack spacing={1} divider={<Divider orientation='horizontal' flexItem />} position='relative'>
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
  <Typography fontStyle='italic' color={colors.textGraySecondary}>
    {msg}
  </Typography>
)

export const ClientRow = ({ fullname, onClick }: { fullname: string; onClick(): void }) => (
  <Stack direction='row' alignItems='center' spacing={1.5}>
    <PersonIcon fontSize='large' color='action' />
    <Typography fontWeight={700} color={colors.textGray} letterSpacing={0.3} variant='button'>
      {fullname}
    </Typography>
    <VisibilityIcon color='action' onClick={onClick} sx={{ ml: 1, cursor: 'pointer' }} />
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
