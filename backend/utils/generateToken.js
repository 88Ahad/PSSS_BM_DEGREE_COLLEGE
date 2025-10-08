// টোকেন জেনারেটর: ইউজার অবজেক্ট থেকে JWT তৈরি করে।
// এই ফাংশনটি সার্ভারের জন্য টোকেন সাইন করে এবং রিটার্ন করে।
// (বাংলা কমেন্টস) - লক্ষ্য: কোথা থেকে টোকেন আসে বোঝা
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
