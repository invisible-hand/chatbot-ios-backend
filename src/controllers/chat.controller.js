const { messageSchema, topicSchema } = require('../utils/validation_schema');
const Chat = require('../models/chat.model');
const { aiRequest } = require('../utils/ai_request');
const createError = require('http-errors');
const mongoose = require('mongoose');
const {
  concatenateMessagesAndResponses,
} = require('../utils/context_compiler');

const topicRequestPrefix =
  'What is the topic of this text in 5 words maximum?: ';

module.exports = {
  message: async (req, res, next) => {
    try {
      const userId = req.payload.aud;

      const { message, topic_id } = await messageSchema.validateAsync(req.body);
      let topic = null;
      let messages = message;
      if (topic_id === null) {
        const topicRequest = `${topicRequestPrefix}${message}`;
        const rawTopic = await aiRequest(topicRequest);
        topic = rawTopic.trim();
      } else {
        const prevConversation = await Chat.getLast10Messages(userId, topic_id);
        messages = concatenateMessagesAndResponses(prevConversation, message);
      }

      const rawResponse = await aiRequest(messages);
      const response = rawResponse.trim();

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

      const topics = await Chat.find(
        { user_id: userId, topic: { $ne: null } },
        'topic_id topic -_id'
      ).sort({ topic_id: 1 });

      // Get last message and response for each topic
      const lastMessages = await Chat.find(
        { user_id: userId },
        'topic_id message response created_date'
      )
        .sort({ topic_id: 1, created_date: -1 })
        .group({
          _id: '$topic_id',
          message: { $first: '$message' },
          response: { $first: '$response' },
          created_date: { $first: '$created_date' },
        });

      // Merge topic names and last messages
      const response = topics.map((topic) => {
        const lastMessage = lastMessages.find(
          (message) => message._id.toString() === topic.topic_id.toString()
        );
        return {
          ...topic,
          message: lastMessage.message,
          response: lastMessage.response,
          created_date: lastMessage.created_date,
        };
      });

      res.json(response);
    } catch (error) {
      next(createError.InternalServerError('Failed to retrieve topics'));
    }
  },
  TEST_topics: async (req, res, next) => {
    try {
      const userId = req.payload.aud;
      const pipeline = [
        {
          $match: {
            user_id: mongoose.Types.ObjectId(userId),
            topic: { $ne: null },
          },
        },
        {
          $lookup: {
            from: 'chats',
            let: { topic_id: '$topic_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$topic_id', '$$topic_id'] },
                      { $eq: ['$user_id', mongoose.Types.ObjectId(userId)] },
                    ],
                  },
                },
              },
              {
                $sort: { created_date: -1 },
              },
              {
                $group: {
                  _id: '$topic_id',
                  message: { $first: '$message' },
                  response: { $first: '$response' },
                  created_date: { $first: '$created_date' },
                },
              },
            ],
            as: 'last_message',
          },
        },
        {
          $unwind: '$last_message',
        },
        {
          $project: {
            topic_id: 1,
            topic: 1,
            message: '$last_message.message',
            response: '$last_message.response',
            created_date: '$last_message.created_date',
          },
        },
      ];
      const topics = await Chat.aggregate(pipeline);
      res.json(topics);
    } catch (error) {
      next(createError.InternalServerError('Failed to retrieve topics'));
    }
  },
  messages: async (req, res, next) => {
    try {
      const userId = req.payload.aud;

      const isTopicBelongsToUser = await Chat.exists({
        user_id: userId,
        topic_id,
      });
      if (!isTopicBelongsToUser) {
        return next(createError.BadRequest('No such topic'));
      }

      const messages = await Chat.find(
        { user_id: userId, topic_id },
        'topic_id message message_id'
      );

      // Get last message and response for each topic
      const lastMessages = await Chat.find(
        { user_id: userId },
        'topic_id message response created_date'
      )
        .sort({ created_date: -1, topic_id: 1 })
        .group({
          _id: '$topic_id',
          message: { $first: '$message' },
          response: { $first: '$response' },
          created_date: { $first: '$created_date' },
        });

      // Merge topic names and last messages
      const response = topics.map((topic) => {
        const lastMessage = lastMessages.find(
          (message) => message._id.toString() === topic.topic_id.toString()
        );
        return {
          ...topic,
          message: lastMessage.message,
          response: lastMessage.response,
          created_date: lastMessage.created_date,
        };
      });
      res.json(messages);
    } catch (error) {
      next(createError.InternalServerError('Failed to retrieve messages'));
    }
  },
  deleteTopic: async (req, res, next) => {
    try {
      const userId = req.payload.aud;

      const { topic_id } = topicSchema.validateAsync(req.body);
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
