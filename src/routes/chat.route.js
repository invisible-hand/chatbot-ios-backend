const express = require('express');
const {
  message,
  topics,
  messages,
  deleteTopic,
} = require('../controllers/chat.controller');

const router = express.Router();

router.post('/message', message);

router.post('/topics', topics);

router.delete('/topic', deleteTopic);

router.post('/messages', messages);

module.exports = router;
