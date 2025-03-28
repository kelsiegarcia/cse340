const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

router.get('/login', utilities.handleErrors(accountController.buildLogin));

router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);

// POST request for registering a new account
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagement)
);

router.get('/logout', utilities.handleErrors(accountController.accountLogout));

router.get(
  '/edit/:account_id',
  utilities.handleErrors(accountController.buildEditAccount)
);

router.post(
  '/update/:account_id',
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.processUpdate)
);

// Process the password update request
router.post(
  '/update-password/:account_id',
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.processPassword)
);

module.exports = router;
