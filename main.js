document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal elements gracefully using IntersectionObserver (scroll reveal)
    const revealElements = document.querySelectorAll('.animate-reveal');
    
    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px 0px -100px 0px', // trigger slightly before entering full view
        threshold: 0.05 // trigger when at least 5% is visible
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // stop observing once animated
            }
        });
    }, observerOptions);
    
    // Observe all animate-reveal elements
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Interactive 3D Parallax & Glare effect on Hero Image
    const imageWrapper = document.getElementById('hero-image-container');
    const image = document.getElementById('hero-image-img');
    const glare = document.querySelector('.hero-image-glare');

    if (imageWrapper && image && glare) {
        let isHovered = false;

        imageWrapper.addEventListener('mouseenter', () => {
            isHovered = true;
            imageWrapper.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
            image.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        imageWrapper.addEventListener('mousemove', (e) => {
            if (!isHovered) return;

            const rect = imageWrapper.getBoundingClientRect();
            
            // Mouse coordinate relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized values (-0.5 to 0.5)
            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;
            
            // Calculate tilt rotation (max 10 degrees)
            const rotateX = -(normY * 10).toFixed(2);
            const rotateY = (normX * 10).toFixed(2);
            
            // Apply 3D perspective rotation
            imageWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
            
            // Counter-translate the image slightly for dynamic parallax depth (max 10px translate)
            const translateX = -(normX * 8).toFixed(2);
            const translateY = -(normY * 8).toFixed(2);
            image.style.transform = `scale3d(1.05, 1.05, 1.05) translate3d(${translateX}px, ${translateY}px, 0)`;
            
            // Dynamic lighting glare position
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`;
        });

        imageWrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            
            // Smooth transition back to neutral state
            imageWrapper.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            image.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            imageWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            image.style.transform = 'scale3d(1, 1, 1) translate3d(0, 0, 0)';
            
            // Reset glare
            glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 80%)`;
        });
    }

    // 3. Subtle Header Scrolling State
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(240, 235, 213, 0.8)';
                header.style.backdropFilter = 'blur(8px)';
                header.style.boxShadow = '0 4px 30px rgba(30, 30, 30, 0.02)';
                header.style.padding = '1.25rem 1.5rem';
            } else {
                header.style.backgroundColor = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'none';
                header.style.padding = '2rem 1.5rem';
            }
        });
    }

    // 4. Newsletter Form Submission Handling
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email-input');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;

    if (signupForm && emailInput && formMessage && submitBtn && submitBtnText) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailValue = emailInput.value.trim();
            if (!emailValue) return;

            // Set loading state
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';
            submitBtnText.textContent = 'Subscribing...';
            formMessage.className = 'form-feedback';
            formMessage.textContent = '';

            // Simulate API request (1.2s delay)
            setTimeout(() => {
                // Reset submit button state
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
                submitBtnText.textContent = 'Subscribe';
                
                // Reset input value
                emailInput.value = '';
                
                // Show success feedback
                formMessage.className = 'form-feedback success';
                formMessage.textContent = 'Welcome. You have successfully subscribed.';
                
                // Auto-fade feedback message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                }, 5000);
            }, 1200);
        });
    }
});
