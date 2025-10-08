// এই ফাইলটি সার্ভারের এন্ট্রি পয়েন্ট।
// - `.env` থেকে কনফিগ লোড করে
// - Express অ্যাপ সেটআপ করে
// - রাউটস মাউন্ট করে
// - DB কানেকশন স্থাপনের পর সার্ভার চালায়
// (বাংলা কমেন্টস) - লক্ষ্য: দ্রুত বুঝতে পারেন সার্ভার কোথা থেকে শুরু হয়
// 📦 প্রয়োজনীয় প্যাকেজ ইমপোর্ট
const express = require('express'); // Express ফ্রেমওয়ার্ক
const mongoose = require('mongoose'); // MongoDB কানেকশন
const dotenv = require('dotenv'); // .env ফাইল থেকে কনফিগ লোড
const cors = require('cors'); // Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser'); // Cookie parsing for HttpOnly cookies
const helmet = require('helmet'); // security headers
const rateLimit = require('express-rate-limit'); // rate limiting

// 🔧 .env ফাইল লোড করা
dotenv.config();

// 🚀 Express অ্যাপ তৈরি
const app = express();

// 🔐 Middleware ব্যবহার
// CORS: allow credentials so that cookies can be sent/received
const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // dev: reflect origin; production: set FRONTEND_URL
  credentials: true,
};
app.use(cors(corsOptions)); // অন্য ডোমেইন থেকে রিকুয়েস্ট অনুমোদন (কুকি সহ)
app.use(express.json()); // JSON body পার্স করার জন্য
app.use(cookieParser()); // কুকি পড়ার জন্য
app.use(helmet()); // set secure HTTP headers

// Rate limiter: protect auth endpoints from brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// 📡 Routes ইমপোর্ট করা
const authRoutes = require('./routes/authRoutes'); // রেজিস্টার/লগইন API
const roleRoutes = require('./routes/roleRoutes'); // রোল ম্যানেজমেন্ট API

// 📦 Routes ব্যবহার করা
// Apply rate limiter to auth routes
app.use('/api/auth', authLimiter, authRoutes); // 🔐 Auth API
app.use('/api/roles', roleRoutes); // 🔐 Role API

// 🌐 Root Route (চেক করার জন্য)
app.get('/', (req, res) => {
  res.send('🎓 PSSS B.M DEGREE COLLEGE API চলছে...');
});

// 🛠️ MongoDB কানেকশন শুরু (config থেকে)
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();

    // 🚀 Server চালু করা
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server চলছে PORT ${PORT} এ`);
    });
  } catch (err) {
    console.error('❌ সার্ভার শুরু করতে ব্যর্থ:', err.message);
    process.exit(1);
  }
};

startServer();
