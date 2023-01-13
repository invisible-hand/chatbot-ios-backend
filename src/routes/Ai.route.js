const express = require('express');
const { aiRequest } = require('../utils/ai_request');

const router = express.Router();
router.post('/prompt', async (req, res, next) => {
  /// get previous prompts
  /// add them as context
  /// then send as new prompt
  try {
    const aiResponse = await aiRequest('do you have a name?');

    res.status(200).json({
      message: aiResponse,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
