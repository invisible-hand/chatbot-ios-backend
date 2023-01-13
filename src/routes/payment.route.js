const express = require('express');
const { verifyPayment } = require('../controllers/payment.controller');
const { verifyAccessToken } = require('../utils/jwt_utils');

const router = express.Router();

router.post('/verify-payment', verifyAccessToken, verifyPayment);

module.exports = router;
