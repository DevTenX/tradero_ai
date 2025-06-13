
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                form_type: 'registration',
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            };
            
            // Basic validation
            if (!formData.name || !formData.email || !formData.phone) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.classList.add('loading');
            
            // Send data to PHP handler
            fetch('form_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Redirecting to complete your registration...');
                    if (data.redirect_url) {
                        window.location.href = data.redirect_url;
                    } else {
                        // Reset form if no redirect URL
                        registrationForm.reset();
                    }
                } else {
                    alert('Error: ' + (data.error || 'Registration failed'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Network error. Please try again.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
            });
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            const submitBtn = e.target.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Send data to PHP handler
            fetch('form_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    form_type: 'newsletter',
                    email: email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thank you for subscribing!');
                    e.target.querySelector('input[type="email"]').value = '';
                } else {
                    alert('Error: ' + (data.error || 'Subscription failed'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Network error. Please try again.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                form_type: 'contact',
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
                inquiry_type: document.getElementById('contact-inquiry-type') ? document.getElementById('contact-inquiry-type').value : 'general'
            };
            
            // Basic validation
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.classList.add('loading');
            
            // Send data to PHP handler
            fetch('form_handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fbq('track', 'Lead');
                    if (data.redirect_url) {
                        window.location.href = 'https://www.tradero-ai.com/thanks.html?redirect=' + encodeURIComponent(data.redirect_url);
                    }else{
                        window.location.href = 'https://www.tradero-ai.com/thanks.html';
                    }
                } else {
                    alert(data.error || 'Failed to send message');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Network error. Please try again.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
            }, 2000);
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 11, 15, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 11, 15, 0.95)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .feature-tile, .persona-card, .testimonial, .pricing-card').forEach(el => {
        observer.observe(el);
    });
    
    // Demo chat interaction
    const chatDemo = document.querySelector('.chat-demo');
    if (chatDemo) {
        const sampleQuestions = [
            "What's a bullish engulfing candle?",
            "Is now a good time to enter ETH?",
            "Help me build a risk-managed swing strategy.",
            "What are the key support levels for Bitcoin?",
            "How do I use RSI effectively?"
        ];
        
        const sampleAnswers = [
            "A bullish engulfing candle is a two-candle pattern where a small bearish candle is followed by a larger bullish candle that completely 'engulfs' the previous candle's body. This typically signals a potential upward price movement.",
            "Based on current technical indicators, ETH is showing mixed signals. RSI is at 45 (neutral), but we're seeing support at $2,150. Consider waiting for a break above $2,300 for confirmation or scaling in gradually.",
            "For a risk-managed swing strategy, consider: 1) Position sizing (never risk more than 2% per trade), 2) Use stop-losses at key support levels, 3) Take profits at resistance levels, 4) Use a 2:1 risk-reward ratio minimum.",
            "Bitcoin is currently showing strong support at $42,000 and $40,500. The next major support level is around $38,000. These levels are based on previous price action and volume analysis.",
            "RSI (Relative Strength Index) is most effective when combined with other indicators. Look for: RSI above 70 (potentially overbought), RSI below 30 (potentially oversold), and divergences between price and RSI for reversal signals."
        ];
        
        // Add click handlers to simulate chat interaction
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.addEventListener('click', function() {
                const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
                
                // Add new question
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user';
                userMessage.textContent = sampleQuestions[randomIndex];
                chatContainer.appendChild(userMessage);
                
                // Add typing indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'chat-message bot';
                typingIndicator.textContent = 'AI is typing...';
                chatContainer.appendChild(typingIndicator);
                
                // Scroll to bottom
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                // Replace typing indicator with actual response after delay
                setTimeout(() => {
                    typingIndicator.textContent = sampleAnswers[randomIndex];
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 1500);
            });
        }
    }
    
    // Add loading animation to chart area
    const chartArea = document.querySelector('.chart-area');
    if (chartArea) {
        setInterval(() => {
            chartArea.style.background = `linear-gradient(${Math.random() * 360}deg, #00d4ff, #0099cc)`;
        }, 3000);
    }
});

// Utility function to handle form submissions
function handleFormSubmission(formElement, successMessage, redirectUrl = null) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert(successMessage);
            
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                // Reset form
                formElement.reset();
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Add mobile menu styles dynamically
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(10, 11, 15, 0.98);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

const autologin = document.getElementById('autologin');
if (typeof autologin != "undefined" && autologin != null) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    if (redirectUrl) {
        autologin.href = redirectUrl;
        autologin.addEventListener('click', function(e) {
            e.preventDefault();
            fbq('trackCustom', 'Autologin');
            window.location.href = redirectUrl;
        })
    } else {
        autologin.style.display = 'none';
    }
}
