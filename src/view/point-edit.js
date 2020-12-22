import flatpickr from "flatpickr";
import {formatPointFormDate} from "../utils/point";
import SmartView from "./smart";

import "flatpickr/dist/themes/material_blue.css";

const priceKeyDownRegex = /^[0-9]|ArrowLeft|ArrowRight|Delete|Backspace|Tab$/;

const createOfferItem = (offer, offers) => {
  const {title, price} = offer;
  const id = title.split(` `).join(`-`);
  const checked = offers.find((item) => item.title === title) ? `checked` : ``;

  return `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${checked}>
    <label class="event__offer-label" for="${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
   </div>
  `;
};

const createOffersTemplate = (data) => {
  const {availableOffers, offers, pointType} = data;
  const items = availableOffers.map((offer) => createOfferItem(offer, offers, pointType)).join(``);
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
        ${items}
    </div>
  </section>
`;
};

const createEventItem = (eventType, pointType) => {
  const type = eventType.toLowerCase();
  const checked = (eventType === pointType) ? `checked` : ``;
  return `
  <div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${eventType}</label>
  </div>
  `;
};

const createEventTypeTemplate = (pointType, types) => {
  const items = types.map((eventType) => createEventItem(eventType, pointType)).join(``);
  return `
  <div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.toLowerCase()}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${items}
      </fieldset>
    </div>
  </div>
  `;
};

const createDestinationImagesTemplate = (images) => {
  const items = images.map((image) => (
    `<img class="event__photo" src="${image.src}" alt="${image.description}">`)).join(``);
  return `
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${items}
    </div>
  </div>
  `;
};

const createDestinationTemplate = (destination, info) => {
  const {description, images} = info;
  const imageTemplate = (images.length > 0) ? createDestinationImagesTemplate(images) : ``;
  return `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${destination}</h3>
    <p class="event__destination-description">${description}</p>
    ${imageTemplate}
  </section>
  `;
};

const createPointFormTemplate = (data, offers, destinations) => {
  const {pointType, price, destination, info, availableOffers} = data;
  const {start: startDate, end: endDate} = data.date;
  const eventTypeBlock = createEventTypeTemplate(pointType, Object.keys(offers));
  // debugger;
  const offersBlock = availableOffers
    ? createOffersTemplate(data)
    : ``;
  const destinationInfo = info
    ? createDestinationTemplate(destination, info)
    : ``;
  const destinationList = Object.keys(destinations)
    .map((city) => `<option value="${city}"></option>`).join(``);

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">

        ${eventTypeBlock}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">

            ${pointType}

          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text"
          name="event-destination" value="${destination}" placeholder="Select city"
          list="destination-list-1">
          <datalist id="destination-list-1">

            ${destinationList}

          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input
            event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            placeholder="Select start"
            value="${formatPointFormDate(startDate)}"
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input
            event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            placeholder="Select end"
            value="${formatPointFormDate(endDate)}"
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input
            event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            placeholder="0"
            value="${price}"
          >
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
          ${offersBlock}

         ${destinationInfo}
      </section>
    </form>
  </li>`;
};

export default class PointEdit extends SmartView {
  constructor(point, offers, destinations) {
    super();

    this._offers = Object.assign({}, offers);
    this._destinations = Object.assign({}, destinations);
    this._data = this._parsePointToData(point);
    this._datepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._pointTypeToggleHandler = this._pointTypeToggleHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createPointFormTemplate(this._data, this._offers, this._destinations);
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._deleteDatePicker();
    }
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    // Нужны какие-то предупреждения

