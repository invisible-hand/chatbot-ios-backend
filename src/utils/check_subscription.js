const createError = require('http-errors');
const User = require('../models/user.model');

function checkSubscription(req, res, next) {
  const userId = req.payload.aud;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(createError.BadRequest('User not found'));
      }

      if (user.isSubscriptionOver() && user.isTrialOver()) {
        return next(
          createError.Forbidden('Trial and subscription has expired')
        );
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      next(createError.InternalServerError(error.message));
    });
}

module.exports = { checkSubscription };
