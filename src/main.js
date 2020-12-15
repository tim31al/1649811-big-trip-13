import {generatePoints} from "./mock/point";
import {generateOffers} from "./mock/offer";
import TripPresenter from "./presenter/trip";
import PointsModel from "./model/points";

const POINT_COUNT = 5;

const offers = generateOffers();
const points = generatePoints(POINT_COUNT, offers);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const bodyElement = document.querySelector(`.page-body`);
const tripInfoElement = bodyElement.querySelector(`.page-header .trip-main`);
const tripPointsElement = bodyElement.querySelector(`.page-main section.trip-events`);

// const renderTripMainBlock = (tripMainContainer, info, pageFilters) => {
//   // main trip info
//   render(tripMainContainer, new TripInfoView(info), RenderPosition.AFTERBEGIN);
//
//   // menu
//   const menuHeaderElement = tripMainContainer.querySelector(`h2.visually-hidden`);
//   render(menuHeaderElement, new MenuView(), RenderPosition.AFTER);
//
//   // filter
//   const filterHeaderElement = tripMainContainer.querySelector(`h2.visually-hidden:last-child`);
//   render(filterHeaderElement, new FilterView(pageFilters), RenderPosition.AFTER);
// };

// renderTripMainBlock(mainTripElement, tripInfo, filters);

const trip = new TripPresenter(tripInfoElement, tripPointsElement, pointsModel);
trip.init(points, offers);
