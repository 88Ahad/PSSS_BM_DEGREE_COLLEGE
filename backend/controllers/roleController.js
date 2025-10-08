// এই কন্ট্রোলারটি Role সম্পর্কিত API হ্যান্ডল করে (list, create ইত্যাদি)।
// (বাংলা কমেন্টস) - লক্ষ্য: রোল ম্যানেজমেন্ট দ্রুত বোঝা
// 📁 backend/controllers/roleController.js
// 🔰 Role Controller Logic

const Role = require('../models/Role');

// ✅ সব রোল দেখানো
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: '❌ রোল লোড করতে সমস্যা হয়েছে' });
  }
};

// ✅ নতুন রোল তৈরি
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name, description });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: '❌ রোল তৈরি করতে সমস্যা হয়েছে' });
  }
};
