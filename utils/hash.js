const crypto = require('crypto');

function hashedPassword(pwd) {
  const hashed = crypto.createHash('sha256').update(pwd)
  return hashed.digest('hex');
}

module.exports = hashedPassword;