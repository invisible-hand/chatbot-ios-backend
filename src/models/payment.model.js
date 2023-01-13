const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  receipt_data: {
    type: String,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  purchase_date: {
    type: Date,
    required: true,
  },
  expires_date: {
    type: Date,
    required: true,
  },
});

PaymentSchema.statics.addPayment = async function (
  userId,
  receiptData,
  transactionId,
  purchaseDate,
  expiresDate
) {
  const payment = new this({
    user_id: userId,
    receipt_data: receiptData,
    transaction_id: transactionId,
    purchase_date: purchaseDate,
    expires_date: expiresDate,
  });

  return payment.save();
};

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
