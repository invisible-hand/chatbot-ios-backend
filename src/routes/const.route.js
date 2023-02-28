const express = require('express');
const router = express.Router();

router.get('/subs', async (req, res, next) => {
  res.send({
    weekly: 'com.weekly',
    monthly: 'com.monthly',
  });
});

module.exports = router;
