const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({ path: `.env.local` });

const ORIGIN = 'https://api.openai.com';
const API_VERSION = 'v1';
const OPEN_AI_URL = `${ORIGIN}/${API_VERSION}/completions`;

const requestData = {
  model: 'text-davinci-003',
  temperature: 0.5,
  max_tokens: 3500,
};

const OPEN_AI_API_KEY = process.env.CHAT_IOS_OPENAI_API_KEY;

const requestConfig = {
  headers: {
    Authorization: `Bearer ${OPEN_AI_API_KEY}`,
    'Content-Type': 'application/json',
  },
};

const aiRequest = async (prompt, temp, maxTokens) => {
  const temperature = temp || requestData.temperature;
  const max_tokens = maxTokens || requestData.max_tokens;
  const data = {
    model: requestData.model,
    temperature,
    max_tokens,
    prompt,
  };
  const response = await axios.post(OPEN_AI_URL, data, requestConfig);
  return response.data.choices[0].text;
};

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
