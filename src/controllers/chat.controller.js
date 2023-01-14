const { messageSchema } = require('../utils/validation_schema');
const Chat = require('../models/chat.model');
const { aiRequest } = require('../utils/ai_request');
const createError = require('http-errors');

const topicRequestPrefix =
  'What is the topic of this text in 5 words maximum?: ';

module.exports = {
  message: async (req, res, next) => {
    console.log('in message000');
    const { message, topic_id } = req.body; //await messageSchema.validateAsync(req.body);
    console.log('in message001');
    const userId = req.payload.aud;
    console.log('in message002');
    try {
      let topic = null;
      let messages = message;
      if (topic_id === null) {
        const topicRequest = `${topicRequestPrefix}${message}`;
        topic = await aiRequest(topicRequest);
      } else {
        messages = await Chat.getLast10Messages(userId, topic_id, message);
      }

      console.log('before request');
      console.log('messages:' + messages);
      const response = await aiRequest(messages);

      console.log('after request');
      console.log('response: ' + response);
      const { _id: message_id, topic_id: topic__id } = await Chat.createChat({
        user_id: userId,
        topic_id,
        topic,
        message,
        response,
      });

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
