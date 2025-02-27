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
    body('inv_make')
      .trim()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage('Make must be at least 3 characters long.'),
    body('inv_model')
      .trim()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage('Model must be at least 3 characters long.'),
    body('inv_year')
      .trim()
      .isNumeric()
      .notEmpty()
      .withMessage('Year must be an integer.'),
    body('inv_color')
      .trim()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage('Color must be at least 3 characters long.'),
    body('inv_price')
      .trim()
      .isNumeric()
      .notEmpty()
      .withMessage('Price must be an integer.'),
    body('inv_miles')
      .trim()
      .isNumeric()
      .notEmpty()
      .withMessage('Miles must be an integer.'),
    body('inv_image')
      .trim()
      .notEmpty()
      .withMessage('Image must be a valid URL.'),
    body('inv_description')
      .trim()
      .isLength({ min: 3 })
      .notEmpty()
      .withMessage('Description must be at least 3 characters long.'),
    body('inv_thumbnail')
      .trim()
      .notEmpty()
      .withMessage('Thumbnail must be a valid URL.'),
    body('classification_id')
      .trim()
      .isInt()
      .notEmpty()
      .withMessage('Classification ID must be an integer.'),
  ];
};

/*  **********************************
 * Check vehicle rules and return errors or continue to add vehicle
 * ********************************* */

validate.vehicleData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_color,
    inv_price,
    inv_miles,
    inv_image,
    inv_description,
    inv_thumbnail,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-vehicle', {
      errors,
      title: 'Add Vehicle',
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_color,
      inv_price,
      inv_miles,
      inv_image,
      inv_description,
      inv_thumbnail,
      classification_id,
      classificationList,
    });
    return;
  }
  next();
};

module.exports = validate;
