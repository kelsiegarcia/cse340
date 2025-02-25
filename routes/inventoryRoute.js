// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const classValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build specific vehicle model details view
router.get('/detail/:carModelId', invController.buildSingleVehicle);

// Route for the error view
router.get('/error', invController.errorHandler);

// Route for management view
router.get('/inv/', invController.buildManagement);

// Route for add class view
router.get('/add-classification', invController.buildAddClass);

// Process the add classification form
router.post(
  '/add-classification',
  classValidate.classRules(),
  classValidate.classData,
  utilities.handleErrors(invController.processAddClass)
);

module.exports = router;
