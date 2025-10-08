// এই ফাইলটি সকল signup পেজের জন্য একটি একক JavaScript ক্লাস সরবরাহ করে।
// মূল কাজসমূহ:
// - মাল্টি-স্টেপ ফর্ম নিয়ন্ত্রণ
// - ফিল্ড ভ্যালিডেশন
// - পাসওয়ার্ড স্ট্রেংথ ও টগল
// - ফর্ম সাবমিশন (simulate/real)
// (বাংলা কমেন্টস) - লক্ষ্য: signup UI ও logic দ্রুত বোঝা

// Unified JavaScript for all signup pages

class UnifiedSignup {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = this.getTotalSteps();
        this.formData = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressBar();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
        this.setupFormValidation();
        this.addAnimationStyles(); // যোগ করুন
    }

    getTotalSteps() {
        const sections = document.querySelectorAll('.form-section');
        return sections.length;
    }

    setupEventListeners() {
        // Navigation buttons
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => this.handleSubmit(e));
        }

        // Form validation on input
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateNavigationButtons();
            this.updateProgressBar();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateNavigationButtons();
            this.updateProgressBar();
        }
    }

    showStep(step) {
        // Hide all steps
        const sections = document.querySelectorAll('.form-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show current step
        const currentSection = document.querySelector(`[data-step="${step}"]`);
        if (currentSection) {
            currentSection.classList.add('active');
            currentSection.classList.add('fade-in');
        }

        // Update step counter
        const stepCounter = document.getElementById('currentStep');
        if (stepCounter) {
            stepCounter.textContent = step;
        }
    }

    updateNavigationButtons() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const submitBtn = document.getElementById('submitBtn');

        // Show/hide previous button
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        }

        // Show/hide next and submit buttons
        if (this.currentStep === this.totalSteps) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) submitBtn.style.display = 'flex';
        } else {
            if (nextBtn) nextBtn.style.display = 'flex';
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progressPercentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }
    }

    validateCurrentStep() {
        const currentSection = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentSection) return false;

        const requiredInputs = currentSection.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'এই ফিল্ডটি পূরণ করা আবশ্যক';
            isValid = false;
        }

        // Specific field validations
        switch (fieldId) {
            case 'fullName':
                if (value && value.length < 2) {
                    errorMessage = 'নাম কমপক্ষে ২ অক্ষর হতে হবে';
                    isValid = false;
                }
                break;

            case 'phone':
            case 'guardianPhone':
                // নম্বর থেকে dash, স্পেস, ইত্যাদি রিমুভ করুন
                let rawValue = value.replace(/[-\s]/g, '');
                // বাংলা সংখ্যা থাকলে ইংরেজি সংখ্যায় রূপান্তর
                const banglaToEnglish = s => s.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
                rawValue = banglaToEnglish(rawValue);

                const phonePattern = /^(\+?88)?01[3-9][0-9]{8}$/;
                if (rawValue && !phonePattern.test(rawValue)) {
                    isValid = false;
                    errorMessage = 'ফোন নম্বর সঠিক নয়';
                }
                break;

            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailPattern.test(value)) {
                    errorMessage = 'সঠিক ইমেইল ঠিকানা দিন';
                    isValid = false;
                }
                break;

            case 'nidNumber':
                if (value && (value.length < 10 || value.length > 17)) {
                    errorMessage = 'জাতীয় পরিচয়পত্র নম্বর ১০-১৭ সংখ্যার হতে হবে';
                    isValid = false;
                }
                break;

            case 'password':
                if (value && value.length < 8) {
                    errorMessage = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে';
                    isValid = false;
                }
                break;

            case 'confirmPassword':
                const password = document.getElementById('password');
                if (password && value !== password.value) {
                    errorMessage = 'পাসওয়ার্ড মিলছে না';
                    isValid = false;
                }
                break;

            case 'rollNumber':
            case 'childRoll':
                if (value && (parseInt(value) < 1 || parseInt(value) > 400)) {
                    errorMessage = 'রোল নম্বর ১-৪০০ এর মধ্যে হতে হবে';
                    isValid = false;
                }
                break;

            case 'terms':
                if (field.type === 'checkbox' && !field.checked) {
                    errorMessage = 'শর্তাবলী গ্রহণ করতে হবে';
                    isValid = false;
                }
                break;
        }

        // Employee ID validation for different roles
        if (fieldId.includes('Id') && fieldId !== 'nidNumber') {
            if (value && value.length < 5) {
                errorMessage = 'আইডি কমপক্ষে ৫ অক্ষর হতে হবে';
                isValid = false;
            }
        }
        if (fieldId === 'studentId' && value) {
            const pattern = /^[0-9]{6,}$/;
            if (!pattern.test(value)) {
                isValid = false;
                errorMessage = 'ছাত্র আইডি সঠিক নয় (কমপক্ষে ৬ সংখ্যা)';
            }
        }
        if (fieldId === 'teacherId' && value) {
            const pattern = /^[A-Z]{2}\d{4}$/;
            if (!pattern.test(value)) {
                isValid = false;
                errorMessage = 'শিক্ষক আইডি সঠিক নয় (উদাহরণ: TC1234)';
            }
        }

        // Show error message
        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        field.style.borderColor = '#ef4444';
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(field) {
        field.style.borderColor = '#e5e7eb';
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const passwordField = button.closest('.form-group').querySelector('input[type="password"], input[type="text"]');
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    button.classList.remove('fa-eye');
                    button.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    button.classList.remove('fa-eye-slash');
                    button.classList.add('fa-eye');
                }
            });
        });
    }

    setupPasswordStrength() {
        const passwordField = document.getElementById('password');
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (passwordField && strengthBars.length > 0) {
            passwordField.addEventListener('input', () => {
                const password = passwordField.value;
                const strength = this.calculatePasswordStrength(password);
                
                // Reset all bars
                strengthBars.forEach(bar => {
                    bar.className = 'strength-bar';
                });

                // Update strength indicator
                let strengthLabel = 'দুর্বল';
                let strengthClass = 'weak';

                if (strength >= 4) {
                    strengthLabel = 'খুব শক্তিশালী';
                    strengthClass = 'strong';
                } else if (strength >= 3) {
                    strengthLabel = 'শক্তিশালী';
                    strengthClass = 'strong';
                } else if (strength >= 2) {
                    strengthLabel = 'মাঝারি';
                    strengthClass = 'medium';
                }

                // Fill bars based on strength
                for (let i = 0; i < Math.min(strength, strengthBars.length); i++) {
                    strengthBars[i].classList.add(strengthClass);
                }

                if (strengthText) {
                    strengthText.textContent = `পাসওয়ার্ড শক্তি: ${strengthLabel}`;
                }
            });
        }
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return Math.min(strength, 4);
    }

    setupFormValidation() {
        const form = document.getElementById('signupForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
    }

    collectFormData() {
        const inputs = document.querySelectorAll('input, select');
        const data = {};
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                data[input.id] = input.checked;
            } else {
                data[input.id] = input.value.trim();
            }
        });

        // Add role information from hidden input
        const roleInput = document.getElementById('role');
        if (roleInput) {
            data.role = roleInput.value;
        }

        return data;
    }

    getRole() {
        const roleInput = document.getElementById('role');
        if (roleInput) return roleInput.value;
        return null;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        for (let step = 1; step <= this.totalSteps; step++) {
            const section = document.querySelector(`[data-step="${step}"]`);
            const requiredInputs = section.querySelectorAll('input[required], select[required]');
            
            requiredInputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
        }

        if (!isFormValid) {
            this.showMessage('দয়া করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন', 'error');
            return;
        }

        // Show loading state
        this.showLoading(true);

        try {
            const formData = this.collectFormData();
            
            // Simulate API call
            await this.simulateRegistration(formData);
            
            this.showMessage('সফলভাবে নিবন্ধন সম্পন্ন হয়েছে! আপনার অ্যাকাউন্ট তৈরি হয়েছে।', 'success');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 2000);

        } catch (error) {
            this.showMessage('নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    simulateRegistration(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(data);
                } else {
                    reject(new Error('Registration failed'));
                }
            }, 2000);
        });
    }

    showLoading(show) {
        const container = document.querySelector('.container');
        const submitBtn = document.getElementById('submitBtn');
        
        if (show) {
            container.classList.add('loading');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> নিবন্ধন করা হচ্ছে...';
            }
        } else {
            container.classList.remove('loading');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> একাউন্ট তৈরি করুন';
            }
        }
    }

    showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        if (type === 'success') {
            messageDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            messageDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }

    // Format phone number as user types
    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 5) {
                value = value.replace(/(\d{5})/, '$1');
            } else if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            } else {
                value = value.replace(/(\d{5})(\d{3})(\d{3})/, '$1-$2-$3');
            }
        }
        input.value = value;
    }

    // Add animation styles
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the signup system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnifiedSignup();
    
    // Format phone numbers on input
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Simple phone formatting for Bangladeshi numbers
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    this.value = value;
                } else if (value.length <= 6) {
                    this.value = value.replace(/(\d{3})(\d+)/, '$1-$2');
                } else {
                    this.value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
                }
            }
        });
    });

    // Auto-focus first input
    const firstInput = document.querySelector('.form-section.active input');
    if (firstInput) {
        firstInput.focus();
    }
});