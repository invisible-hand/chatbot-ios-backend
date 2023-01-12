const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `.env.local` });
const mongoUser = process.env.MONGO_USER || '';
const mongoPassword = process.env.MONGO_PASSWORD || '';
const mongoURL = process.env.MONGO_URL || '';

mongoose.set('strictQuery', true);
mongoose
  .connect(`mongodb+srv://${mongoUser}:${mongoPassword}@${mongoURL}`)
  .catch((error) => console.error(error.message));

mongoose.connection.on('connected', () => {
  console.log('Connected to mongoDB instance.');
});

mongoose.connection.on('error', (error) => {
  console.error(error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from mongoDB instance.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
