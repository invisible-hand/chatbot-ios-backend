const axios = require('axios');
const User = require('../models/user.model');
const createError = require('http-errors');
const Payment = require('../models/payment.model');
require('dotenv').config({ path: '.env.local' });

const receiptVerificationUrl = 'https://sandbox.itunes.apple.com/verifyReceipt';

module.exports = {
  verifyPayment: async (req, res, next) => {
    const userId = req.payload.aud;

    try {
      const { receiptData } = req.body;
      if (!receiptData) {
        throw createError.BadRequest('No receiptData.');
      }

      const response = await axios.post(receiptVerificationUrl, {
        'receipt-data': receiptData,
        password: process.env.APPLE_APP_STORE_CONNECT_PASSWORD,
      });

      const { data } = response;
      if (data.status === 0) {
        // Update user's subscription status
        await User.findById(userId, function (err, user) {
          user.updateSubscriptionEndDate(data.expires_date);
          user.save();
        });

        // Store payment in database
        await Payment.addPayment(
          userId,
          receiptData,
          data.transaction_id,
          data.purchase_date,
          data.expires_date
        );
        await payment.save();

        res.sendStatus(204);
      } else {
        next(createError.Forbidden());
      }
    } catch (error) {
      next(error);
    }
  },
};
