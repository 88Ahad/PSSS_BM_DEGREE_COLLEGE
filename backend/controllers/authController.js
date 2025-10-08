// এই কন্ট্রোলার ফাইলে রেজিস্টার ও লগইন সম্পর্কিত লজিক আছে।
// - register: নতুন ইউজার তৈরি করে এবং টোকেন রিটার্ন করে
// - login: ইমেইল/পাসওয়ার্ড যাচাই করে টোকেন রিটার্ন করে
// (বাংলা কমেন্টস) - লক্ষ্য: API আচরণ দ্রুত বুঝতে পারা
// 📁 controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');

// ✅ রেজিস্টার API
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে' });

    const user = await User.create({ fullName, email, password, role });
    const token = generateToken(user);
    // Set cookie on register as well (login the user by cookie)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('token', token, cookieOptions);
    const csrfToken = crypto.randomBytes(24).toString('hex');
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'রেজিস্টার করতে সমস্যা হয়েছে' });
  }
};

// ✅ লগইন API (optional: role validation)
exports.login = async (req, res) => {
  try {
    const { email, password, role: requestedRole } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'ইমেইল খুঁজে পাওয়া যায়নি' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'পাসওয়ার্ড সঠিক নয়' });

    // যদি ক্লায়েন্ট role পাঠায়, নিশ্চিত করি ইউজারের role এর সাথে মিলে
    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({ message: 'আপনার রোল অনুপস্থিত বা মিল নেই' });
    }

    const token = generateToken(user);

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set HttpOnly cookie (migration mode). We also return token in body for dual-mode compatibility.
    res.cookie('token', token, cookieOptions);

    // Generate a CSRF token and set as non-HttpOnly cookie so client can read and send it
    const csrfToken = crypto.randomBytes(24).toString('hex');
    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Cookie-only response: return user object only
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'লগইন করতে সমস্যা হয়েছে' });
  }
};

// Logout handler: clears the auth cookie
exports.logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };
    res.clearCookie('token', cookieOptions);
    res.json({ message: 'লগআউট সম্পন্ন হয়েছে' });
  } catch (error) {
    res.status(500).json({ message: 'লগআউট করতে সমস্যা হয়েছে' });
  }
};

// Get current user (based on token from header or HttpOnly cookie)
exports.getMe = async (req, res) => {
  try {
    // protect middleware already sets req.user if token is valid
    if (!req.user) return res.status(401).json({ message: 'অথেনটিকেশন প্রয়োজন' });
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'ব্যবহারকারী লোড করতে সমস্যা' });
  }
};
