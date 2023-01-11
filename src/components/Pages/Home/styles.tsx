import { Card, CircularProgress, Stack, styled, Typography } from '@mui/material'
import colors from '../../../theme/colors'

export const HomeRow = styled('div')(({ theme }) => ({
  width: '100%',
  height: 500,
  maxHeight: '50%',
  display: 'flex',
  margin: `${theme.spacing(2)} ${theme.spacing(4)}`,
}))

export const HomeCard = styled(Card)(() => ({
  height: '100%',
  boxSizing: 'border-box',
  overflow: 'scroll',
  overflowX: 'hidden',
}))

export const HomeCardSection = styled(Stack)(({ theme }) => ({
  width: 600,
  marginRight: theme.spacing(4),
}))

export const EmptyCardMessage = styled(Typography)(({ theme }) => ({
  fontStyle: 'italic',
  color: colors.textGraySecondary,
  padding: theme.spacing(2),
}))

export const Spinner = styled(CircularProgress)(() => ({
  position: 'absolute',
  top: 110,
  right: '50%',
  transform: 'translate(50%, 50%)',
}))

export const ClientTaskRowContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  cursor: 'pointer',
  '&:hover': { backgroundColor: '#ddd' },
}))

export const ClientRowContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  cursor: 'pointer',
  '&:hover': { bgcolor: '#ddd' },
}))

export const ClientNameText = styled(Typography)(() => ({
  fontWeight: 700,
  color: colors.textGray,
  letterSpacing: 0.3,
  fontSize: 14,
}))
