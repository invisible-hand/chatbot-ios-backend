const countWords = (str) => {
  return str.trim().split(/\s+/).length;
};
const countChars = (str) => {
  return str.length;
};

const concatenateMessagesAndResponses = (prevConversation, message) => {
  const messages = prevConversation.messages;
  const responses = prevConversation.responses;
  const res = `\nrequest: ${message}\n don't use Answer: in response`;

  let result = '';

  let wordCount = countWords(res);
  let charCount = countChars(res);
  if (wordCount >= 500 || charCount >= 2000) {
    throw new Error('message is too large');
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = `Q: ${messages[i]}`;
    const response = `A: ${responses[i]}`;
    wordCount += countWords(message) + countWords(response);
    charCount += countChars(message) + countChars(response);
    if (wordCount >= 500 || charCount >= 2000) {
      break;
    }
    result = `${message}\n${response}\n${result}`;
  }
  result += res;
  return result;
};

module.exports = { concatenateMessagesAndResponses };
