/* ==========================================================================
   DURVA HOMEOPATHIC CLINIC - CLIENT LOGIC & INTERACTION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navigation & Header Transitions
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check


    // 2. Mobile Drawer Navigation Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        const isActive = mobileMenu.classList.contains('is-active');
        hamburgerBtn.classList.toggle('is-active');
        mobileMenu.classList.toggle('is-active');
        hamburgerBtn.setAttribute('aria-expanded', !isActive);
        
        // Prevent body scrolling when mobile menu is open
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('is-active')) {
                toggleMobileMenu();
            }
        });
    });


    // 3. FAQ Accordion Interactions
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const answer = item.querySelector('.faq-answer');

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            
            // Close other open FAQ items first (accordion style)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('is-open')) {
                    otherItem.classList.remove('is-open');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle current item
            item.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', !isOpen);
            answer.setAttribute('aria-hidden', isOpen);

            if (!isOpen) {
                // Set height to scroll height for smooth slide down
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });


    // 4. Appointment Form Validation & Submission
    const bookingForm = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');
    const successCloseBtn = document.getElementById('success-close-btn');

    // Input elements
    const nameInput = document.getElementById('patient-name');
    const phoneInput = document.getElementById('patient-phone');
    const typeSelect = document.getElementById('consultation-type');
    const dateInput = document.getElementById('appointment-date');
    const timeSelect = document.getElementById('appointment-time');

    // Error messages
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const typeError = document.getElementById('type-error');
    const dateError = document.getElementById('date-error');
    const timeError = document.getElementById('time-error');

    // Set minimum date for appointment to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Live validation helpers
    const clearError = (errorElement, inputElement) => {
        errorElement.textContent = '';
        inputElement.style.borderColor = '';
    };

    const showError = (errorElement, inputElement, message) => {
        errorElement.textContent = message;
        inputElement.style.borderColor = 'var(--error-color)';
    };

    // Remove errors on input focus and clear general error message
    const clearGeneralError = () => {
        const generalError = document.getElementById('general-error');
        if (generalError) {
            generalError.style.display = 'none';
            generalError.textContent = '';
        }
    };

    nameInput.addEventListener('input', () => {
        clearError(nameError, nameInput);
        clearGeneralError();
    });
    phoneInput.addEventListener('input', () => {
        clearError(phoneError, phoneInput);
        clearGeneralError();
    });
    typeSelect.addEventListener('change', () => {
        clearError(typeError, typeSelect);
        clearGeneralError();
    });
    dateInput.addEventListener('input', () => {
        clearError(dateError, dateInput);
        clearGeneralError();
        
        const dateVal = dateInput.value;
        if (dateVal) {
            const selectedDate = new Date(dateVal);
            if (selectedDate.getDay() === 0) {
                showError(dateError, dateInput, 'Sunday is a holiday. Please select another date.');
                dateInput.value = '';
            }
        }
    });
    timeSelect.addEventListener('change', () => {
        clearError(timeError, timeSelect);
        clearGeneralError();
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Name Validation
        const nameVal = nameInput.value.trim();
        if (nameVal.length < 2) {
            showError(nameError, nameInput, 'Please enter a valid name (at least 2 letters).');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(nameVal)) {
            showError(nameError, nameInput, 'Names can only contain alphabetical letters.');
            isValid = false;
        }

        // Phone Validation (10 digit India standard check)
        const phoneVal = phoneInput.value.trim().replace(/\s+/g, '');
        const cleanPhone = phoneVal.replace(/^[+]/, '').replace(/^91/, ''); // Strip +91 if present
        
        if (!/^\d{10}$/.test(cleanPhone)) {
            showError(phoneError, phoneInput, 'Please enter a valid 10-digit phone number.');
            isValid = false;
        }

        // Type Validation
        if (!typeSelect.value) {
            showError(typeError, typeSelect, 'Please select a consultation type.');
            isValid = false;
        }

        // Date Validation
        const dateVal = dateInput.value;
        if (!dateVal) {
            showError(dateError, dateInput, 'Please select an appointment date.');
            isValid = false;
        } else {
            const selectedDate = new Date(dateVal);
            const currentDate = new Date();
            // Reset hours for date calculation comparison
            selectedDate.setHours(0,0,0,0);
            currentDate.setHours(0,0,0,0);
            
            if (selectedDate < currentDate) {
                showError(dateError, dateInput, 'Appointment date cannot be in the past.');
                isValid = false;
            } else if (selectedDate.getDay() === 0) {
                showError(dateError, dateInput, 'Sunday is a holiday. Please select another date.');
                dateInput.value = '';
                isValid = false;
            }
        }

        // Time Validation
        if (!timeSelect.value) {
            showError(timeError, timeSelect, 'Please select a preferred time slot.');
            isValid = false;
        }

        // Form Submission Execution
        if (isValid) {
            // Disable the submit button to prevent duplicate submissions
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
            }

            // Clear general error if any
            clearGeneralError();

            // Construct WhatsApp message with ALL form fields
            const messageText = 
                `*New Appointment Request - Durva Homeopathic Clinic*\n\n` +
                `Patient Name: ${nameVal}\n` +
                `Phone: ${phoneVal}\n` +
                `Consultation Type: ${typeSelect.value}\n` +
                `Appointment Date: ${dateVal}\n` +
                `Appointment Time: ${timeSelect.value}\n` +
                `Message/Reason: ${document.getElementById('patient-message').value.trim() || "(No message provided)"}`;

            // Build properly URL-encoded WhatsApp Link targeting the clinic number
            const whatsappUrl = `https://wa.me/919773263748?text=${encodeURIComponent(messageText)}`;

            // Open WhatsApp in a new tab/window
            window.open(whatsappUrl, '_blank');

            // Display success transition overlay
            formSuccess.classList.add('is-active');
        }
    });

    successCloseBtn.addEventListener('click', () => {
        formSuccess.classList.remove('is-active');
        bookingForm.reset();
        clearGeneralError();
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Consultation Request';
        }
    });


    // 5. Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop tracking after it animates
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters fully
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }


    // 6. Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        const scrollPosition = window.scrollY + 120; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Initial check

    // 7. Google Reviews Slider
    const reviewsSlider = document.getElementById('reviews-slider');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (reviewsSlider && prevBtn && nextBtn && dotsContainer) {
        const getCardWidth = () => {
            const card = reviewsSlider.querySelector('.review-card');
            return card ? card.offsetWidth : 0;
        };

        const getGap = () => {
            // Gap is 2rem = 32px
            return 32;
        };

        // Scroll to specific index
        const scrollToReview = (index) => {
            const cardWidth = getCardWidth();
            const gap = getGap();
            reviewsSlider.scrollTo({
                left: index * (cardWidth + gap),
                behavior: 'smooth'
            });
        };

        // Prev click
        prevBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const gap = getGap();
            reviewsSlider.scrollBy({
                left: -(cardWidth + gap),
                behavior: 'smooth'
            });
        });

        // Next click
        nextBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const gap = getGap();
            reviewsSlider.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
            });
        });

        // Pagination dots setup and sync
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        // Listen to scroll to update dots
        reviewsSlider.addEventListener('scroll', () => {
            const cardWidth = getCardWidth();
            const gap = getGap();
            if (cardWidth === 0) return;
            
            // Calculate active index based on scroll position
            const scrollLeft = reviewsSlider.scrollLeft;
            const index = Math.round(scrollLeft / (cardWidth + gap));
            
            // Update dots
            dots.forEach((dot, idx) => {
                if (idx === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

        // Add click listeners to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToReview(index);
            });
        });
    }

});
