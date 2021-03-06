import dayjs from "dayjs";
import { Exercise } from "../components/Pages/Workouts/Exercises/Exercises";

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
  switch (day) {
    case "Sun":
      return "Dom";
    case "Mon":
      return "Lun";
    case "Tue":
      return "Mar";
    case "Wed":
      return "Mie";
    case "Thu":
      return "Jue";
    case "Fri":
      return "Vie";
    case "Sat":
      return "Sab";
    default:
      return "";
  }
};

export const videoUrlIsValid = (videoUrl: string) => {
  return /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/.test(
    videoUrl
  );
};

export const extractVideoID = (videoUrl: string) => {
  if (videoUrl.includes("v=")) {
    const videoId = videoUrl.split("v=")[1];
    var ampersandPosition = videoId.indexOf("&");
    return ampersandPosition !== -1
      ? videoId.substring(0, ampersandPosition)
      : videoId;
  } else {
    return "";
  }
};

export function getExerciseImgUrl(exercise: Exercise): string {
  if (exercise.videoUrl && exercise.videoUrl.length > 0) {
    const videoId = extractVideoID(exercise.videoUrl);
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  } else if (exercise.imgUrls && exercise.imgUrls.length) {
    return exercise.imgUrls[0];
  } else {
    return "https://reviverestore.org/wp-content/uploads/2017/05/placeholder-image-cropped.jpg";
  }
}
