// 📦 প্রয়োজনীয় প্যাকেজ ইমপোর্ট
const express = require('express'); // Express ফ্রেমওয়ার্ক
const mongoose = require('mongoose'); // MongoDB কানেকশন
const dotenv = require('dotenv'); // .env ফাইল থেকে কনফিগ লোড
const cors = require('cors'); // Cross-Origin Resource Sharing

// 🔧 .env ফাইল লোড করা
dotenv.config();

// 🚀 Express অ্যাপ তৈরি
const app = express();

// 🔐 Middleware ব্যবহার
app.use(cors()); // অন্য ডোমেইন থেকে রিকুয়েস্ট অনুমোদন
app.use(express.json()); // JSON body পার্স করার জন্য

// 📡 Routes ইমপোর্ট করা
const authRoutes = require('./routes/authRoutes'); // রেজিস্টার/লগইন API
const roleRoutes = require('./routes/roleRoutes'); // রোল ম্যানেজমেন্ট API

// 📦 Routes ব্যবহার করা
app.use('/api/auth', authRoutes); // 🔐 Auth API
app.use('/api/roles', roleRoutes); // 🔐 Role API

// 🌐 Root Route (চেক করার জন্য)
app.get('/', (req, res) => {
  res.send('🎓 PSSS B.M DEGREE COLLEGE API চলছে...');
});

// 🛠️ MongoDB কানেকশন শুরু
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB কানেক্ট হয়েছে');

  // 🚀 Server চালু করা
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server চলছে PORT ${PORT} এ`);
  });

}).catch((err) => {
  console.error('❌ MongoDB কানেক্ট করতে সমস্যা:', err.message);
});
