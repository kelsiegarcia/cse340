const utilities = require('../utilities/');
const accountModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

  // console.log(regResult);

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

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === 'development') {
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 }); // 3600 * 1000 milliseconds (1 hour)
        req.flash('notice', 'You are logged in!');
      } else {
        res.cookie('jwt', accessToken, {
          httpOnly: true,
          //passed through https and not http for a secure connection
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect('/account/');
    }
  } catch (error) {
    return new Error('Access Forbidden');
  }
}

/* ****************************************
 *  Account management
 * *************************************** */

async function accountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render('account/', {
    title: 'Account Management',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Account logout
 * *************************************** */

async function accountLogout(req, res) {
  res.clearCookie('jwt');
  res.redirect('/account/login');
}

/* ****************************************
 *  Update Account Information
 * *************************************** */

async function buildEditAccount(req, res) {
  let nav = await utilities.getNav();
  // get account_id from the request parameters
  const accountID = req.params.account_id;
  // get the account information
  const accountData = res.locals.accountData;
  if (!accountData) {
    req.flash('notice', 'Please check your credentials and try again.');
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    });
    return;
  } else {
    // render the update account view
    res.render('account/edit', {
      title: 'Edit Account Information',
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
    });
  }
}

/* ****************************************
 *  Update Account Information View with a new JWT
 * *************************************** */

async function processUpdate(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  try {
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );

    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id);
      delete accountData.account_password;

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 3600,
        }
      );

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        ...(process.env.NODE_ENV !== 'development' && { secure: true }), // Add secure flag in production
      };

      res.cookie('jwt', accessToken, cookieOptions);

      req.flash('notice', 'Account updated.');
      return res.redirect('/account/'); // Use return for consistent flow
    } else {
      req.flash('notice', 'Sorry, the update failed.');
      return res.render('account/edit', {
        title: 'Edit Account',
        errors: null, //Or whatever error object you are using.
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        nav: await utilities.getNav(), // assuming utilities is available
      });
    }
  } catch (error) {
    console.error('Error during account update:', error);
    req.flash('notice', 'An unexpected error occurred.');
    return res.render('account/edit', {
      title: 'Edit Account',
      errors: null, //Or whatever error object you are using.
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      nav: await utilities.getNav(),
    });
  }
}

/* ****************************************
 *  Update Password grab the password and hash it and send it to the model and return the result
 * *************************************** */
async function processPassword(req, res) {
  const { account_password, account_id } = req.body;
  let nav = await utilities.getNav();
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(
      hashedPassword,
      account_id
    );
    if (updateResult) {
      req.flash('notice', 'Password updated.');
      res.status(200).redirect('/account/');
    } else {
      req.flash('notice', 'Sorry, the password update failed.');
      res.status(400).render('account/edit', {
        title: 'Edit Account',
        nav,
        errors: null,
        account_id,
      });
    }
  } catch (error) {
    console.error('Error during password update:', error);
    req.flash('notice', 'An unexpected error occurred.');
    res.status(500).render('account/edit', {
      title: 'Edit Account',
      nav,
      errors: null,
      account_id,
    });
  }
}

/* ****************************************
 *  logout user and clear the cookie
 * *************************************** */

async function accountLogout(req, res) {
  try {
    res.clearCookie('jwt');
    req.flash('success', 'You are logged out.');
    res.redirect('/');
  } catch (error) {
    console.error('Logout error:', error);
    req.flash('error', 'Logout failed. Please try again.');
    res.redirect('/');
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  processLogin,
  accountLogin,
  accountManagement,
  accountLogout,
  buildEditAccount,
  processUpdate,
  processPassword,
};
