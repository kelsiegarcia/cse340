const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

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
  // const grid = await utilities.buildClassificationGrid(data);
  // const className = data[0].classification_name;

  // res.render('./inventory/classification', {
  //   title: className + ' vehicles',
  //   nav,
  //   grid,
  //   errors: null,
  // });
};

invCont.buildSingleVehicle = async function (req, res) {
  const inv_id = req.params.carModelId;
  const data = await invModel.getInventoryById(inv_id);
  const carDetailsGrid = await utilities.buildSingleVehiclePage(data);
  let nav = await utilities.getNav();
  res.render('inventory/vehicle', {
    title: 'Car Details',
    nav,
    carDetailsGrid,
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
  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    errors: null,
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
  // console.log('processAddVehicle called');
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const vehicle = req.body;
  const vehicleResult = await invModel.addVehicle(vehicle);

  if (vehicleResult) {
    req.flash('success', 'Vehicle added successfully');
    nav = await utilities.getNav();

    res.status(200).render('inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null,
      classificationList: classificationList,
    });
  } else {
    req.flash('error', 'Error adding vehicle');
    // console.log(vehicle.classification_id);
    res.status(501).render('inventory/add-vehicle', {
      title: 'Add Vehicle',
      nav,
      errors: null,
      classificationList: classificationList,
    });
  }
};

module.exports = invCont;
