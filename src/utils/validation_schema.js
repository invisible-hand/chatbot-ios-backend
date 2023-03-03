const Joi = require('joi');
const JoiObjectId = require('joi-objectid');

Joi.objectId = JoiObjectId(Joi);

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

function validateStringMaxWords(maxWords) {
  return function (value) {
    const words = value.trim().split(/\s+/);
    if (words.length > maxWords) {
      return this.createError('maximum ', { maxWords }, ' is allowed.');
    }
    return value;
  };
}

const chatSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('user', 'assistant' /*, 'system'*/).required(),
        content: Joi.string().min(1).required(),
      })
    )
    .empty(),
});

const messageSchema = Joi.object({
  message: Joi.string().min(1).max(2500).custom(validateStringMaxWords(500)), //TODO! count words (up to 500)
  topic_id: Joi.alternatives().try(Joi.objectId(), Joi.allow(null)).required(),
});

const topicSchema = Joi.object({
  topic_id: Joi.alternatives().try(Joi.objectId(), Joi.allow(null)).required(),
});

module.exports = { authSchema, chatSchema, messageSchema, topicSchema };
