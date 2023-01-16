const crypto = require('node:crypto');

const ACCESS_TOKEN_SECRET = crypto.randomBytes(128).toString('hex');
const REFRESH_TOKEN_SECRET = crypto.randomBytes(128).toString('hex');

console.table({ ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET });
