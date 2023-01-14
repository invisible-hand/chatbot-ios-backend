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

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
