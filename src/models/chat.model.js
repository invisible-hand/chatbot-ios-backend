// const mongoose = require('mongoose');

// const ChatSchema = new mongoose.Schema({
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true,
//   },
//   topic_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: mongoose.Types.ObjectId,
//     index: true,
//     required: true,
//   },
//   topic: {
//     type: String,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   response: {
//     type: String,
//     default: null,
//   },
//   created_date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// ChatSchema.pre('validate', async function (next) {
//   if (this.topic_id === null) {
//     this.schema
//       .path('topic')
//       .required(true, 'Topic is required for first message');
//   }
//   next();
// });

// ChatSchema.statics.deleteByTopicId = function (topicId) {
//   return this.deleteMany({ topic_id: topicId });
// };

// ChatSchema.statics.getLast10Messages = async function (userId, topic_id) {
//   const messages = await this.find({ user_id: userId, topic_id })
//     .sort({ created_date: 1 })
//     .limit(10)
//     .select('message response');
//   return {
//     messages: messages.map((m) => m.message),
//     responses: messages.map((m) => m.response),
//   };
// };

// ChatSchema.statics.createChat = function (
//   userId,
//   topicId,
//   topic,
//   message,
//   response
// ) {
//   const chatData = {
//     user_id: userId,
//     topic_id: topicId || new mongoose.Types.ObjectId(),
//     message,
//     response,
//   };
//   if (topic) {
//     chatData.topic = topic;
//   }
//   const newChat = new this(chatData);
//   return newChat.save();
// };

// const Chat = mongoose.model('Chat', ChatSchema);

// module.exports = Chat;
