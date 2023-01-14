const express = require('express');
const {
  message,
  topics,
  messages,
  deleteTopic,
} = require('../controllers/chat.controller');
const { verifyAccessToken } = require('../utils/jwt_utils');

const router = express.Router();

router.post('/message', verifyAccessToken, message);

router.post('/topics', verifyAccessToken, topics);

router.delete('/topic', verifyAccessToken, deleteTopic);

router.post('/messages', verifyAccessToken, messages);

module.exports = router;
