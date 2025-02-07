const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
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

module.exports = invCont;
