// 📁 utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 🕒 ৭ দিনের জন্য টোকেন
  );
};

module.exports = generateToken;
