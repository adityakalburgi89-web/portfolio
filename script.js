// ===== UI Theme Switcher (Three-State) =====
(function () {
    const STORAGE_KEY = 'portfolio-ui-theme';
    const themeRadios = document.querySelectorAll('input[name="theme-choice"]');

    // Read saved theme or default to 'modern'
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'modern';

    // Apply theme instantly (used on page load)
    function applyTheme(theme) {
        // Remove all potential theme classes
        document.body.classList.remove('ui-modern', 'ui-neo-brutalism', 'ui-sketch');

        // Map value to class and apply
        const themeClass = theme === 'neo-brutalism' ? 'ui-neo-brutalism' : (theme === 'sketch' ? 'ui-sketch' : 'ui-modern');
        document.body.classList.add(themeClass);

        // Reset neo image toggle when entering neo-brutalism theme
        if (theme === 'neo-brutalism') {
            const toggleContainer = document.getElementById('neo-image-toggle');
            const heroImage = document.querySelector('.hero__image');
            if (toggleContainer && heroImage) {
                heroImage.src = 'images/themePics/NeoBrutralismPIC2.png';
                const buttons = toggleContainer.querySelectorAll('.image-toggle-btn');
                buttons.forEach(btn => {
                    if (btn.getAttribute('data-image') === 'art') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        } else {
            const heroImage = document.querySelector('.hero__image');
            if (heroImage) {
                heroImage.src = 'images/adityPhoto111.jpeg';
            }
        }

        // Check the corresponding radio button
        const targetRadio = document.querySelector(`input[name="theme-choice"][value="${theme}"]`);
        if (targetRadio) targetRadio.checked = true;

        localStorage.setItem(STORAGE_KEY, theme);
    }

    // Smooth switch: fade out → swap class → fade in
    function switchTheme(theme) {
        document.body.classList.add('ui-switching');
        setTimeout(() => {
            applyTheme(theme);
            document.body.classList.remove('ui-switching');
        }, 350);
    }

    // Initialize with saved theme
    applyTheme(savedTheme);

    // Add event listeners to all theme radio buttons
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                switchTheme(e.target.value);
            }
        });
    });
})();


// ===== Mobile Navigation Toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('.section');
const header = document.getElementById('header');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150; // Offset for header height

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

    // Handle home section
    if (window.scrollY < 100) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#home') {
                link.classList.add('active');
            }
        });
    }
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== Header Shadow on Scroll =====
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
}

window.addEventListener('scroll', handleHeaderScroll);

// ===== Fade In Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and project cards
document.querySelectorAll('.section, .project__card, .experience__item, .skills__category').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Contact Form Validation =====
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName() {
    const name = nameInput.value.trim();
    if (name === '') {
        showError(nameInput, nameError, 'Name is required');
        return false;
    } else if (name.length < 2) {
        showError(nameInput, nameError, 'Name must be at least 2 characters');
        return false;
    } else {
        hideError(nameInput, nameError);
        return true;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    if (email === '') {
        showError(emailInput, emailError, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showError(emailInput, emailError, 'Please enter a valid email address');
        return false;
    } else {
        hideError(emailInput, emailError);
        return true;
    }
}

function validateMessage() {
    const message = messageInput.value.trim();
    if (message === '') {
        showError(messageInput, messageError, 'Message is required');
        return false;
    } else if (message.length < 10) {
        showError(messageInput, messageError, 'Message must be at least 10 characters');
        return false;
    } else {
        hideError(messageInput, messageError);
        return true;
    }
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(input, errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
    errorElement.textContent = '';
}

// Real-time validation
nameInput.addEventListener('blur', validateName);
nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('error')) {
        validateName();
    }
});

emailInput.addEventListener('blur', validateEmail);
emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        validateEmail();
    }
});

messageInput.addEventListener('blur', validateMessage);
messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('error')) {
        validateMessage();
    }
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isMessageValid) {
            // Form is valid - in a real application, you would send the data to a server
            // For now, we'll just show a success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();

            // Remove any error states
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('error');
            });
            [nameError, emailError, messageError].forEach(error => {
                error.classList.remove('show');
                error.textContent = '';
            });
        } else {
            // Scroll to first error
            if (!isNameValid) {
                nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nameInput.focus();
            } else if (!isEmailValid) {
                emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                emailInput.focus();
            } else if (!isMessageValid) {
                messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                messageInput.focus();
            }
        }
    });
}

// ===== Email Link Handler =====
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const email = link.getAttribute('href').replace('mailto:', '');
        // Try opening Gmail compose window as fallback
        if (!navigator.mailto) {
            e.preventDefault();
            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
        }
    });
});

