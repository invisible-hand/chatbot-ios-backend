const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { authSchema } = require('./validation_schema');
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
          return reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return next(createError.Unauthorized());
    }

    const bearerToken = authSchema.split(' ');
    const token = bearerToken[1];
    JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, payload) => {
      if (error) {
        const message =
          error.name === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },
};
