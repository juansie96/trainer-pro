import { Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { getMonth, getMonthName } from '../../../utils/utils'
import AddNewTaskDialog from './AddNewTaskDialog'
import CalendarDay from './CalendarDay'

const Calendar = () => {
  const [taskDialog, setTaskDialog] = useState<{ open: boolean; day: Date | null }>({
    open: false,
    day: null,
  })
  const month = getMonth()

  const handleDayClick = (day: Date) => {
    console.log('entering this dialog task')
    setTaskDialog({ open: true, day })
  }

  return (
    <Card
      sx={{ height: 1, display: 'flex', flexDirection: 'column' }}
      elevation={10}
      className='calendar-wrapper'
    >
      <Typography variant='h4' textAlign='center' sx={{ my: 1.5 }}>
        {getMonthName(new Date().getMonth())} 2022
      </Typography>
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
