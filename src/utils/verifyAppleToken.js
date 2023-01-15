const { JWKS, JWT } = require('jose');
const { getAppleKeys } = require('./get_apple_keys');

const verifyAppleId = async (token) => {
  try {
    const keys = await getAppleKeys();
    const key = JWKS.asKeyStore(keys);

    const verified = JWT.verify(token, key);
    if (!verified) {
      throw new Error('Invalid token');
    }
    return verified;
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyAppleId };
