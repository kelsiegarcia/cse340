const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
// async function registerAccount(req, res) {
//   let nav = await utilities.getNav();
//   const {
//     account_firstname,
//     account_lastname,
//     account_email,
//     account_password,
//   } = req.body;

//   // Hash the password before storing
//   let hashedPassword;
//   try {
//     // regular password and cost (salt is generated automatically)
//     hashedPassword = await bcrypt.hashSync(account_password, 10);
//     // console.log(hashedPassword);
//     console.log(error);
//   } catch (error) {
//     req.flash(
//       'notice',
//       'Sorry, there was an error processing the registration.'
//     );
//     res.status(500).render('account/register', {
//       title: 'Registration',
//       nav,
//       errors: null,
//     });
//   }

//   const regResult = await accountModel.registerAccount(
//     account_firstname,
//     account_lastname,
//     account_email,
//     hashedPassword
//   );

//   console.log(regResult);

//   if (regResult) {
//     req.flash(
//       'notice',
//       `Congratulations, you\'re registered ${account_firstname}. Please log in.`
//     );
//     res.status(201).render('account/login', {
//       title: 'Login',
//       nav,
//       errors: null,
//     });
//   } else {
//     req.flash('notice', 'Sorry, the registration failed.');
//     res.status(501).render('account/register', {
//       title: 'Registration',
//       nav,
//     });
//   }
// }

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  console.log(regResult);

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  process login request
 * *************************************** */

async function processLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const loginResult = await accountModel.loginAccount(account_email);

  if (loginResult) {
    req.flash('notice', 'Login successful');
    res.status(200).render('account/login', {
      title: 'Login',
      nav,
      account_email,
      errors: null,
    });
  } else {
    req.flash('notice', 'Sorry, the login failed.');
    res.status(400).render('account/login', {
      title: 'login',
      nav,
      account_email,
      errors: null,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, processLogin };
