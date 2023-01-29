import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { translateDayToSpanish } from '../../../utils'
import dayjs from 'dayjs'
import CircleIcon from '@mui/icons-material/Circle'
import { useSelector } from 'react-redux'
import { selectClient } from '../../../redux/slices/Client.slice'
import { CardioTask, GeneralTask, MealPlanTask, WorkoutTask } from '../../../types/task'
import PreviewWorkoutDialog from '../Workouts/Routines/PreviewWorkoutDialog'
import PreviewMealPlanDialog from '../Nutrition/MealPlans/PreviewMealPlanDialog'
import PreviewCardioDialog from '../../UI/Dialogs/PreviewCardioDialog'

interface CalendarDayProps {
  rowIdx: number
  colIdx: number
  day: dayjs.Dayjs
  onDayClick(day: Date): void
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, rowIdx, colIdx, onDayClick }) => {
  const client = useSelector(selectClient)

  if (!client) return null

  const clientEvents = client.tasks?.filter(
    (t) => dayjs(t.date).format('DD/MM/YYYY') === dayjs(day).format('DD/MM/YYYY'),
  )

  return (
    <Box
      key={colIdx}
      display='flex'
      flexDirection='column'
      border={borderStyles}
      borderLeft={colIdx === 0 ? 'none' : borderStyles}
      borderRight={colIdx === 6 ? 'none' : borderStyles}
      borderTop={rowIdx === 0 ? 'none' : borderStyles}
      borderBottom={rowIdx === 4 ? 'none' : borderStyles}
      onClick={() => onDayClick(day.toDate())}
      sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#e7e7e7' } }}
    >
      <CalendarDayHeader day={day} rowIdx={rowIdx} />
      {clientEvents && clientEvents.map((e, i) => <DayEvent event={e} key={e.date + i} />)}
    </Box>
  )
}

const DayEvent = ({ event }: { event: GeneralTask }) => {
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean
    data: WorkoutTask | CardioTask | MealPlanTask | null
  }>({
    open: false,
    data: null,
  })

  let dialogContainer
  let bgcolor

  switch (event.type) {
    case 'workout':
      bgcolor = '#b19316'
      dialogContainer = (
        <PreviewWorkoutDialog
          onClose={() => setDetailsDialog({ open: false, data: null })}
          eventData={event}
        />
      )
      break
    case 'cardio':
      bgcolor = '#1976d2'
      dialogContainer = (
        <PreviewCardioDialog
          onClose={() => setDetailsDialog({ open: false, data: null })}
          data={event}
        />
      )
      break
    case 'mealPlan':
      bgcolor = '#1b9e3c'
      dialogContainer = (
        <PreviewMealPlanDialog
          onClose={() => setDetailsDialog({ open: false, data: null })}
          eventData={event}
        />
      )
      break
  }

  const handleEventClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDetailsDialog({ open: true, data: event })
    e.stopPropagation()
  }

  return (
    <Box
      display='flex'
      alignItems='center'
      borderRadius='2px'
      bgcolor={bgcolor}
      color='white'
      mx={0.25}
      sx={{ cursor: 'pointer', my: 0.25 }}
      onClick={handleEventClick}
    >
      <CircleIcon sx={{ fontSize: 12, pl: 0.5 }} />
      <Typography variant='caption' fontSize={10} ml={0.5} color={'white'}>
        {event.title}
      </Typography>
      {detailsDialog.open && dialogContainer}
    </Box>
  )
}

const CalendarDayHeader = ({ rowIdx, day }: { rowIdx: number; day: dayjs.Dayjs }) => (
  <React.Fragment>
    {rowIdx === 0 && (
      <Typography variant='subtitle1' textAlign='center' fontSize={13} fontWeight={600}>
        {translateDayToSpanish(day.format('ddd'))}
      </Typography>
    )}
    <Box display='flex' flexDirection='column' alignItems='end'>
      <Typography mr={1} fontSize={13} fontWeight={isCurrentDay(day) ? 600 : 400}>
        {day.date()}
      </Typography>
    </Box>
  </React.Fragment>
)

const borderStyles = '1px solid #d7d7d7'

const isCurrentDay = (day: dayjs.Dayjs) => {
  return day.format('DD-MM-YYYY') === dayjs().format('DD-MM-YYYY')
}

export default CalendarDay