// ===== Resume Download Button =====
const resumeBtn = document.getElementById('resume-btn');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real application, this would link to an actual PDF file
        // For now, we'll show a message
        alert('Resume download will be available soon. Please contact me via email for my resume.');
    });
}

// ===== Close Mobile Menu on Window Resize =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
    }
});

// ===== Initialize =====
// Set initial active nav link
updateActiveNavLink();

// Add fade-in class to hero content
const heroContent = document.querySelector('.hero__content');
if (heroContent) {
    heroContent.classList.add('fade-in', 'visible');
}

// ===== Floating Dinosaur Decorators with Auto-Chroma Keying =====
(function () {
    const video = document.getElementById('dino-raw-video');
    if (!video) return;

    // Available dinosaur dancing videos
    const DINO_VIDEOS = [
        'images/video/Pixel_art_dinosaur_dancing_Gangn…_202607042028 (1).mp4',
        'images/video/Baby_dinosaur_combat_idle_202607042119 (1).mp4',
        'images/video/Robot_dinosaur_idle_animation_202607042157 (1).mp4',
        'images/video/Pixel_art_dinosaur_scanning_motion_202607050030 (1).mp4',
        'images/video/Ninja_dinosaur_running_pixel_art_202607050043 (1).mp4',
        'images/video/Dinosaur_thinking_pixel_art_anim…_202607050051 (1).mp4'
    ];

    // Playlist shuffler queue to avoid repetitive back-to-back playback of the same video
    let videoQueue = [];
    let lastPlayedVideo = null;

    // Preload audio sound effect for egg cracking interaction
    const crackSound = new Audio('images/Sounds/Cracking.mp3');
    crackSound.preload = 'auto';

    function getNextVideo() {
        if (videoQueue.length === 0) {
            let shuffled = [...DINO_VIDEOS];
            // Fisher-Yates Shuffle
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            // Avoid back-to-back repeat of the last played video when refilling
            if (shuffled.length > 1 && shuffled[0] === lastPlayedVideo) {
                [shuffled[0], shuffled[shuffled.length - 1]] = [shuffled[shuffled.length - 1], shuffled[0]];
            }
            videoQueue = shuffled;
        }
        const next = videoQueue.shift();
        lastPlayedVideo = next;
        return next;
    }

    // Mute video to play silently, and disable looping to play only once
    video.muted = true;
    video.loop = false;

    // Automatically close decorator/pop back when video ends
    video.addEventListener('ended', () => {
        if (activeDecorator) {
            activeDecorator.closeDecorator();
        }
    });

    const decorators = document.querySelectorAll('.dino-egg-decorator');
    if (decorators.length === 0) return;

    let activeLoopId = null;
    let activeDecorator = null; // currently active popped decorator

    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

    // Chroma key default and auto-sampling state
    let keyR = 0;
    let keyG = 255;
    let keyB = 0;
    let hasSampledKeyColor = false;

    // Particle class for retro pixelated explosion
    class PixelParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 1.5; // upward bias
            this.size = Math.floor(Math.random() * 4) + 2; // 2px to 5px
            this.alpha = 1;
            this.decay = Math.random() * 0.025 + 0.015;
            // Green or white colors to match the egg
            this.color = Math.random() > 0.4 ? '#5ebd3e' : '#ffffff';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15; // gravity
            this.alpha -= this.decay;
        }

        draw(context) {
            context.save();
            context.globalAlpha = Math.max(0, this.alpha);
            context.fillStyle = this.color;
            context.fillRect(Math.round(this.x), Math.round(this.y), this.size, this.size);
            context.restore();
        }
    }

    decorators.forEach(decorator => {
        const eggBtn = decorator.querySelector('.dino-egg-btn');
        const bubble = decorator.querySelector('.dino-bubble');
        const canvas = decorator.querySelector('.dino-canvas');
        const ctx = canvas.getContext('2d');

        let particles = [];
        let state = 'egg'; // 'egg', 'popping', 'dancing'

        // Click-to-pop variables: requires 5 to 9 clicks to pop
        let clicksRequired = Math.floor(Math.random() * 5) + 5;
        let currentClicks = 0;
        let lastClickTime = 0;

        function createExplosion() {
            particles = [];
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            for (let i = 0; i < 40; i++) {
                particles.push(new PixelParticle(centerX, centerY));
            }
        }

        function closeDecorator() {
            // Immediately stop loop, pause video, and clean up active decorator
            if (activeDecorator === decorator) {
                if (activeLoopId) {
                    cancelAnimationFrame(activeLoopId);
                    activeLoopId = null;
                }
                video.pause();
                activeDecorator = null;
                hasSampledKeyColor = false;
            }

            // Clear and hide canvas
            canvas.classList.add('hidden');
            canvas.classList.remove('pop-anim');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Hide the decorator element (vanish) immediately.
            // Note: We do NOT make the egg button or bubble visible yet, so they don't flash on screen.
            decorator.classList.remove('visible');

            // Respawn this specific decorator after 10 seconds
            setTimeout(() => {
                // Reset state variables to fresh egg
                state = 'egg';
                currentClicks = 0;
                lastClickTime = 0;
                clicksRequired = Math.floor(Math.random() * 5) + 5;
                
                if (bubble) bubble.textContent = "Pop me!!";
                eggBtn.classList.remove('crack-shake');
                
                // Show the egg button and bubble inside the container
                eggBtn.classList.remove('hidden');
                bubble.classList.remove('hidden');
                
                // Fade in and drop down the decorator container
                decorator.classList.add('visible');
            }, 10000);
        }

        function runLoop() {
            if (state === 'popping') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                let activeParticles = 0;
                particles.forEach(p => {
                    p.update();
                    if (p.alpha > 0) {
                        p.draw(ctx);
                        activeParticles++;
                    }
                });

                if (activeParticles === 0) {
                    state = 'dancing';
                    video.play().catch(err => {
                        console.log("Dino video play failed: ", err);
                    });
                }
                activeLoopId = requestAnimationFrame(runLoop);
            } else if (state === 'dancing') {
                if (video.paused || video.ended) {
                    activeLoopId = requestAnimationFrame(runLoop);
                    return;
                }

                // Dynamically adjust canvas dimensions to match the video's actual aspect ratio without squeezing
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                    const targetHeight = decorator.classList.contains('decorator-left') ? 160 : 120;
                    const videoRatio = video.videoWidth / video.videoHeight;
                    const newHeight = targetHeight;
                    const newWidth = Math.round(targetHeight * videoRatio);

                    if (canvas.width !== newWidth || canvas.height !== newHeight) {
                        canvas.width = newWidth;
                        canvas.height = newHeight;
                    }
                }

                const w = canvas.width;
                const h = canvas.height;

                // Ensure offscreen size matches video dimensions
                if (offscreenCanvas.width !== video.videoWidth || offscreenCanvas.height !== video.videoHeight) {
                    offscreenCanvas.width = video.videoWidth || 300;
                    offscreenCanvas.height = video.videoHeight || 300;
                }

                // Draw video to offscreen
                offscreenCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

                // Auto-sample key color
                if (!hasSampledKeyColor && video.videoWidth > 0) {
                    const cornerPixel = offscreenCtx.getImageData(0, 0, 1, 1).data;
                    const pr = cornerPixel[0];
                    const pg = cornerPixel[1];
                    const pb = cornerPixel[2];
                    if (pg > 80 && pg > pr && pg > pb) {
                        keyR = pr;
                        keyG = pg;
                        keyB = pb;
                        hasSampledKeyColor = true;
                    }
                }

                const imgData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
                const data = imgData.data;

                // Remove green background
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];

                    const dist = Math.sqrt(
                        Math.pow(r - keyR, 2) +
                        Math.pow(g - keyG, 2) +
                        Math.pow(b - keyB, 2)
                    );

                    if (dist < 85) {
                        data[i+3] = 0;
                    }
                }

                offscreenCtx.putImageData(imgData, 0, 0);

                // Draw to onscreen canvas
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(offscreenCanvas, 0, 0, w, h);

                activeLoopId = requestAnimationFrame(runLoop);
            }
        }

        eggBtn.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime < 300) {
                return; // Throttle clicks faster than 300ms
            }
            lastClickTime = now;

            // Play cracking sound effect with low latency
            crackSound.currentTime = 0;
            crackSound.play().catch(err => console.log('Audio playback failed:', err));

            // Close any active decorator first
            if (activeDecorator && activeDecorator !== decorator) {
                activeDecorator.closeDecorator();
            }

            currentClicks++;

            if (currentClicks < clicksRequired) {
                // Play shake animation by triggering reflow
                eggBtn.classList.remove('crack-shake');
                void eggBtn.offsetWidth; // trigger reflow
                eggBtn.classList.add('crack-shake');

                // Update speech bubble text to show cracking progress
                const remaining = clicksRequired - currentClicks;
                if (remaining >= 5) {
                    bubble.textContent = "Click more!!";
                } else if (remaining >= 3) {
                    bubble.textContent = "Cracking...";
                } else if (remaining >= 1) {
                    bubble.textContent = "Almost!!";
                }
                return;
            }

            // Reset shake class and pop it!
            eggBtn.classList.remove('crack-shake');
            eggBtn.classList.add('hidden');
            bubble.classList.add('hidden');
            canvas.classList.remove('hidden');
            canvas.classList.add('pop-anim');

            state = 'popping';
            activeDecorator = decorator;
            createExplosion();
            
            // Get next video from shuffled playlist and reset auto-sampling
            video.src = getNextVideo();
            hasSampledKeyColor = false;
            
            video.load();
            runLoop();
        });



        // Expose closeDecorator method on the element
        decorator.closeDecorator = closeDecorator;
    });
})();

