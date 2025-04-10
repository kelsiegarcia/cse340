const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');
const ejs = require('ejs');
const reviewModel = require('../models/review-model');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  if (!data[0]) {
    res.render('./inventory/classification', {
      title: 'Vehicles',
      nav,
      grid: 'Sorry, no vehicles were found for that classification',
      errors: null,
    });
  } else {
    // build a view with the vehicles/inventory results
    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;
    res.render('./inventory/classification', {
      title: className + ' vehicles',
      nav,
      grid,
      errors: null,
    });
  }
};

invCont.buildSingleVehicle = async function (req, res) {
  const inv_id = req.params.carModelId;
  const data = await invModel.getInventoryById(inv_id);
  const carDetailsGrid = await utilities.buildSingleVehiclePage(data);
  let nav = await utilities.getNav();
  const reviewData = await reviewModel.getReviewsByInventoryId(inv_id); // Fetch reviews

  // Build HTML for displaying reviews
  const reviewListHTML = await utilities.buildReviewListHTML(reviewData);

  let addReview = '';
  // check login, if logged in add a form to add a review
  if (res.locals.loggedin) {
    const screen_name =
      req.user.account_firstname.charAt(0).toUpperCase() +
      req.user.account_lastname.charAt(0).toUpperCase() +
      req.user.account_lastname.slice(1).toLowerCase();
    const account_id = req.user.account_id;

    //create sub view to add review if logged in
    const reviewFormData = {
      screen_name,
      account_id,
      inv_id,
      errors: null,
      title: 'Add Review',
    };
    addReview = await ejs.renderFile(
      './views/reviews/add-review.ejs',
      reviewFormData
    );
  } else {
    addReview =
      '<p class="review-message">You must first <a href="/account/login">login</a> to write a review.</p>';
  }

  // console.log(data);

  const vehicleName =
    data && data[0]
      ? data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
      : 'Vehicle Details';
  res.render('./inventory/vehicle', {
    title: vehicleName,
    nav,
    carDetailsGrid,
    reviewTitle: 'Customer Reviews', // Add review title for the view
    reviewList: reviewListHTML, // Pass the formatted review list
    addReview,
    errors: null,
  });
};

invCont.errorHandler = async (req, res, next) => {
  const error = new Error();
  if (req.query.status == 404) {
    error.status = 404;
    error.message = 'Page Not Found';
  } else {
    error.status = 500;
    error.message = 'Internal Server Error';
  }
  next(error); // Pass the error with status and message
};

invCont.buildManagement = async (req, res, next) => {
  // console.log('invCont.buildManagement called!');
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    errors: null,
    classificationSelect,
  });
};

invCont.buildAddClass = async (req, res, next) => {
  let nav = await utilities.getNav();
  res.render('inventory/add-classification', {
    title: 'Add Classification',
    nav,
    errors: null,
  });
};

// Process the add classification form
invCont.processAddClass = async (req, res) => {
  let nav = await utilities.getNav();
  const classification_name = req.body.classification_name;
  const classResult = await invModel.addClassification(classification_name);

  if (classResult) {
    req.flash('success', 'Classification added successfully');
    nav = await utilities.getNav();

    res.status(200).render('inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null,
    });
  } else {
    req.flash('error', 'Error adding classification');
    res.status(501).render('inventory/add-classification', {
      title: 'Add classification',
      nav,
      errors: null,
    });
  }
};

// Build add Vehicle view.
invCont.buildAddVehicle = async (req, res) => {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();

  res.render('inventory/add-vehicle', {
    title: 'Add Vehicle',
    nav,
    classificationList: classificationList,
    errors: null,
  });
};

// Process add vehicle.
invCont.processAddVehicle = async (req, res) => {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const vehicle = req.body;
  const vehicleResult = await invModel.addVehicle(vehicle);
  const classificationSelect = await utilities.buildClassificationList(
    vehicle.classification_id
  );

  if (vehicleResult) {
    req.flash('success', 'Vehicle added successfully');
    nav = await utilities.getNav();

    res.status(200).render('inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null,
      classificationList: classificationList,
      classificationSelect: classificationSelect,
    });
  } else {
    req.flash('error', 'Error adding vehicle');
    // console.log(vehicle.classification_id);
    res.status(501).render('inventory/add-vehicle', {
      title: 'Add Vehicle',
      nav,
      errors: null,
      classificationList: classificationList,
      classificationSelect: classificationSelect,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error('No data returned'));
  }
};

// Edit/update inventory view
invCont.editVehicle = async (req, res) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const classification_name = req.body.classification_name;
  const itemData = await invModel.getInventoryById(inv_id);
  let classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render('./inventory/edit-vehicle', {
    title: 'Edit ' + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

// update inventory data
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
    req.flash('notice', `The ${itemName} was successfully updated.`);
    res.redirect('/inv/');
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the insert failed.');
    res.status(501).render('inventory/edit-inventory', {
      title: 'Edit ' + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

// Confirm delete view
invCont.confirmDelete = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const vehicleData = await invModel.getInventoryById(inv_id);
  const itemName = `${vehicleData.inv_make} ${vehicleData.inv_model}`;

  res.render('inventory/delete-confirm', {
    title: `Delete vehicle - ${itemName}?`,
    nav,
    errors: null,
    inv_id: vehicleData.inv_id,
    inv_make: vehicleData.inv_make,
    inv_model: vehicleData.inv_model,
    inv_year: vehicleData.inv_year,
    inv_price: vehicleData.inv_price,
  });
};

// Delete vehicle
invCont.deleteVehicle = async (req, res, next) => {
  const inv_id = parseInt(req.body.inv_id);
  const inventoryResult = await invModel.deleteSingleVehicle(inv_id);

  if (inventoryResult) {
    req.flash('notice', 'Vehicle deleted successfully');
    res.redirect('/inv/');
  } else {
    req.flash('error', 'Error deleting vehicle');
    res.redirect('inventory/delete-confirm/' + inv_id);
  }
};

module.exports = invCont;
