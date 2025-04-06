const utilities = require('.');
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/account-model');
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'), // on error this message is sent.

    // lastname is required and must be string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error(
            'Email already exists. Please login or use a different email.'
          );
        }
      }),
    // password is required and must be strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors,
      title: 'Registration',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */

validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists && account_email == ' ') {
          throw new Error(
            'This email account does not exist. Please use valid email.'
          );
        }
      }),
    // password is required and must be strong password
    body('account_password')
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */

validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body('account_firstname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'), // on error this message is sent.

    // lastname is required and must be string
    body('account_lastname')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('Please provide a last name.'), // on error this message is sent,

    // valid email is required and cannot already exist in the DB
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.'),
  ];
};

/* ******************************
 * Change password Data Validation Rules
 * ***************************** */
validate.updatePasswordRules = () => {
  return [
    body('account_password')
      .trim()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/
      )
      .withMessage('Password does not meet requirements.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = req.params.account_id;
  const currentAccount = await accountModel.getAccountById(account_id);
  let errors = [];
  if (currentAccount && account_email != currentAccount.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      errors.push('Email exists. Please log in or use a different email.');
    }
  }
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('account/edit', {
      errors: errors,
      title: 'Update Account',
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkUpdatePassword = async (req, res, next) => {
  const { account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/password', {
      errors,
      title: 'Update Password',
      nav,
    });
    return;
  }
  next();
};
module.exports = validate;
