// User মডেল: ইউজারের নাম, ইমেইল, পাসওয়ার্ড এবং role সংরক্ষণ করে।
// পাসওয়ার্ড সেভ করার আগে হ্যাশ করা হয় এবং `matchPassword` মেথড দিয়ে যাচাই করা যায়।
// (বাংলা কমেন্টস) - লক্ষ্য: ডাটাবেইজ স্কিমা দ্রুত বোঝা
// 📁 models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true // 🔍 পূর্ণ নাম আবশ্যক
  },
  email: {
    type: String,
    required: true,
    unique: true // 📧 ইমেইল ইউনিক হতে হবে
  },
  password: {
    type: String,
    required: true // 🔐 পাসওয়ার্ড আবশ্যক
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'teacher', 'accountant', 'librarian', 'receptionist', 'parents', 'student'],
    default: 'student' // 🎓 ডিফল্ট রোল
  }
}, { timestamps: true });

// 🔐 পাসওয়ার্ড হ্যাশ করার জন্য pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔍 পাসওয়ার্ড যাচাই ফাংশন
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
