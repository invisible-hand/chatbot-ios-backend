const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../utils/validation_schema');
const { verifyAppleId } = require('../utils/verifyAppleToken');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt_utils');

module.exports = {
  appleAuth: async (req, res, next) => {
    try {
      const { token } = req.body;
      // const { token, email, apple_id } = req.body;
      const verifiedUser = await verifyAppleId(token);

      const { sub: apple_id, email } = verifiedUser;

      let user = await User.findOne({ apple_id });

      if (!user) {
        user = new User({ apple_id, email });
        await user.save();
      } else if (user.email !== email) {
        user.email = email;
        await user.save();
      }

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        return next(createError.BadRequest('Invalid token format'));
      }
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);

      const doesExist = await User.findOne({ email: result.email });
      if (doesExist) {
        throw createError.Conflict(`${result.email} is already registered`);
      }

      const user = new User(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id);

      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 422;
      }
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });

      if (!user) {
        throw createError.NotFound('User not registered.');
      }

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) {
        throw createError.Unauthorized('Invalid Username/Password.');
      }

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) {
        return next(createError.BadRequest('Invalid Username/Password.'));
      }
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }

      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      res.send({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createError.BadRequest();
      }

      await verifyRefreshToken(refreshToken);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};
