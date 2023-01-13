const axios = require('axios');
const { verifyAccessToken } = require('../utils/jwt_utils');
const User = require('../models/User.model');
const createError = require('http-errors');
const Payment = require('../models/Payment.model');
require('dotenv').config({ path: '.env.local' });

const receiptVerificationUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';

module.exports = {
  verifyPayment: async (req, res, next) => {
    try {
      const { accessToken } = req.body;
      const userId = await verifyAccessToken(accessToken);

      const { receiptData } = req.body;

      const response = await axios.post(receiptVerificationUrl, {
        receiptData,
        password: process.env.APPLE_APP_STORE_CONNECT_PASSWORD,
      });

      const { data } = response;
      if (data.status === 0) {
        // Store payment in database
        const payment = new Payment({
          user_id: userId,
          receipt_data,
          transaction_id: data.transaction_id,
          purchase_date: data.purchase_date,
          expires_date: data.expires_date,
        });
        await payment.save();

        // Update user's subscription status
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'active',
          expiresDate: data.expires_date,
        });
        // Return access token with updated expiration time
        const accessToken = await signAccessToken(userId, expiresDate);
        // Return refresh token with one year expiration
        const refreshToken = await signRefreshToken(userId);
        res.status(200).json({ accessToken, refreshToken });
      } else {
        next(createError.Forbidden());
      }
    } catch (error) {
      next(error);
    }
  },
};
