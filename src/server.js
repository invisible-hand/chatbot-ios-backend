const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const aiRoutes = require('./api/routes/ai');

dotenv.config({ path: `.env` });
const PORT = process.env.PORT || 3001;

const app = express();

app.use('/ai', aiRoutes);

app.get('/', async (req, res, next) => {
  res.send('under development');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
