const crypto = require('node:crypto');

const key1 = crypto.randomBytes(128).toString('hex');
const key2 = crypto.randomBytes(128).toString('hex');

console.table({ key1, key2 });
