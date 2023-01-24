const express = require('express');
const {
  verifyPayment,
  getSubscriptionInfo,
} = require('../controllers/payment.controller');

const router = express.Router();

router.post('/verify-payment', verifyPayment);
router.post('/payment-info', getSubscriptionInfo);

module.exports = router;
