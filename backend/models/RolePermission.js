// RolePermission মডেল: Role এবং Permission এর মধ্যে many-to-many সম্পর্ক রেকর্ড করে
// এটি কোন রোলের কাছে কোন পারমিশন আছে তা সংজ্ঞায়িত করে।
// (বাংলা কমেন্টস) - লক্ষ্য: রোল-টু-পারমিশন ম্যাপিং বোঝাতে
// 📁 models/RolePermission.js
const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role', // 🔗 রোল রেফারেন্স
    required: true
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission', // 🔗 পারমিশন রেফারেন্স
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('RolePermission', rolePermissionSchema);
