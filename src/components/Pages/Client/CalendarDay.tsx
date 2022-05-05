import { Box, Typography } from "@mui/material";
import React from "react";
import { translateDayToSpanish } from "../../../utils/utils";
import dayjs from "dayjs";
import CircleIcon from "@mui/icons-material/Circle";

interface CalendarDayProps {
  rowIdx: number;
  colIdx: number;
  day: dayjs.Dayjs;
}

const DayEvent = () => (
  <Box
    display="flex"
    alignItems="center"
    borderRadius="2px"
    bgcolor="orange"
    color="white"
    mx={0.25}
    sx={{ cursor: "pointer" }}
  >
    <CircleIcon sx={{ fontSize: 12, pl: 0.5 }} />
    <Typography variant="caption" fontSize={10} ml={0.5}>
      Día 1 - Fullbody clásica
    </Typography>
  </Box>
);

const CalendarDayHeader = ({
  rowIdx,
  day,
}: {
  rowIdx: number;
  day: dayjs.Dayjs;
}) => (
  <React.Fragment>
    {rowIdx === 0 && (
      <Typography
        variant="subtitle1"
        textAlign="center" 
        fontSize={13}
        fontWeight={600}
      >
        {translateDayToSpanish(day.format("ddd"))}
      </Typography>
    )}
    <Box display="flex" flexDirection="column" alignItems="end">
      <Typography
        mr={1}
        fontSize={13}
        fontWeight={isCurrentDay(day) ? 600 : 400}
      >
        {day.date()}
      </Typography>
    </Box>
  </React.Fragment>
);

const CalendarDay: React.FC<CalendarDayProps> = ({ day, rowIdx, colIdx }) => {
  return (
    <Box
      key={colIdx}
      display="flex"
      flexDirection="column"
      border={borderStyles}
      borderLeft={colIdx === 0 ? "none" : borderStyles}
      borderRight={colIdx === 6 ? "none" : borderStyles}
      borderTop={rowIdx === 0 ? "none" : borderStyles}
      borderBottom={rowIdx === 4 ? "none" : borderStyles}
    >
      <CalendarDayHeader day={day} rowIdx={rowIdx} />
      <DayEvent />
    </Box>
  );
};

const borderStyles = "1px solid #d7d7d7";


const isCurrentDay = (day: dayjs.Dayjs) => {
  return day.format("DD-MM-YYYY") === dayjs().format("DD-MM-YYYY")
}

export default CalendarDay;
