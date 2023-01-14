const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  topic_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
    index: true,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    default: null,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

ChatSchema.statics.deleteByTopicId = function (topicId) {
  return this.deleteMany({ topic_id: topicId });
};

ChatSchema.statics.getLast10Messages = function (userId, topic_id, message) {
  return this.find({ user_id: userId, topic_id })
    .sort({ created_date: -1 })
    .limit(10)
    .select('message')
    .map((message) => `\n\nContext: ${message}`)
    .join('\n')
    .concat(`\nRequest: ${message}`);
};

ChatSchema.statics.createChat = function (
  userId,
  topicId,
  topic,
  message,
  response
) {
  const newChat = new this({
    user_id: userId,
    topic_id: topicId || new mongoose.Types.ObjectId(),
    topic,
    message,
    response,
  });
  return newChat.save();
};

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
