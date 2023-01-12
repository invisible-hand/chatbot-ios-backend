const express = require('express');
const router = express.Router();

router.post('/register', (req, res, next) => {
  res.send('register route');
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
