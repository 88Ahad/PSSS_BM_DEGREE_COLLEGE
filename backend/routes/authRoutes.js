// এই রাউট ফাইলটি authentication সম্পর্কিত API (register, login) এন্ডপয়েন্ট ডিফাইন করে।
// (বাংলা কমেন্টস) - লক্ষ্য: কোন রাউট থেকে কি হ্যান্ডল করা হয় তা দ্রুত বোঝা
// 📁 routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const csrfProtection = require('../middleware/csrfProtection');

// 🔐 রেজিস্টার, লগইন ও লগআউট API
router.post('/register', register);
router.post('/login', login);
// লগআউট একটি state-changing অপারেশন — auth + csrf প্রোটেক্ট করা উচিত
router.post('/logout', protect, csrfProtection, logout);
router.get('/me', protect, getMe);

module.exports = router;
