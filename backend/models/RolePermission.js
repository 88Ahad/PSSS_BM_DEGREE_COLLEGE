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
