import dayjs from "dayjs";

export const getMonth = (month = dayjs().month()) => {
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currCalendarDay = 0 - firstDayOfTheMonth;

  const daysMatrix = new Array(5).fill(null).map(() =>
    new Array(7).fill(null).map(() => {
      currCalendarDay++;
      return dayjs(new Date(year, month, currCalendarDay));
    })
  );

  return daysMatrix;
};
