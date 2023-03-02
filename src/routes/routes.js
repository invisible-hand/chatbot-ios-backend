// const AuthRoute = require('../routes/auth.route');
const ChatRoutes = require('../routes/chat.route');
// const PaymentRoutes = require('../routes/payment.route');
const ConstRoutes = require('../routes/const.route');
// const { verifyAccessToken } = require('../utils/jwt_utils');
// const { checkSubscription } = require('../utils/check_subscription');

module.exports = (app) => {
  app.use('/const', ConstRoutes);
  // app.use('/auth', AuthRoute);
  // app.use('/payment', verifyAccessToken, PaymentRoutes);
  app.use('/chat', /*verifyAccessToken, checkSubscription,*/ ChatRoutes);
};
