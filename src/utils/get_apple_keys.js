const axios = require('axios');

const url = 'https://appleid.apple.com/auth/keys';
const getAppleKeys = async () => {
  try {
    const { keys } = await axios.get(url);
    return keys;
  } catch (error) {
    throw error;
  }
};

module.exports = { getAppleKeys };
