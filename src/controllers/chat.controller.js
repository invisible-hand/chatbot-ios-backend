const { messageSchema } = require('../utils/validation_schema');
const Chat = require('../models/chat.model');
const { aiRequest } = require('../utils/ai_request');
const createError = require('http-errors');
const mongoose = require('mongoose');

const topicRequestPrefix =
  'What is the topic of this text in 5 words maximum?: ';

module.exports = {
  message: async (req, res, next) => {
    const { message, topic_id } = await messageSchema.validateAsync(req.body);
    const userId = req.payload.aud;
    try {
      let topic = null;
      let messages = message;
      if (topic_id === null) {
        const topicRequest = `${topicRequestPrefix}${message}`;
        topic = await aiRequest(topicRequest);
      } else {
        console.log(message);
        messages = await Chat.getLast10Messages(userId, topic_id, message);
      }

      const response = await aiRequest(messages);

      const { _id: message_id, topic_id: topic__id } = await Chat.createChat(
        userId,
        topic_id || mongoose.Types.ObjectId(),
        topic,
        message,
        response
      );

      res.send({ message_id, topic_id: topic__id, response, topic });
    } catch (error) {
      console.log(error);
      if (error.isJoi !== true) {
        return next(createError.InternalServerError('Try again later.'));
      }
      next(error);
    }
  },
  topics: async (req, res, next) => {},
  messages: async (req, res, next) => {},
  deleteTopic: async (req, res, next) => {},
};
