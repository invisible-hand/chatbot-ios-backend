const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv');

require('./utils/init_mongodb');

const AuthRoute = require('./routes/auth.route');
const ChatRoutes = require('./routes/chat.route');
const PaymentRoutes = require('./routes/payment.route');
const { verifyAccessToken } = require('./utils/jwt_utils');

dotenv.config({ path: `.env` });
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.use('/auth', AuthRoute);
app.use('/payment', verifyAccessToken, PaymentRoutes);
app.use('/chat', verifyAccessToken, ChatRoutes);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
