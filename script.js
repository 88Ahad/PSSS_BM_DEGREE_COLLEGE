// DOM কন্টেন্ট লোড হওয়ার পর এই স্ক্রিপ্ট রান হবে
document.addEventListener('DOMContentLoaded', function() {
    // রোল সিলেকশন ফাংশনালিটি
    const roles = document.querySelectorAll('.role');
    let selectedRole = 'super-admin'; // ডিফল্ট সিলেক্টেড রোল
    
    // প্রতিটি রোলের জন্য ইভেন্ট লিসেনার যোগ করা
    roles.forEach(role => {
        role.addEventListener('click', () => {
            // রোল নাম এবং ডেটা পাওয়া
            const roleData = role.getAttribute('data-role');
            const roleName = getRoleDisplayName(roleData);
            
            // নিশ্চিতকরণ ডায়ালগ দেখানো
            const confirmed = confirm(`আপনি কি "${roleName}" হিসেবে সাইনআপ করতে চান?\n\nএটি আপনাকে সংশ্লিষ্ট সাইনআপ পেইজে নিয়ে যাবে।`);
            
            if (confirmed) {
                // সব রোল থেকে active ক্লাস রিমুভ করা
                roles.forEach(r => r.classList.remove('active'));
                
                // ক্লিক করা রোলে active ক্লাস যোগ করা
                role.classList.add('active');
                
                // সিলেক্টেড রোল আপডেট করা
                selectedRole = roleData;
                
                // কনসোলে দেখানো (ডেভেলপমেন্টের জন্য)
                console.log('নির্বাচিত ভূমিকা:', roleName);
                
                // লোডিং ইফেক্ট দেখানো
                role.style.transform = 'scale(0.95)';
                role.style.opacity = '0.7';
                
                // সফল মেসেজ দেখানো
                showSuccessMessage(`${roleName} নির্বাচিত হয়েছে! সাইনআপ পেইজে নিয়ে যাওয়া হচ্ছে...`);
                
                // ২ সেকেন্ড পর সাইনআপ পেইজে রিডাইরেক্ট
                setTimeout(() => {
                    // রোল অনুযায়ী সাইনআপ পেইজে পাঠানো
                    redirectToSignupPage(selectedRole);
                }, 1000);
            }
        });
    });
    
    // ফর্ম সাবমিশন হ্যান্ডলিং
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // ডিফল্ট ফর্ম সাবমিশন বন্ধ করা
        
        // ইনপুট ফিল্ড থেকে ভ্যালু নেওয়া
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // ভ্যালিডেশন চেক
        if (!email || !password) {
            showAlert('দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন', 'error');
            return;
        }
        
        // ইমেইল ভ্যালিডেশন
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showAlert('দয়া করে একটি বৈধ ইমেইল এড্রেস লিখুন', 'error');
            return;
        }
        
        // পাসওয়ার্ড ভ্যালিডেশন (কমপক্ষে ৬ ক্যারেক্টার)
        if (password.length < 6) {
            showAlert('পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার দীর্ঘ হতে হবে', 'error');
            return;
        }
        
        // লগইন Attempt (প্রকৃত অ্যাপ্লিকেশনে, আপনি সার্ভারে ডেটা পাঠাবেন)
        console.log('লগইন Attempt:', { 
            email, 
            password: '•••••••', // সিকিউরিটির জন্য পাসওয়ার্ড দেখানো হচ্ছে না
            rememberMe, 
            role: selectedRole 
        });
        
        // লগইন বাটনে লোডিং স্টেট দেখানো
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> লগইন হচ্ছে...';
        loginBtn.disabled = true;
        
        // সিমুলেটেড লগইন প্রসেস (প্রকৃত অ্যাপ্লিকেশনে AJAX রিকুয়েস্ট হবে)
        setTimeout(() => {
            // সাকসেস মেসেজ দেখানো
            showAlert(`সফলভাবে লগইন করা হয়েছে! ${getRoleDisplayName(selectedRole)} হিসেবে রিডাইরেক্ট করা হচ্ছে...`, 'success');
            
            // বাটন স্টেট রিসেট করা
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            
            // প্রকৃত অ্যাপ্লিকেশনে, আপনি ব্যবহারকারীকে সংশ্লিষ্ট ড্যাশবোর্ডে রিডাইরেক্ট করবেন
            // window.location.href = `/dashboard?role=${selectedRole}`;
        }, 1500);
    });
    
    // ফরগট পাসওয়ার্ড লিঙ্কের জন্য ইভেন্ট
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('পাসওয়ার্ড রিসেট লিঙ্ক পেতে আপনার ইমেইল এড্রেস লিখুন:');
        if (email) {
            // ইমেইল ভ্যালিডেশন
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showAlert('দয়া করে একটি বৈধ ইমেইল এড্রেস লিখুন', 'error');
                return;
            }
            
            showAlert(`${email} এ একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে।`, 'success');
            console.log('পাসওয়ার্ড রিসেট requested for:', email);
        }
    });
    
    // সুন্দর অ্যালার্ট ফাংশন (alert() এর পরিবর্তে)
    function showAlert(message, type = 'info') {
        // একটি কাস্টম নোটিফিকেশন তৈরি করা
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // নোটিফিকেশন স্টাইল
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        // টাইপ অনুযায়ী রং সেট করা
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
        }
        
        // DOM-এ যোগ করা
        document.body.appendChild(notification);
        
        // অ্যানিমেশন
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 4 সেকেন্ড পর সরিয়ে ফেলা
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // সফল মেসেজ দেখানো ফাংশন
    function showSuccessMessage(message) {
        showAlert(message, 'success');
    }
    
    // রোল অনুযায়ী সাইনআপ পেইজে রিডাইরেক্ট করার ফাংশন
    function redirectToSignupPage(role) {
        // রোল অনুযায়ী বিভিন্ন সাইনআপ পেইজে নিয়ে যাওয়া
        const signupPages = {
        'super-admin': 'super-admin-signup.html',
        'admin': 'admin-signup.html',
        'teacher': 'teacher-signup.html', 
        'parents': 'parents-signup.html',
        'accountant': 'accountant-signup.html',
        'receptionist': 'receptionist-signup.html',
        'librarian': 'librarian-signup.html',
        'student': 'student-signup.html'
    };

    const targetPage = signupPages[role];

    if (targetPage) {
        // ✅ লোকেশন অনুযায়ী path
            // রোল নাম পাওয়া
            const roleName = getRoleDisplayName(role);
            console.log(`${roleName} এর সাইনআপ পেইজে রিডাইরেক্ট করা হচ্ছে: ${targetPage}`);
            
            // নির্দিষ্ট সাইনআপ পেইজে নিয়ে যাওয়া
           window.location.href = `frontend/signup/${targetPage}`;
        } else {
            // যদি নির্দিষ্ট পেইজ না থাকে, তাহলে জেনেরিক সাইনআপ পেইজে নিয়ে যাওয়া
            console.log(`জেনেরিক সাইনআপ পেইজে রিডাইরেক্ট: signup.html?role=${role}`);
            window.location.href = `frontend/signup/signup.html?role=${role}`;
        }
    }
    
    // রোল নাম বাংলায় রূপান্তর ফাংশন
    function getRoleDisplayName(role) {
        const roleNames = {
            'super-admin': 'সুপার অ্যাডমিন',
            'admin': 'অ্যাডমিন',
            'teacher': 'শিক্ষক',
            'parents': 'প্যারেন্টস',
            'accountant': 'অ্যাকাউন্টেন্ট',
            'receptionist': 'রিসেপশনিস্ট',
            'librarian': 'লাইব্রেরিয়ান',
            'student': 'ছাত্র'
        };
        return roleNames[role] || role;
    }
});