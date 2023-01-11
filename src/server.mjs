import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: `.env` });
const PORT = process.env.PORT || 3001;

const app = express();

app.get('/', async (req, res, next) => {
  res.send('under development');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
