const express = require('express');
const { verifyPayment } = require('../controllers/payment.controller');

const router = express.Router();

router.post('/verify-payment', verifyPayment);

module.exports = router;
