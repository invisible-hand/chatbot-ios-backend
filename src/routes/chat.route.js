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

router.post('/topics', topics);

router.delete('/topic', deleteTopic);

router.post('/messages', messages);

module.exports = router;
