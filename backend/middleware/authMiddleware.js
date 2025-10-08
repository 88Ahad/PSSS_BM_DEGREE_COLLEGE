// এই মিডলওয়্যারটি অনুরোধের Authorization হেডার থেকে JWT টোকেন নিয়ে
// তা ভেরিফাই করে এবং `req.user`-এ ইউজারের ডাটাকে সেট করে।
// ব্যবহার: router.get('/protected', protect, handler)
// (বাংলা কমেন্টস) - লক্ষ্য: অ্যাক্সেস কন্ট্রোল সহজ করে তোলা
// 📁 middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // প্রথমে Authorization header পরীক্ষা করি
  let token = req.headers.authorization?.split(' ')[1];

  // যদি header না থাকে, তখন HttpOnly cookie থেকে টোকেন নেওয়া হবে (migration mode)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ message: 'টোকেন অনুপস্থিত' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'টোকেন অবৈধ' });
  }
};

module.exports = protect;
