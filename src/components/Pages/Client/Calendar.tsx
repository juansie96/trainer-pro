import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { getMonth } from "../../../utils/utils";
import CalendarDay from "./CalendarDay";

const Calendar = () => {
  const month = getMonth();

  return (
    <Card
      sx={{ height: 1, display: "flex", flexDirection: "column" }}
      elevation={10}
      className="calendar-wrapper"
    >
      <Typography variant="h4" textAlign="center" sx={{ my: 1.5 }}>
        Mayo 2022
      </Typography>
      <Box
        className="calendar-grid"
        display="grid"
        gridTemplateRows="repeat(5,1fr)"
        gridTemplateColumns="repeat(7,1fr)"
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
              />
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default Calendar;
