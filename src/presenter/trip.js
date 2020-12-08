import SortView from "../view/sort";
import PointListView from "../view/point-list";
import NoPointView from "../view/no-point";
import PointPresenter from "../presenter/point";
import {RenderPosition, render} from "../utils/render";
import {updatePoint} from "../utils/common";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._noPointComponent = new NoPointView();
    this._pointListComponent = new PointListView();
    this._sortComponent = new SortView();

    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(points, offers) {
    this._points = points.slice();
    this._offers = offers;

    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    console.log(updatedPoint);
    this._points = updatePoint(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._offers);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange);
    pointPresenter.init(point, this._offers);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPointList() {
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    this._points.forEach((point) => this._renderPoint(point));

    console.log(this._pointPresenter);
  }

  _renderNoPoints() {
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }
  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderFilter() {

  }

  _renderTrip() {
    if (this._points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    this._renderPointList();
  }
}
