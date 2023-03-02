const axios = require('axios');

const ORIGIN = 'https://api.openai.com';
const API_VERSION = 'v1';
const API_TYPE = 'chat';
const OPEN_AI_URL = `${ORIGIN}/${API_VERSION}/${API_TYPE}/completions`;

const requestData = {
  model: 'gpt-3.5-turbo',
};

require('dotenv').config({ path: `.env.local` });
const OPEN_AI_API_KEY = process.env.CHAT_IOS_OPENAI_API_KEY;

const requestConfig = {
  headers: {
    Authorization: `Bearer ${OPEN_AI_API_KEY}`,
    'Content-Type': 'application/json',
  },
};

const aiChatRequest = async (messages) => {
  const data = {
    model: requestData.model,
    messages,
  };
  const response = await axios.post(OPEN_AI_URL, data, requestConfig);
  return response.data.choices[0].message.content;
};

module.exports = { aiChatRequest };
