// এই মিডলওয়্যারটি রিকুয়েস্টে থাকা `req.user` থেকে পারমিশন চেক করে।
// ব্যবহার: router.get('/x', protect, checkPermission('perm:name'), handler)
// যদি ইউজারের পারমিশন না থাকে, 403 রিটার্ন করে।
// (বাংলা কমেন্টস) - লক্ষ্য: রোল/পারমিশন যাচাই স্থানে করা
// 📁 middleware/checkPermission.js
// 🔐 রিকুয়েস্টে পারমিশন চেক করার জন্য মিডলওয়্যার
module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    const user = req.user; // 🔍 JWT থেকে ইউজার পাওয়া

    // Null-safe checks: user এবং permissions অ্যারে যাচাই
    if (!user) {
      return res.status(401).json({ message: 'টোকেন বা ইউজার তথ্য অনুপস্থিত' });
    }

    const permissions = user.permissions;
    if (!Array.isArray(permissions) || !permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: '⛔ অনুমতি নেই' });
    }

    next(); // ✅ অনুমতি থাকলে পরবর্তী হ্যান্ডলারে যাওয়া
  };
};
