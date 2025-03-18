// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');
const { check } = require('express-validator');

// Route to build inventory by classification view
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build specific vehicle model details view
router.get(
  '/detail/:carModelId',
  utilities.handleErrors(invController.buildSingleVehicle)
);

// Route for the error view
router.get('/error', utilities.handleErrors(invController.errorHandler));

// Route for management view
router.get(
  '/inv/',
  utilities.checkAuth,
  utilities.handleErrors(invController.buildManagement)
);

// Route for add class view
router.get(
  '/add-classification',
  utilities.checkAuth,
  utilities.handleErrors(invController.buildAddClass)
);

// Route to add vehicle view
router.get(
  '/add-vehicle',
  utilities.checkAuth,
  utilities.handleErrors(invController.buildAddVehicle)
);

// Process the add classification form
router.post(
  '/add-classification',
  utilities.checkAuth,
  invValidate.classRules(),
  invValidate.classData,
  utilities.handleErrors(invController.processAddClass)
);

// Process the add vehicle form
router.post(
  '/add-vehicle',
  utilities.checkAuth,
  invValidate.vehicleRules(),
  invValidate.vehicleData,
  utilities.handleErrors(invController.processAddVehicle)
);

// Route to show inventory/management view with classification select menu
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to update/edit a vehicle/inventory
router.get(
  '/edit/:inv_id',
  utilities.checkAuth,
  utilities.handleErrors(invController.editVehicle)
);

// Route to process update view (update vehicle/inventory)
router.post(
  '/update',
  utilities.checkAuth,
  invValidate.vehicleRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to confirm delete of a vehicle/inventory
router.get(
  '/delete/:inv_id',
  utilities.checkAuth,
  utilities.handleErrors(invController.confirmDelete)
);

// Route to delete a vehicle/inventory
router.post(
  '/delete',
  utilities.checkAuth,
  utilities.handleErrors(invController.deleteVehicle)
);

module.exports = router;
