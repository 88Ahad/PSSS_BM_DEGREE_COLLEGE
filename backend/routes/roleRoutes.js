// এই রাউট ফাইলটি Role সম্পর্কিত API (getAll, create) মাউন্ট করে।
// (বাংলা কমেন্টস) - লক্ষ্য: রোল ম্যানেজমেন্ট এন্ডপয়েন্ট দ্রুত সনাক্ত করা
// 📁 routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const protect = require('../middleware/authMiddleware');
const csrfProtection = require('../middleware/csrfProtection');

// 🔐 রোল CRUD API
router.get('/roles', roleController.getAllRoles);
// নতুন রোল তৈরি করা হলে auth + csrf চেক করা হবে
router.post('/roles', protect, csrfProtection, roleController.createRole);

module.exports = router;
