const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv');

require('./utils/init_mongodb');

const AuthRoute = require('./routes/Auth.route');
const AiRoutes = require('./routes/Ai.route');

dotenv.config({ path: `.env` });
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.get('/', async (req, res, next) => {
  res.send('under development');
});

app.use('/auth', AuthRoute);

app.use('/ai', AiRoutes);

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
