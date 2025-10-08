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
