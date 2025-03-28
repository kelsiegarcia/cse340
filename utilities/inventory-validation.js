const invModel = require('../models/inventory-model');
const utilities = require('.');
const { body, validationResult } = require('express-validator');
const validate = {};

/*  **********************************
 * ADD class validation rules
 * ********************************* */

validate.classRules = () => {
  return [
    body('classification_name')
      .trim()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage('Classification name must be at least 3 characters long.')
      .isAlpha()
      .withMessage('Classification name must contain only letters.')
      .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classExists) {
          throw new Error('Classification already exists.');
        }
      }),
  ];
};

/*  **********************************
 * Check class rules and return errors or continue to add classification
 * ********************************* */

validate.classData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      errors,
      title: 'Add Classification',
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 * ADD vehicle validation rules
 * ********************************* */

validate.vehicleRules = () => {
  return [
    body('classification_id')
      .isNumeric()
      .withMessage('Please select a classification.'),
    body('inv_make')
      .trim()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage('Make must be at least 3 characters long.'),
    body('inv_model')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Model must be at least 3 characters long.')
      .notEmpty()
      .withMessage('Model must be provided.'),
    body('inv_description')
      .trim()
      .notEmpty()
      .withMessage('Description must be provided.')
      .isLength({ min: 3 })
      .withMessage('Description must be at least 3 characters long.'),
    body('inv_image')
      .trim()
      .notEmpty()
      .withMessage('Image must be a valid URL.'),
    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('Thumbnail must be a valid URL.'),
    body('inv_price')
      .trim()
      .notEmpty()
      .withMessage('Price must be provided.')
      .isNumeric()
      .withMessage('Price must be an integer.'),
    body('inv_year')
      .trim()
      .isLength({ min: 4 })
      .withMessage('Year must be 4 characters long.')
      .notEmpty()
      .withMessage('Year must be provided.')
      .isNumeric()
      .withMessage('Year must be an integer.'),
    body('inv_miles')
      .trim()
      .notEmpty()
      .withMessage('Miles must be provided.')
      .isNumeric()
      .withMessage('Miles must be an integer.'),
    body('inv_color')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Color must be at least 3 characters long.')
      .notEmpty()
      .withMessage('Color must be provided.'),
  ];
};

/*  **********************************
 * Check vehicle rules and return errors or continue to add vehicle
 * ********************************* */

validate.vehicleData = async (req, res, next) => {
  // console.log('Request Body:', req.body);
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );

    res.render('inventory/add-vehicle', {
      errors,
      title: 'Add Vehicle',
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_color,
      inv_miles,
    });
    return;
  }
  next();
};

/*  **********************************
 * Check vehicle rules and return errors or continue to edit vehicle/inventory
 * ********************************* */

validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );

    res.render('inventory/edit-vehicle', {
      errors,
      title: 'Edit Vehicle',
      nav,
      classificationList,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_color,
      inv_miles,
    });
    return;
  }
  next();
};

module.exports = validate;
