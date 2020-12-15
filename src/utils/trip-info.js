import dayjs from "dayjs";

const defaultTrip = {
  title: `No travel`,
  price: 0,
  date: ``,
};

const createTitle = (points) => {
  const length = points.length;
  switch (length) {
    case 1:
      return `${points[0].destination}`;
    case 2:
      return `${points[0].destination} — ${points[1].destination}`;
    case 3:
      return `${points[0].destination} — ${points[1].destination} — ${points[2].destination}`;
    default:
      return `${points[0].destination} — ... — ${points[length - 1].destination}`;
  }
};

const createPrice = (points) => {
  return points.reduce((sum, item) => (sum + item.price), 0);
};

const createDate = (points) => {
  const start = points[0].date.start;
  const end = points[points.length - 1].date.end;

  return `${dayjs(start).format(`DD MMM`)} — ${dayjs(end).format(`DD MMM`)}`;
};

export const createTripInfo = (points) => {
  if (points.length === 0) {
    return defaultTrip;
  }
  return {
    title: createTitle(points),
    price: createPrice(points),
    date: createDate(points)
  };
};