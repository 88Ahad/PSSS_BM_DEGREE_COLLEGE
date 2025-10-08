// 📁 middleware/checkPermission.js
// 🔐 রিকুয়েস্টে পারমিশন চেক করার জন্য মিডলওয়্যার
module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    const user = req.user; // 🔍 JWT থেকে ইউজার পাওয়া

    if (!user || !user.permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: '⛔ অনুমতি নেই' });
    }

    next(); // ✅ অনুমতি থাকলে পরবর্তী হ্যান্ডলারে যাওয়া
  };
};
