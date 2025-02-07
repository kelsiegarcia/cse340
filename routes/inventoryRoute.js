// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route to build specific vehicle model details view
router.get('/detail/:carModelId', invController.buildSingleVehicle);

module.exports = router;
