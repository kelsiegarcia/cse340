const express = require('express');
const router = new express.Router();
const reviewController = require('../controllers/reviewController');
const revValid = require('../utilities/review-validation');
const utilities = require('../utilities/');
const reviewModel = require('../models/review-model');
const { check } = require('express-validator');

// Route to get a review
router.get(
  '/inventory/:inv_id',
  utilities.handleErrors(reviewController.buildReview)
);
// route to post review
router.post(
  '/add-review',
  revValid.addReviewRules(),
  revValid.checkAddReviewData,
  utilities.handleErrors(reviewController.processAddReview)
);
//rout to edit review
router.get(
  '/edit-review/:review_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.editReview)
);
// route to update review
router.post(
  '/edit-review',
  revValid.updateReviewRules(),
  revValid.checkUpdateReviewData,
  utilities.handleErrors(reviewController.processUpdateReview)
);
// route to get delete review
router.get(
  '/delete-review/:review_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.confirmDeleteReview)
);
// route to delete review
router.post(
  '/delete-review',
  utilities.checkLogin,
  reviewController.deleteReview
);

module.exports = router;
