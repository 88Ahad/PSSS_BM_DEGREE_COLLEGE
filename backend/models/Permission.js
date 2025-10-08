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
