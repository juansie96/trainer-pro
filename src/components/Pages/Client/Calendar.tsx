import { Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { getMonth, getMonthNameByNumber } from '../../../utils/dates'
import AddNewTaskDialog from './AddNewTaskDialog'
import CalendarDay from './CalendarDay'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import dayjs from 'dayjs'

const Calendar = () => {
  const [taskDialog, setTaskDialog] = useState<{ open: boolean; day: Date | null }>({
    open: false,
    day: null,
  })

  const [monthNumber, setMonthNumber] = useState(dayjs().month())
  const month = getMonth(monthNumber)

  const handleDayClick = (day: Date) => {
    setTaskDialog({ open: true, day })
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 110px - 64px)',
        height: 1,
      }}
      elevation={10}
      className='calendar-wrapper'
    >
      <Box margin='auto' display='flex' alignItems={'center'}>
        <ArrowBackIosIcon
          onClick={() => setMonthNumber(monthNumber - 1)}
          sx={{ cursor: 'pointer' }}
        />
        <Typography variant='h4' textAlign='center' sx={{ my: 1.5, mx: 1.5 }}>
          {getMonthNameByNumber(monthNumber)} 2022
        </Typography>
        <ArrowForwardIosIcon
          onClick={() => setMonthNumber(monthNumber + 1)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
      <Box
        className='calendar-grid'
        display='grid'
        gridTemplateRows='repeat(5,1fr)'
        gridTemplateColumns='repeat(7,1fr)'
        flex={1}
        px={1}
        pb={2}
      >
        {month.map((row, rowIdx) => (
          <React.Fragment key={rowIdx}>
            {row.map((day, colIdx) => (
              <CalendarDay
                day={day}
                rowIdx={rowIdx}
                colIdx={colIdx}
                key={day.toISOString()}
                onDayClick={handleDayClick}
              />
            ))}
          </React.Fragment>
        ))}
      </Box>
      {taskDialog.open && (
        <AddNewTaskDialog
          onClose={() => setTaskDialog({ open: false, day: null })}
          day={taskDialog.day as Date}
        />
      )}
    </Card>
  )
}

export default Calendar
