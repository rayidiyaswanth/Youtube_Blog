const jwt = require('jsonwebtoken');

const SECRET_KEY = "Ya$hu!00!";

function generateToken(user) {
  const payload = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl
  };
  const token = jwt.sign(payload, SECRET_KEY);
  return token;
};

function validateToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  validateToken
};