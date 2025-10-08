// 📁 controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ✅ রেজিস্টার API
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে' });

    const user = await User.create({ fullName, email, password, role });
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'রেজিস্টার করতে সমস্যা হয়েছে' });
  }
};

// ✅ লগইন API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'ইমেইল খুঁজে পাওয়া যায়নি' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'পাসওয়ার্ড সঠিক নয়' });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'লগইন করতে সমস্যা হয়েছে' });
  }
};
