const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const messageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  topic_id: Joi.alternatives().try(Joi.string(), Joi.allow(null)).required(),
});

module.exports = { authSchema, messageSchema };
