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
        let price = 0;
        if (
          data.latest_receipt_info &&
          data.latest_receipt_info[0] &&
          data.latest_receipt_info[0].price
        ) {
          price = parseFloat(data.latest_receipt_info[0].price);
        } else {
          throw new Error('debug: no price in receipt.');
        }
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
          data.expires_date,
          price
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
  getSubscriptionInfo: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const subscriptions = await Payment.find(
        { user_id: userId },
        'purchase_date expires_date price'
      );
      if (!subscriptions) {
        throw createError.BadRequest('No subscription found');
      }
      res.json({ subscriptions });
    } catch (error) {
      next(error);
    }
  },
};