    if (!(this._data.destination in this._destinations)) {
      // eslint-disable-next-line no-alert
      alert(`Destination not selected`);
      return;
    }
    if (!this._data.date.start || !this._data.date.end) {
      // eslint-disable-next-line no-alert
      alert(`No dates selected`);
      return;
    }
    if (this._data.date.start > this._data.date.end) {
      // eslint-disable-next-line no-alert
      alert(`Error date interval`);
      return;
    }
    this._callback.formSubmit(this._parseDataToPoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._parsePointToData(this._data));
  }

  _formCloseHandler() {
    this._callback.formClose();
  }

  setFormDeleteHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._formDeleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._formCloseHandler);
  }

  _parsePointToData(point) {
    const availableOffers = (point.pointType in this._offers)
      ? this._offers[point.pointType]
      : null;

    return Object.assign(
        {},
        point,
        {
          availableOffers,
        }
    );

  }

  _parseDataToPoint(data) {
    data = Object.assign({}, data);
    data.price = Number.isInteger(data.price) ? data.price : 0;

    delete data.availableOffers;

    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.setFormDeleteHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-wrapper`)
      .addEventListener(`click`, this._pointTypeToggleHandler);

    this.getElement().querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);

    if (this._data.availableOffers) {
      this.getElement().querySelector(`.event__available-offers`)
        .addEventListener(`click`, this._offerChangeHandler);
    }

    this.getElement().querySelector(`.event__input--price`)
      .addEventListener(`keydown`, this._priceKeyDownHandler);

    this.getElement().querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceChangeHandler);
  }

  _offerChangeHandler(evt) {
    const target = evt.target.closest(`label.event__offer-label`);
    if (!target) {
      return;
    }

    const title = target.getAttribute(`for`).split(`-`).join(` `);

    const offers = this._data.offers.slice();
    const index = offers.findIndex((item) => item.title === title);

    if (index !== -1) {
      offers.splice(index, 1);
    } else {
      const offer = this._data.availableOffers
        .find((item) => item.title === title);

      offers.push(offer);
    }

    this.updateData({offers}, true);
  }

  _pointTypeToggleHandler(evt) {
    const target = evt.target.closest(`label.event__type-label`);
    if (!target) {
      return;
    }

    const pointType = target.textContent;

    const availableOffers = pointType in this._offers
      ? this._offers[pointType]
      : null;

    this.updateData({pointType, availableOffers, offers: []});
  }

  _destinationChangeHandler(evt) {
    let city = evt.target.value;

    if (!city || !(city in this._destinations)) {
      evt.target.value = ``;
      evt.target.placeholder = `Select city`;
      evt.target.focus();
      return;
    }

    this.updateData({destination: city, info: this._destinations[city].info});
  }

  _dateStartChangeHandler(evt) {
    const date = Object.assign({}, this._data.date);
    date.start = new Date(evt);
    this.updateData({date}, true);
  }

  _dateEndChangeHandler(evt) {
    const date = Object.assign({}, this._data.date);
    date.end = new Date(evt);
    this.updateData({date}, true);
  }

  _priceKeyDownHandler(evt) {
    if (!priceKeyDownRegex.test(evt.key)) {
      evt.preventDefault();
    }
  }

  _priceChangeHandler(evt) {
    const price = Number.parseInt(evt.target.value, 10);

    if (isNaN(price)) {
      return;
    }

    this.updateData({price}, true);
  }

  reset(point) {
    this.updateData(this._parsePointToData(point));
  }

  _deleteDatePicker() {
    this._datepicker.start.destroy();
    this._datepicker.end.destroy();
    this._datepicker = null;
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._deleteDatePicker();
    }

    const [startDate, endDate] = Array.from(
        this.getElement().querySelectorAll(`.event__input--time`)
    );

    this._datepicker = {
      start: flatpickr(startDate, {
        enableTime: true,
        dateFormat: `d/m/y H:i`,
        defaultsDate: this._data.date.start,
        onChange: this._dateStartChangeHandler,
      }),
      end: flatpickr(endDate, {
        enableTime: true,
        dateFormat: `d/m/y H:i`,
        defaultsDate: this._data.date.end,
        onChange: this._dateEndChangeHandler,
      }),
    };
  }
}
