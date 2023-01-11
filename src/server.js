const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config({ path: `.env` });
const PORT = process.env.PORT || 3001;

const app = express();

app.get('/', async (req, res, next) => {
  res.send('under development');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
