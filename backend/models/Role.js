// Role মডেল: বিভিন্ন রোল (super-admin, admin, teacher, ...) সংরক্ষণ করে
// প্রতিটি রোলের নাম ও বর্ণনা থাকে।
// (বাংলা কমেন্টস) - লক্ষ্য: রোল তালিকা কোথায় সংরক্ষিত হয় জানানো
// 📁 models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 🔍 রোলের নাম আবশ্যক
    unique: true
  },
  description: {
    type: String // 📝 রোলের সংক্ষিপ্ত বিবরণ
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
