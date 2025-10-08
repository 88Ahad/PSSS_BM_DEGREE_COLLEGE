// এই রাউট ফাইলটি authentication সম্পর্কিত API (register, login) এন্ডপয়েন্ট ডিফাইন করে।
// (বাংলা কমেন্টস) - লক্ষ্য: কোন রাউট থেকে কি হ্যান্ডল করা হয় তা দ্রুত বোঝা
// 📁 routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 🔐 রেজিস্টার ও লগইন API
router.post('/register', register);
router.post('/login', login);

module.exports = router;
