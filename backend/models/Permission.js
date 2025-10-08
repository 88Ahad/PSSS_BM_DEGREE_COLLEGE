// Permission মডেল: সিস্টেমে ব্যবহার করা পারমিশনের নাম ও মডিউল সংরক্ষণ করে
// উদাহরণ: 'user:create', 'report:view' ইত্যাদি
// (বাংলা কমেন্টস) - লক্ষ্য: কোন পারমিশন গুলো আছে তা দ্রুত বোঝা
// 📁 models/Permission.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 🔐 পারমিশনের নাম আবশ্যক
    unique: true
  },
  module: {
    type: String // 🧩 কোন মডিউলের পারমিশন
  }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
