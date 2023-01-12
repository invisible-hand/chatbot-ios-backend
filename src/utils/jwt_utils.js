const JWT = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config({ path: `.env.local` });

module.exports = {
  signedAccessToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: '1h',
        issuer: 'we are',
        audience: userID,
      };
      JWT.sign(payload, secret, options, (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      });
    });
  },
};