// ===== Neo Brutalism Image Toggle =====
(function () {
    const toggleContainer = document.getElementById('neo-image-toggle');
    const heroImage = document.querySelector('.hero__image');

    if (toggleContainer && heroImage) {
        // Image map for the 4 states
        // Preload all theme images to prevent transition flickering
        const allImages = [
            'images/themePics/NeoBrutralismPIC.png',
            'images/themePics/NeoBrutralismPIC2.png',
            'images/themePics/NeoBrutralismPIC3.png',
            'images/adityPhoto111.jpeg'
        ];
        allImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        // Preload glitch audio from images directory
        const glitchSound = new Audio('images/glitch.aac');
        glitchSound.preload = 'auto';

        const buttons = toggleContainer.querySelectorAll('.image-toggle-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                const imgType = btn.getAttribute('data-image');
                const finalSrc = imgType === 'photo' 
                    ? 'images/adityPhoto111.jpeg' 
                    : 'images/themePics/NeoBrutralismPIC2.png';

                // Remove active class from all buttons and set it on the clicked one
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Play glitch sound
                glitchSound.currentTime = 0;
                glitchSound.play().catch(err => console.log('Audio playback failed:', err));

                // Add visual glitch class
                heroImage.classList.add('glitch-active');

                // Rapid Multi-Frame Glitch Sequence (flickers through the other images)
                setTimeout(() => {
                    heroImage.src = 'images/themePics/NeoBrutralismPIC.png';
                }, 75);

                setTimeout(() => {
                    heroImage.src = 'images/themePics/NeoBrutralismPIC3.png';
                }, 150);

                setTimeout(() => {
                    heroImage.src = finalSrc;
                }, 225);

                // Remove glitch effect after animation completes (300ms)
                setTimeout(() => {
                    heroImage.classList.remove('glitch-active');
                }, 300);
            });
        });
    }
})();


