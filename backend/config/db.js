
// এই ফাইলটি MongoDB কানেকশন পরিচালনার জন্য।
// এখানে `connectDB()` এক্সপোর্ট করা হয়েছে যা সার্ভার স্টার্ট করার আগে DB-তে কানেক্ট করে।
// (বাংলা কমেন্টস) - লক্ষ্য: DB কানেকশন এক স্থানে রাখা এবং error handling সরল করা।
// 📁 backend/config/db.js
// MongoDB কানেকশন লজিক এখানে রাখা হয়েছে যাতে server.js লজিক পরিষ্কার থাকে
const mongoose = require('mongoose');

const connectDB = async () => {
	const mongoUri = process.env.MONGO_URI;
	if (!mongoUri) {
		throw new Error('MONGO_URI environment variable is not defined');
	}

	try {
		await mongoose.connect(mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('✅ MongoDB কানেক্ট হয়েছে (config/db.js)');
	} catch (err) {
		console.error('❌ MongoDB কানেক্ট করতে সমস্যা (config/db.js):', err.message);
		throw err;
	}
};

module.exports = connectDB;
