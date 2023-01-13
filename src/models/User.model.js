const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const TRIAL_PERIOD_DAYS = 7;
const TRIAL_PERIOD = TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  subscription_end_date: {
    type: Date,
    default: null,
  },
});

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

UserSchema.methods.isTrialOver = function () {
  const now = new Date();
  const trialEnd = new Date(this.created_date.getTime() + TRIAL_PERIOD);
  return now > trialEnd;
};

UserSchema.methods.isSubscriptionOver = function () {
  const now = new Date();
  return now > this.subscription_end_date;
};

UserSchema.methods.updateSubscriptionEndDate = function (newEndDate) {
  this.subscription_end_date = newEndDate;
};

const User = mongoose.model('user', UserSchema);
module.exports = User;
