const JWT = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config({ path: `.env.local` });

module.exports = {
  signAccessToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.JWT_ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: '1M',
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

    const bearerToken = authHeader.split(' ');
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
      return next(createError.Unauthorized());
    }

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
  signRefreshToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.JWT_REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: '6M',
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
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        (error, payload) => {
          if (error) {
            return reject(createError.Unauthorized());
          }
          const userId = payload.aud;

          resolve(userId);
        }
      );
    });
  },
};
