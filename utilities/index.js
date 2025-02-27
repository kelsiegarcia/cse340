const invModel = require('../models/inventory-model');
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" ></a>';
      grid += '<div class="namePrice">';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle detail view HTML
 * ************************************ */
Util.buildSingleVehiclePage = async function (vehicle) {
  let carDetailsGrid;
  carDetailsGrid = '<div id="vehicle-display">';
  carDetailsGrid += '<div>';
  carDetailsGrid +=
    '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>';
  carDetailsGrid +=
    '<img src="' +
    vehicle.inv_image +
    '" alt="Image of ' +
    vehicle.inv_make +
    ' ' +
    vehicle.inv_model +
    ' on CSE Motors" >';
  carDetailsGrid += '</div>';
  carDetailsGrid += '<div id="vehicle-details">';
  carDetailsGrid +=
    '<h1>Price: $' +
    new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
    '</h1>';
  carDetailsGrid += '<p>' + vehicle.inv_description + '</p>';
  carDetailsGrid += '<ul class="list-details">';
  carDetailsGrid +=
    '<li><strong>Mileage:</strong> ' +
    new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +
    ' miles</li>';
  carDetailsGrid +=
    '<li><strong>Exterior color:</strong> ' + vehicle.inv_color + '</li>';
  carDetailsGrid += '<li><strong>Year:</strong> ' + vehicle.inv_year + '</li>';
  carDetailsGrid += '<li><strong>Make:</strong> ' + vehicle.inv_make + '</li>';
  carDetailsGrid +=
    '<li><strong>Model:</strong> ' + vehicle.inv_model + '</li>';
  carDetailsGrid += '</ul>';
  carDetailsGrid += '</div>';
  carDetailsGrid += '</div>';
  return carDetailsGrid;
};

/* ****************************************
 classification list for add vehicle form
 if no data is returned, return a message

 **************************************** */

Util.buildClassificationList = async function () {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classification_id">';
  if (data && data.rows) {
    data.rows.forEach((row) => {
      classificationList +=
        '<option value="' +
        row.classification_id +
        '">' +
        row.classification_name +
        '</option>';
    });
  } else {
    classificationList +=
      '<option value="">No classifications available</option>';
  }
  classificationList += '</select>';
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
