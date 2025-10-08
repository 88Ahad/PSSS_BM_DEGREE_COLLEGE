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
