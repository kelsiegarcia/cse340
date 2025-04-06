const utilities = require('../utilities/');
const reviewModel = require('../models/review-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const revCont = {};
/* ****************************************
 * Build review view with inv_id
 * *************************************** */

revCont.buildReview = async (req, res) => {
  const inv_id = req.params.inv_id;

  //call the model to get the data for reviews
  const reviewData = await reviewModel.getReviewByInv_id(inv_id);

  // build list html
  const reviewList = await utilities.buildReviewListByInv_id(reviewData);
  let addReview = '';
  // check login, if logged in add a form to add a review
  if (res.locals.loggedin) {
    const data = {
      reviewData,
      inv_id,
    };
    addReview = await ejs.renderFile('./views/reviews/add-form.ejs', data);

    //addReview = ejs.renderFile('.review/add-form', data)
  } else {
    addReview =
      '<p>You must first <a href="/account/login">login</a> to write a review.</p>';
  }
  res.render('./reviews/inv-review', {
    title: 'Customer Reviews',
    nav,
    reviewList,
    addReview,
  });
};

/* ****************************************
 * Process review or return an error
 * *************************************** */

revCont.processAddReview = async (req, res) => {
  const { account_id, review_text, inv_id } = req.body;
  //update database with model
  try {
    const newReview = await reviewModel.addReview(
      inv_id,
      account_id,
      review_text
    );
    if (newReview) {
      req.flash('notice', 'Review added.');
      return res.redirect(`/inv/detail/${inv_id}`);
    }
  } catch {
    req.flash('notice', 'Sorry, the review was not added.');
    //just go back to route and reload the vehicle page anyway
    return res.redirect(`/inv/detail/${inv_id}`);
  }
};

/* ****************************************
 * Edit review
 * *************************************** */
revCont.editReview = async (req, res) => {
  try {
    let nav = await utilities.getNav();
    const review_id = req.params.review_id;
    //call the model to get the data for reviews
    const reviewData = await reviewModel.getReviewById(review_id);
    if (!reviewData || reviewData.length === 0) {
      req.flash('notice', 'Review not found.');
      return res.redirect('/'); // Redirect to a safe route
    }
    const review = reviewData[0];
    const screen_name = `${review.account_firstname.charAt(0)}${
      review.account_lastname
    }`;
    res.render('./reviews/edit-review', {
      title: 'Edit Review',
      nav,
      errors: null,
      review_id: review.review_id,
      review_date: review.review_date,
      review_text: review.review_text,
      inv_id: review.inv_id,
      screen_name: screen_name,
      account_id: review.account_id,
    });
  } catch (error) {
    console.error('Error fetching review data:', error);
    req.flash('notice', 'An error occurred while trying to edit the review.');
    return res.redirect('/');
  }
};
/* ****************************************
 * Process review or return an error
 * *************************************** */
revCont.processUpdateReview = async (req, res) => {
  const nav = await utilities.getNav();
  const { screen_name, account_id, review_id, review_text, inv_id } = req.body;
  try {
    const updatedReview = await reviewModel.updateReview(
      review_id,
      review_text
    );
    if (updatedReview) {
      req.flash('notice', 'Review updated.');
      return res.redirect(`/account/`);
    } else {
      req.flash('notice', 'Sorry, the review was not updated.');
      return res.render('./reviews/edit-review', {
        nav,
        title: 'Edit Review',
        errors: null,
        review_id,
        review_text,
        inv_id,
        screen_name,
        account_id,
      });
    }
  } catch (error) {
    console.error('Error updating review:', error);
    req.flash('notice', 'An error occurred while updating the review.');
    return res.render('./reviews/edit-review', {
      nav,
      title: 'Edit Review',
      errors: null,
      review_id,
      review_text,
      inv_id,
      screen_name,
      account_id,
    });
  }
};

/* ****************************************
 * Confirm delete review
 * *************************************** */

revCont.confirmDeleteReview = async (req, res) => {
  const nav = await utilities.getNav();
  const review_id = req.params.review_id;
  //call the model to get the data for reviews
  const reviewData = await reviewModel.getReviewById(review_id);
  if (!reviewData || reviewData.length === 0) {
    req.flash('notice', 'Review not found.');
    return res.redirect('/'); // Redirect to a safe route
  }
  const review = reviewData[0];
  const screen_name = `${review.account_firstname.charAt(0)}${
    review.account_lastname
  }`;
  res.render('./reviews/delete-review', {
    title: 'Delete Review',
    nav,
    errors: null,
    review_id: review.review_id,
    review_date: review.review_date,
    review_text: review.review_text,
    inv_id: review.inv_id,
    screen_name: screen_name,
    account_id: review.account_id,
  });
};

/* ****************************************
 * Process delete review or return an error
 * *************************************** */

revCont.deleteReview = async (req, res) => {
  const nav = await utilities.getNav();
  const { review_id, inv_id } = req.body;
  try {
    const deletedReview = await reviewModel.deleteReview(review_id);
    if (deletedReview) {
      req.flash('notice', 'Review deleted.');
      return res.redirect(`/account/`);
    } else {
      req.flash('notice', 'Sorry, the review was not deleted.');
      return res.redirect(`/reviews/delete-review/${review_id}`);
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    req.flash('notice', 'An error occurred while deleting the review.');
    return res.redirect(`/reviews/delete-review/${review_id}`);
  }
};

module.exports = revCont;
