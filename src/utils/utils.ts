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

export const translateDayToSpanish = (day: string) => {
  switch(day) {
    case 'Sun':
      return 'Dom'
    case 'Mon':
      return 'Lun'
    case 'Tue':
      return 'Mar'
    case 'Wed':
      return 'Mie'
    case 'Thu':
      return 'Jue'
    case 'Fri':
      return 'Vie'
    case 'Sat':
      return 'Sab'
    default: return '';
  }
} 