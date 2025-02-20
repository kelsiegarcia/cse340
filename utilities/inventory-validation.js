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

module.exports = validate;
