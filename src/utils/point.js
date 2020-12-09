import dayjs from "dayjs";

const printTimeUnit = (unit) => {
  return unit < 10 ? `0${unit}` : unit;
};

export const getDuration = (startDate, endDate) => {
  const diffMinutes = dayjs(endDate).diff(startDate, `minute`);

  if (diffMinutes < 60) {
    return `${printTimeUnit(diffMinutes)}M`;
  }

  let hours = Math.floor(diffMinutes / 60);
  if (hours < 24) {
    const minutes = Math.floor(diffMinutes - hours * 60);
    return `${printTimeUnit(hours)}H ${printTimeUnit(minutes)}M`;
  }

  const days = Math.floor(hours / 24);
  hours = Math.floor(hours - days * 24);
  const minutes = Math.floor(diffMinutes - hours * 60 - days * 24 * 60);

  return `${printTimeUnit(days)}D ${printTimeUnit(hours)}H ${printTimeUnit(minutes)}M`;
};

export const isPointPast = (endDate) => {
  return dayjs().isAfter(endDate, `date`);
};

export const isPointFuture = (startDate) => {
  const currentDate = dayjs();
  return currentDate.isSame(startDate, `date`)
    || currentDate.isBefore(startDate, `date`);
};

export const sortByPrice = (pointA, pointB) => {
  return pointA.price > pointB.price ? -1 : 1;
};

export const sortByTime = (pointA, pointB) => {
  const durationPointA = pointA.date.end - pointA.date.start;
  const durationPointB = pointB.date.end - pointB.date.start;

  return durationPointA > durationPointB ? -1 : 1;
};
