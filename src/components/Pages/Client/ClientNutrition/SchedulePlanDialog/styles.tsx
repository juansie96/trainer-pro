import { styled } from '@mui/system'

export const DayCircle = styled('div')<{ isActive: boolean }>(({ isActive }) => ({
  height: 40,
  width: 40,
  borderRadius: '50%',
  border: '1px solid #ccc',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: isActive ? '#3a3a3a' : 'inherit',
  color: isActive ? 'white' : 'inherit',
}))
