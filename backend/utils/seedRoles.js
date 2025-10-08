// 📁 utils/seedRoles.js
// 🔰 প্রাথমিক রোল ও পারমিশন সিস্টেম সিড করা
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const seedRoles = async () => {
  const roles = ['super-admin', 'admin', 'teacher', 'accountant', 'librarian', 'receptionist', 'parents', 'student'];
  const permissions = ['dashboard:view', 'user:create', 'user:edit', 'user:delete', 'report:view'];

  for (let roleName of roles) {
    await Role.updateOne({ name: roleName }, { name: roleName }, { upsert: true });
  }

  for (let permName of permissions) {
    await Permission.updateOne({ name: permName }, { name: permName }, { upsert: true });
  }

  console.log('✅ রোল ও পারমিশন সিড সম্পন্ন হয়েছে');
};

module.exports = seedRoles;
