const express = require('express');
const createError = require('http-errors');
const routes = require('./routes/routes');

require('./utils/init_mongodb');

const app = express();
app.use(express.json());

routes(app);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      funny: "test",
      message: err.message,
    },
  });
});

require('dotenv').config({ path: `.env` });
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`Testing`);
});
