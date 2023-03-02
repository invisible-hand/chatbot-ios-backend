const express = require('express');
const {
  appleAuth,
  register,
  login,
  refreshToken,
  logout,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/appleAuth', appleAuth);

router.post('/register', register);

router.post('/login', login);

router.post('/refresh-token', refreshToken);

router.delete('/logout', logout);

module.exports = router;
