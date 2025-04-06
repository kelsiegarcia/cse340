const reviewModel = require('../models/review-model');
const utilities = require('../utilities/');
const { body, validationResult } = require('express-validator');
const validate = {};
const invModel = require('../models/inventory-model');
const ejs = require('ejs');

/* ****************************************
 * ADD review validation rules
 * *************************************** */

validate.addReviewRules = () => {
  const validationRules = [
    body('review_text')
      .trim() // needs to be before .notEmpty()
      .notEmpty()
      .withMessage('Please enter a review description.')
      .bail()
      .escape()
      .isLength({ min: 3 })
      .withMessage('Please provide a complete description.'), //on error this message is sent
  ];

  return validationRules;
};

/* ****************************************
 * Check review rules and return errors or continue to add review
 * *************************************** */

validate.checkAddReviewData = async (req, res, next) => {
  const {
    screen_name,
    review_text,
    account_id,
    inv_id,
    account_firstname,
    review_id,
  } = req.body;

  //If there are errors (errors not empty), return to form with sticky data
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.status(400).render('reviews/add-review', {
      errors,
      title: 'Add Review',
      screen_name,
      review_text,
      review_id,
      account_id,
      inv_id,
      nav,
    });
    return;
  }
  next();
};

/* ****************************************
 * UPDATE review validation rules
 * *************************************** */

validate.updateReviewRules = () => {
  const validationRules = [
    body('review_text')
      .trim() // needs to be before .notEmpty()
      .notEmpty()
      .withMessage('Please enter a review description.')
      .bail()
      .escape()
      .isLength({ min: 3 })
      .withMessage('Please provide a complete description.'), //on error this message is sent
  ];

  return validationRules;
};

/* ****************************************
 * Check review rules and return errors or continue to update review
 * *************************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
  const {
    screen_name,
    review_text,
    account_id,
    inv_id,
    account_firstname,
    review_id,
  } = req.body;

  //If there are errors (errors not empty), return to form with sticky data
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const reviewData = await reviewModel.getReviewById(review_id);
    if (!reviewData || reviewData.length === 0) {
      req.flash('notice', 'Review not found.');
      return res.redirect('/'); // Redirect to a safe route
    }
    const review = reviewData[0];
    const screen_name = `${review.account_firstname.charAt(0)}${
      review.account_lastname
    }`;

    res.status(400).render('reviews/edit-review', {
      errors,
      title: 'Edit Review',
      screen_name,
      review_text,
      review_id,
      account_id,
      inv_id,
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;
