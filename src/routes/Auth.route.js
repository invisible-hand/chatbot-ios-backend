const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/User.model');
const { authSchema } = require('../utils/validation_schema');

router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) {
      throw createError.Conflict(`${result.email} is already registered`);
    }
    //TODO! HASH PASSWORD!
    const user = new User(result);
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  res.send('login route');
});

router.post('/refresh-token', (req, res, next) => {
  res.send('refresh token route');
});

router.delete('/logout', (req, res, next) => {
  res.send('logout route');
});

module.exports = router;