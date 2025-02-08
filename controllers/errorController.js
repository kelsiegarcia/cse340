const utilities = require('../utilities/');
const errorController = {};

errorController.errorHandler = async (req, res, next) => {
  // send error object to middleware

  if (req.query.status == 404) {
    next({ status: 404 });
  } else {
    next({ status: 500 });
  }
};

module.exports = errorController;