// ===== Retro Dope Wars Game Logic =====
(function () {
    const gameState = {
        cash: 1200,
        inventory: {
            COCAINE: 10,
            HEROIN: 5,
            WEED: 50,
            ACID: 0,
            SPEED: 5,
            LUDES: 0
        },
        prices: {
            COCAINE: 150,
            HEROIN: 80,
            WEED: 10,
            ACID: 120,
            SPEED: 30,
            LUDES: 5
        },
        basePrices: {
            COCAINE: 150,
            HEROIN: 80,
            WEED: 10,
            ACID: 120,
            SPEED: 30,
            LUDES: 5
        },
        selectedDrug: "COCAINE",
        currentDate: new Date(1994, 1, 4), // Feb 4, 1994
        repaymentDate: new Date(1994, 1, 7), // Feb 7, 1994
        currentCity: "MANHATTAN",
        hoursElapsed: 9 // Clock starts at 9:00 (represented by hoursElapsed = 9)
    };

    const monthNames = ["FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = "FEB"; // Pinning to Feb 1994 for simplicity, or we can use monthNames
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function updateUI(customMessage) {
        // Cash
        const cashValEl = document.getElementById('game-cash');
        if (cashValEl) cashValEl.textContent = gameState.cash;

        // Inventory & Weight
        let totalWeight = 0;
        for (const [drug, qty] of Object.entries(gameState.inventory)) {
            totalWeight += qty;
            const qtyEl = document.getElementById(`inv-qty-${drug}`);
            if (qtyEl) qtyEl.textContent = `${qty}g`;
        }

        const weightEl = document.getElementById('game-weight');
        if (weightEl) weightEl.textContent = `${totalWeight} / 100g`;

        // Active selection pill
        const activePillEl = document.getElementById('game-active-drug');
        if (activePillEl) activePillEl.textContent = gameState.selectedDrug;

        // Dialogue text
        const dialogueEl = document.getElementById('game-dialogue-msg');
        if (dialogueEl) {
            if (customMessage) {
                dialogueEl.textContent = customMessage;
            } else {
                const currentPrice = gameState.prices[gameState.selectedDrug];
                dialogueEl.textContent = `"I've got some good stuff. ${gameState.selectedDrug} is going for $${currentPrice}/g. What do you want?"`;
            }
        }

        // Active selection in list
        const drugItems = document.querySelectorAll('.game-drug-item');
        drugItems.forEach(item => {
            if (item.getAttribute('data-drug') === gameState.selectedDrug) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Dates
        const todayDateEl = document.getElementById('game-today-date');
        const repayDateEl = document.getElementById('game-repay-date');
        if (todayDateEl) todayDateEl.textContent = formatDate(gameState.currentDate);
        if (repayDateEl) repayDateEl.textContent = formatDate(gameState.repaymentDate);

        // Clock hands
        const hourHand = document.getElementById('clock-hour-hand');
        const minHand = document.getElementById('clock-minute-hand');
        if (hourHand && minHand) {
            const hourAngle = (gameState.hoursElapsed % 12) * 30; // 30 deg per hour
            const minAngle = 0; // Fixed minute hand (9:00, 12:00 etc)
            hourHand.setAttribute('transform', `rotate(${hourAngle}, 50, 50)`);
            minHand.setAttribute('transform', `rotate(${minAngle}, 50, 50)`);
        }
    }

    function getSelectedWeight() {
        let weight = 0;
        for (const qty of Object.values(gameState.inventory)) {
            weight += qty;
        }
        return weight;
    }

    function initGame() {
        const drugItems = document.querySelectorAll('.game-drug-item');
        drugItems.forEach(item => {
            item.addEventListener('click', () => {
                gameState.selectedDrug = item.getAttribute('data-drug');
                updateUI();
            });
        });

        const invItems = document.querySelectorAll('.game-inventory-item');
        invItems.forEach(item => {
            item.addEventListener('click', () => {
                gameState.selectedDrug = item.getAttribute('data-drug-name');
                updateUI();
            });
        });

        const buyBtn = document.getElementById('game-buy-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                const drug = gameState.selectedDrug;
                const price = gameState.prices[drug];
                const totalWeight = getSelectedWeight();

                if (gameState.cash < price) {
                    updateUI(`"You don't have enough cash, kid."`);
                } else if (totalWeight >= 100) {
                    updateUI(`"Your pockets are full! You can't carry any more."`);
                } else {
                    gameState.cash -= price;
                    gameState.inventory[drug]++;
                    updateUI(`"Good deal. Anything else?"`);
                }
            });
        }

        const sellBtn = document.getElementById('game-sell-btn');
        if (sellBtn) {
            sellBtn.addEventListener('click', () => {
                const drug = gameState.selectedDrug;
                const price = gameState.prices[drug];

                if (gameState.inventory[drug] <= 0) {
                    updateUI(`"You can't sell what you don't have."`);
                } else {
                    gameState.cash += price;
                    gameState.inventory[drug]--;
                    updateUI(`"Thanks for the stuff. Need anything else?"`);
                }
            });
        }

        const travelBtns = document.querySelectorAll('.game-travel-btn');
        travelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const city = btn.getAttribute('data-city');
                gameState.currentCity = city;

                // Advance Date
                gameState.currentDate.setDate(gameState.currentDate.getDate() + 1);

                // Fluctuates prices
                for (const drug of Object.keys(gameState.prices)) {
                    const base = gameState.basePrices[drug];
                    const multiplier = 0.5 + Math.random() * 1.0; // 50% to 150%
                    gameState.prices[drug] = Math.max(1, Math.round(base * multiplier));
                }

                // Advance clock by 3 hours
                gameState.hoursElapsed = (gameState.hoursElapsed + 3) % 12;

                // Check loan shark repayment
                let loanMsg = "";
                if (gameState.currentDate >= gameState.repaymentDate) {
                    const repaymentAmount = 500;
                    gameState.cash = Math.max(0, gameState.cash - repaymentAmount);
                    
                    // Set next repayment to current date + 3 days
                    const nextRepay = new Date(gameState.currentDate);
                    nextRepay.setDate(nextRepay.getDate() + 3);
                    gameState.repaymentDate = nextRepay;
                    
                    loanMsg = ` Loan shark took $${repaymentAmount}!`;
                }

                updateUI(`"Arrived in ${city}. Local prices shifted!${loanMsg}"`);
            });
        });

        updateUI();
    }

    // Initialize game once DOM is loaded or script runs
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
})();



