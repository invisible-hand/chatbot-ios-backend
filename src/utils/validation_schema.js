const Joi = require('joi');
const JoiObjectId = require('joi-objectid');

Joi.objectId = JoiObjectId(Joi);

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

const messageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  topic_id: Joi.alternatives().try(Joi.objectId(), Joi.allow(null)).required(),
});

const topicSchema = Joi.object({
  topic_id: Joi.alternatives().try(Joi.objectId(), Joi.allow(null)).required(),
});

module.exports = { authSchema, messageSchema, topicSchema };
