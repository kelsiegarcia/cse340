const invModel = require('../models/inventory-model');
const Util = {};
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

 **************************************** */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id === classification_id
    ) {
      classificationList += ' selected ';
    }
    classificationList += '>' + row.classification_name + '</option>';
  });
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

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash('Please log in');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash('notice', 'Please log in.');
    return res.redirect('/account/login');
  }
};

/* ****************************************
 *  Check authorization based on employee or admin account type
 * ************************************ */

Util.checkAuth = (req, res, next) => {
  let auth = false;

  if (res.locals.loggedin) {
    const account = res.locals.accountData;
    // terinary operator to check if account is admin or employee
    account.account_type == 'Admin' || account.account_type == 'Employee'
      ? (auth = true)
      : (auth = false);
  }

  if (!auth) {
    req.flash(
      'notice',
      'You need to be an admin or employee to access this page.'
    );
    res.redirect('/account/login');
    return;
  } else {
    next();
  }
};

module.exports = Util;
