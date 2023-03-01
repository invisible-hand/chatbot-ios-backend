const express = require('express');
const router = express.Router();

router.get('/subs', async (req, res, next) => {
  res.send({
    weekly: 'com.askjoe.ChatBot.weekly',
    monthly: 'com.askjoe.ChatBot.monthly3',
  });
});

module.exports = router;
