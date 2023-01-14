const { messageSchema } = require('../utils/validation_schema');
const Chat = require('../models/chat.model');
const { aiRequest } = require('../utils/ai_request');
const createError = require('http-errors');
const mongoose = require('mongoose');

const topicRequestPrefix =
  'What is the topic of this text in 5 words maximum?: ';

module.exports = {
  message: async (req, res, next) => {
    const userId = req.payload.aud;
    try {
      const { message, topic_id } = await messageSchema.validateAsync(req.body);
      let topic = null;
      let messages = message;
      if (topic_id === null) {
        const topicRequest = `${topicRequestPrefix}${message}`;
        topic = await aiRequest(topicRequest);
      } else {
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
      if (error.isJoi !== true) {
        return next(createError.InternalServerError('Try again later.'));
      }
      next(error);
    }
  },
  topics: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      console.log(userId);
      const topics = await Chat.find(
        { user_id: userId },
        'topic_id topic'
      ).distinct('topic topic_id');
      console.log(topics);
      res.json(topics);
    } catch (error) {
      next(createError.InternalServerError('Failed to retrieve topics'));
    }
  },
  messages: async (req, res, next) => {},
  deleteTopic: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const { topic_id } = req.body;
      const deleted = await Chat.deleteMany({
        topic_id: topic_id,
        user_id: userId,
      });
      if (!deleted) {
        return next(createError.NotFound('topic not found'));
      }
      res.send(`topic ${topic_id} deleted`);
    } catch (error) {
      next(createError.InternalServerError('Failed to delete topic'));
    }
  },
};
