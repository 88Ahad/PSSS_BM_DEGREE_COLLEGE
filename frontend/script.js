// এই ফাইলটি লগইন ফর্মের সাথে ইন্টারঅ্যাক্ট করে:
// - ফর্ম সাবমিশন হ্যান্ডল করে
// - নির্বাচনকৃত রোল ও ইউজারক্রেডেনশিয়াল সার্ভারে পাঠায়
// - সফল হলে টোকেন সেভ করে এবং রোল অনুযায়ী রিডাইরেক্ট করে
// (বাংলা কমেন্টস) - লক্ষ্য: ফ্রন্টএন্ড লগইন ফ্লো দ্রুত বোঝা
// 📁 frontend/script.js
// 🔐 Login Form API Integration

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const selectedRole = document.querySelector('.role.active')?.getAttribute('data-role');

    // ✅ ফর্ম ভ্যালিডেশন
    if (!email || !password || !selectedRole) {
      showAlert('ইমেইল, পাসওয়ার্ড এবং রোল নির্বাচন করুন', 'error');
      return;
    }

    try {
      // 🔗 API কল
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.message || 'লগইন ব্যর্থ হয়েছে', 'error');
        return;
      }

      // ✅ সফল লগইন
      showAlert(`স্বাগতম ${data.user.fullName}!`, 'success');

      // 🔐 JWT টোকেন সংরক্ষণ
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      // 🔀 রোল অনুযায়ী রিডাইরেক্ট
      setTimeout(() => {
        window.location.href = `/dashboard/${data.user.role}.html`;
      }, 1500);

    } catch (error) {
      showAlert('সার্ভার এরর! আবার চেষ্টা করুন।', 'error');
    }
  });
});
