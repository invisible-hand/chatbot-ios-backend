const checkSubscription = async (userId, next) => {
  const user = await User.findById(userId);
  if (!user) {
    return next(createError.BadRequest('User not found'));
  }

  if (user.isSubscriptionOver() && user.isTrialOver()) {
    return next(createError.Forbidden('Trial and subscription has expired'));
  }
};

module.exports = { checkSubscription };
