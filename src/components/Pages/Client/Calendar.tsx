import { Card, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { getMonth } from "../../../utils/utils";

const Calendar = () => {
  const month = getMonth();

  return (
    <Card sx={{ height: 1, display: "flex", flexDirection: "column" }}>
      <Typography variant="h3" textAlign="center" sx={{ my: 2 }}>
        Mayo
      </Typography>
      <Box
        display="grid"
        gridTemplateRows="repeat(5,1fr)"
        gridTemplateColumns="repeat(7,1fr)"
        flex={1}
        px={3}
        pb={2}
      >
        {month.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, cellIdx) => (
              <Box key={cellIdx} border="1px solid #ccc">
                <Typography variant="caption" justifySelf="end">
                  {day.date()}
                </Typography>
              </Box>
            ))}
          </React.Fragment>
        ))}
      </Box>
    </Card>
  );
};

export default Calendar;
