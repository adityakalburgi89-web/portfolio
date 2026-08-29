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

        // Stop Ravan BGM immediately if leaving Sketch / Ravan UI
        if (theme !== 'sketch') {
            const ravanBgm = document.getElementById('ravan-bgm-player');
            const bgmToggleBtn = document.getElementById('ravan-bgm-toggle');
            if (ravanBgm && !ravanBgm.paused) {
                ravanBgm.pause();
                ravanBgm.currentTime = 0;
            }
            if (bgmToggleBtn) {
                bgmToggleBtn.classList.remove('playing');
            }
        }
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

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
// Let browser handle native mailto: URLs cleanly without blocking

// ===== Mobile Navigation & Resize Handlers =====
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

// ===== RAVAN FOLK-ART UI INTERACTIVITY =====
(function () {
    const weaponData = {
        trishul: {
            title: "TRISHUL SPEAR",
            domain: "",
            img: "images/SimpleAssets/weapons/trishul-spear.png",
            text: ""
        },
        khanda: {
            title: "KHANDA SWORD",
            domain: "",
            img: "images/SimpleAssets/weapons/khanda-sword.png",
            text: ""
        },
        shield: {
            title: "DHAL SHIELD",
            domain: "",
            img: "images/SimpleAssets/weapons/dhal-shield.png",
            text: ""
        },
        bow: {
            title: "BOW OF AGNI",
            domain: "",
            img: "images/SimpleAssets/weapons/bow-arrow-crossed.png",
            text: ""
        },
        axe: {
            title: "PARASHU AXE",
            domain: "",
            img: "images/SimpleAssets/weapons/parashu-axe.png",
            text: ""
        },
        hammer: {
            title: "WAR HAMMER",
            domain: "",
            img: "images/SimpleAssets/weapons/war-hammer.png",
            text: ""
        },
        chakram: {
            title: "SUDARSHANA CHAKRAM",
            domain: "",
            img: "images/SimpleAssets/weapons/chakram.png",
            text: ""
        },
        katar: {
            title: "KATAR DAGGER",
            domain: "",
            img: "images/SimpleAssets/weapons/katar.png",
            text: ""
        }
    };

    function initRavanUI() {
        const weaponCards = document.querySelectorAll('.ravan-weapon-card');
        const modal = document.getElementById('ravan-weapon-modal');
        const modalClose = document.getElementById('ravan-modal-close');
        const modalImg = document.getElementById('ravan-modal-img');
        const modalTitle = document.getElementById('ravan-modal-title');
        const modalDomain = document.getElementById('ravan-modal-domain');
        const modalBody = document.getElementById('ravan-modal-body');

        if (!modal) return;

        weaponCards.forEach(card => {
            card.addEventListener('click', () => {
                const key = card.getAttribute('data-weapon');
                const data = weaponData[key];
                if (data) {
                    modalImg.src = data.img;
                    modalTitle.textContent = data.title;
                    if (modalDomain) modalDomain.style.display = data.domain ? 'block' : 'none';
                    if (modalBody) modalBody.style.display = data.text ? 'block' : 'none';
                    modal.classList.add('active');
                }
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Form submission listener for Ravan UI contact form
        const ravanForm = document.getElementById('ravan-contact-form');
        if (ravanForm) {
            ravanForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('⚡ Your scroll has been sent successfully to Aditya Kalburgi!');
                ravanForm.reset();
            });
        }

        // Section-Aware BGM Controller (Strictly Scoped to Sketch/Ravan UI Theme)
        const ravanBgm = document.getElementById('ravan-bgm-player');
        const bgmToggleBtn = document.getElementById('ravan-bgm-toggle');

        if (bgmToggleBtn && ravanBgm) {
            let isUserEnabled = false;
            let fadeInterval = null;

            const isSketchActive = () => document.body.classList.contains('ui-sketch');

            const fadePlayerVolume = (player, targetVol, durationMs = 1000) => {
                return new Promise((resolve) => {
                    if (!player) {
                        resolve();
                        return;
                    }
                    if (fadeInterval) {
                        clearInterval(fadeInterval);
                    }

                    const startVol = player.volume;
                    const steps = 30;
                    const stepTime = durationMs / steps;
                    const volStep = (targetVol - startVol) / steps;
                    let currentStep = 0;

                    const interval = setInterval(() => {
                        currentStep++;
                        let nextVol = player.volume + volStep;
                        if (nextVol > 1) nextVol = 1;
                        if (nextVol < 0) nextVol = 0;
                        player.volume = nextVol;

                        if (currentStep >= steps) {
                            clearInterval(interval);
                            fadeInterval = null;
                            player.volume = targetVol;
                            resolve();
                        }
                    }, stepTime);

                    fadeInterval = interval;
                });
            };

            const isPastArsenal = () => {
                const arsenalSec = document.getElementById('ravan-arsenal');
                if (!arsenalSec) return false;
                const rect = arsenalSec.getBoundingClientRect();
                return rect.bottom <= 50;
            };

            const stopAudioWithFade = async () => {
                bgmToggleBtn.classList.remove('playing');
                await fadePlayerVolume(ravanBgm, 0, 800);
                ravanBgm.pause();
                ravanBgm.currentTime = 0;
            };

            const playAudioWithFade = () => {
                if (!isSketchActive()) return;
                if (isPastArsenal()) return;
                bgmToggleBtn.classList.add('playing');
                ravanBgm.volume = 0;
                ravanBgm.play().then(() => {
                    fadePlayerVolume(ravanBgm, 1, 1000);
                }).catch(err => {
                    console.log('BGM playback waiting for user interaction:', err);
                });
            };

            bgmToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isSketchActive()) return;
                if (isUserEnabled && !ravanBgm.paused) {
                    isUserEnabled = false;
                    stopAudioWithFade();
                } else {
                    isUserEnabled = true;
                    playAudioWithFade();
                }
            });

            // Stop immediately if theme changes to modern or neo-brutalism
            window.addEventListener('themechange', (e) => {
                if (e.detail && e.detail.theme !== 'sketch') {
                    isUserEnabled = false;
                    stopAudioWithFade();
                }
            });

            // Auto-pause/resume when scrolling past arsenal ONLY when in Sketch theme
            window.addEventListener('scroll', () => {
                if (!isSketchActive() || !isUserEnabled) return;
                if (isPastArsenal()) {
                    if (!ravanBgm.paused) {
                        stopAudioWithFade();
                    }
                } else {
                    if (ravanBgm.paused) {
                        playAudioWithFade();
                    }
                }
            }, { passive: true });
        }

        // Dark Mode Background Toggle for r2_c6.png Button
        const darkToggleBtn = document.getElementById('ravan-dark-toggle-btn');
        if (darkToggleBtn) {
            darkToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.body.classList.toggle('ravan-dramatic-dark');
            });
        }

        // Mandala Ring Smooth Fade-In / Fade-Out Toggle for r2_c4.png Button
        const mandalaToggleBtn = document.getElementById('ravan-mandala-toggle-btn');
        if (mandalaToggleBtn) {
            mandalaToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mandalas = document.querySelectorAll('.nataraja-layer-folk-mandala, .ravan-mandala-disc');
                mandalas.forEach(m => {
                    m.classList.toggle('ravan-hidden-fade');
                });
            });
        }

        // Shiva Avatar Swap Toggle for r2_c5.png Button
        const shivaToggleBtn = document.getElementById('ravan-shiva-toggle-btn');
        const natarajaCharImg = document.getElementById('nataraja-character-img');
        if (shivaToggleBtn && natarajaCharImg) {
            const originalSrc = 'images/SimpleAssets/nataraja-separated-elements/01-nataraja-character.png';
            const shivaSrc = 'images/SimpleAssets/nataraja-separated-elements/Shiva_Nataraja_Transparent.png';

            // Preload Shiva avatar
            const preShiva = new Image();
            preShiva.src = shivaSrc;

            shivaToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                natarajaCharImg.classList.add('avatar-fade');
                setTimeout(() => {
                    if (natarajaCharImg.getAttribute('data-is-shiva') === 'true') {
                        natarajaCharImg.src = originalSrc;
                        natarajaCharImg.setAttribute('data-is-shiva', 'false');
                        shivaToggleBtn.classList.remove('is-shiva');
                    } else {
                        natarajaCharImg.src = shivaSrc;
                        natarajaCharImg.setAttribute('data-is-shiva', 'true');
                        shivaToggleBtn.classList.add('is-shiva');
                    }
                    natarajaCharImg.classList.remove('avatar-fade');
                }, 220);
            });
        }

        // Interactive Bharatanatyam Dance Toggle for r2_c7.png Button
        const danceToggleBtn = document.getElementById('ravan-dance-toggle-btn');
        const dancerImg = document.getElementById('nataraja-dancer-img');
        if (danceToggleBtn && dancerImg) {
            const danceFrames = [
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/00-original-dance-pose.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/01-araimandi-natyarambha.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/02-anjali-samapada.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/03-natta-adavu.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/04-kuditta-mettu.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/05-alidha-lunge.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/06-mandi-kneeling-pose.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/07-tatta-adavu-preparation.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/08-visharu-diagonal-step.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/09-pushpaputa-offering.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/10-swastika-crossed-stance.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/11-utsanga-embrace.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/12-shikhara-archer.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/13-mayura-peacock-balance.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/14-bhramari-turning-pose.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/15-alapadma-blossom.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/16-korvai-finishing-pose.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/17-tribhanga-curve.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/18-kartarimukha-separation.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/19-kunchita-foot-stamp.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/20-garuda-wing-stance.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/21-gaja-hasta.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/22-chakra-turning-step.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/23-pataka-command.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/24-sarpashirsha-serpentine.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/25-veera-kneeling-lunge.png',
                'images/SimpleAssets/nataraja-separated-elements/bharatanatyam-dance-steps/26-overhead-anjali-finish.png'
            ];

            // Preload all 27 frames for instant smooth animation
            danceFrames.forEach(src => {
                const img = new Image();
                img.src = src;
            });

            let currentFrameIndex = 0;

            danceToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentFrameIndex = (currentFrameIndex + 1) % danceFrames.length;
                dancerImg.src = danceFrames[currentFrameIndex];
                
                // Add quick visual click feedback animation
                danceToggleBtn.classList.add('is-clicked');
                setTimeout(() => danceToggleBtn.classList.remove('is-clicked'), 250);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRavanUI);
    } else {
        initRavanUI();
    }
})();

// ===== Neo-Brutalism Face Image Toggle (Glitch UI) =====
(function () {
    const toggleContainer = document.getElementById('neo-image-toggle');
    const heroImage = document.querySelector('.hero__image');

    if (toggleContainer && heroImage) {
        let glitchSound = null;
        const getGlitchSound = () => {
            if (!glitchSound) {
                glitchSound = new Audio('images/glitch.aac');
                glitchSound.preload = 'none';
            }
            return glitchSound;
        };

        const buttons = toggleContainer.querySelectorAll('.image-toggle-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (btn.classList.contains('active')) return;

                // Play glitch sound on-demand
                const sound = getGlitchSound();
                sound.currentTime = 0;
                sound.play().catch(err => console.log('Audio playback waiting for interaction:', err));

                // Add visual glitch animation class
                heroImage.classList.add('glitch-active');
                setTimeout(() => {
                    heroImage.classList.remove('glitch-active');
                }, 300);

                // Update active state on toggle buttons
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle between art and real image
                const imageType = btn.getAttribute('data-image');
                if (imageType === 'art') {
                    heroImage.src = 'images/themePics/NeoBrutralismPIC2.png';
                } else {
                    heroImage.src = 'images/adityPhoto111.jpeg';
                }
            });
        });
    }
})();

// ===== Interactive Dinosaur Egg Decorators (Egg Pop, Particles & Chroma-Key Dancing Dino) =====
(function () {
    const video = document.getElementById('dino-raw-video');
    if (!video) return;

    // Available dinosaur dancing videos
    const DINO_VIDEOS = [
        'images/video/Pixel_art_dinosaur_dancing_Gangn._202607042028 (1).mp4',
        'images/video/Baby_dinosaur_combat_idle_202607042119 (1).mp4',
        'images/video/Robot_dinosaur_idle_animation_202607042157 (1).mp4',
        'images/video/Pixel_art_dinosaur_scanning_motion_202607050030 (1).mp4',
        'images/video/Ninja_dinosaur_running_pixel_art_202607050043 (1).mp4',
        'images/video/Dinosaur_thinking_pixel_art_anim._202607050051 (1).mp4'
    ];

    let videoQueue = [];
    let lastPlayedVideo = null;

    let crackSound = null;
    const getCrackSound = () => {
        if (!crackSound) {
            crackSound = new Audio('.vscode/Music/Shake sound.mp3');
            crackSound.preload = 'none';
        }
        return crackSound;
    };

    function getNextVideo() {
        if (videoQueue.length === 0) {
            let shuffled = [...DINO_VIDEOS];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            if (shuffled.length > 1 && shuffled[0] === lastPlayedVideo) {
                [shuffled[0], shuffled[shuffled.length - 1]] = [shuffled[shuffled.length - 1], shuffled[0]];
            }
            videoQueue = shuffled;
        }
        const next = videoQueue.shift();
        lastPlayedVideo = next;
        return next;
    }

    video.muted = true;
    video.loop = false;

    const decorators = document.querySelectorAll('.dino-egg-decorator');
    if (decorators.length === 0) return;

    let activeLoopId = null;
    let activeDecorator = null;

    // Automatically close decorator when video ends
    video.addEventListener('ended', () => {
        if (activeDecorator) {
            activeDecorator.closeDecorator();
        }
    });

    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

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
            this.vy = Math.sin(angle) * speed - 1.5;
            this.size = Math.floor(Math.random() * 4) + 2;
            this.alpha = 1;
            this.decay = Math.random() * 0.025 + 0.015;
            this.color = Math.random() > 0.4 ? '#5ebd3e' : '#ffffff';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15;
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
        if (!eggBtn || !canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let state = 'egg';

        let clicksRequired = Math.floor(Math.random() * 4) + 3; // 3 to 6 clicks to pop
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
            if (activeDecorator === decorator) {
                if (activeLoopId) {
                    cancelAnimationFrame(activeLoopId);
                    activeLoopId = null;
                }
                video.pause();
                activeDecorator = null;
                hasSampledKeyColor = false;
            }

            canvas.classList.add('hidden');
            canvas.classList.remove('pop-anim');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            decorator.classList.remove('visible');

            setTimeout(() => {
                state = 'egg';
                currentClicks = 0;
                lastClickTime = 0;
                clicksRequired = Math.floor(Math.random() * 4) + 3;

                if (bubble) bubble.textContent = "Pop me!!";
                eggBtn.classList.remove('crack-shake');

                eggBtn.classList.remove('hidden');
                if (bubble) bubble.classList.remove('hidden');

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

                if (offscreenCanvas.width !== video.videoWidth || offscreenCanvas.height !== video.videoHeight) {
                    offscreenCanvas.width = video.videoWidth || 300;
                    offscreenCanvas.height = video.videoHeight || 300;
                }

                offscreenCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

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

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    const dist = Math.sqrt(
                        Math.pow(r - keyR, 2) +
                        Math.pow(g - keyG, 2) +
                        Math.pow(b - keyB, 2)
                    );

                    if (dist < 85) {
                        data[i + 3] = 0;
                    }
                }

                offscreenCtx.putImageData(imgData, 0, 0);

                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(offscreenCanvas, 0, 0, w, h);

                activeLoopId = requestAnimationFrame(runLoop);
            }
        }

        eggBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const now = Date.now();
            if (now - lastClickTime < 200) {
                return;
            }
            lastClickTime = now;
            const sound = getCrackSound();
            sound.currentTime = 0;
            sound.play().catch(err => console.log('Audio playback failed:', err));

            if (activeDecorator && activeDecorator !== decorator) {
                activeDecorator.closeDecorator();
            }

            currentClicks++;

            if (currentClicks < clicksRequired) {
                eggBtn.classList.remove('crack-shake');
                void eggBtn.offsetWidth;
                eggBtn.classList.add('crack-shake');

                const remaining = clicksRequired - currentClicks;
                if (bubble) {
                    if (remaining >= 4) {
                        bubble.textContent = "Click more!!";
                    } else if (remaining >= 2) {
                        bubble.textContent = "Cracking...";
                    } else if (remaining >= 1) {
                        bubble.textContent = "Almost!!";
                    }
                }
                return;
            }

            eggBtn.classList.remove('crack-shake');
            eggBtn.classList.add('hidden');
            if (bubble) bubble.classList.add('hidden');
            canvas.classList.remove('hidden');
            canvas.classList.add('pop-anim');

            state = 'popping';
            activeDecorator = decorator;
            createExplosion();

            video.src = getNextVideo();
            hasSampledKeyColor = false;

            video.load();
            runLoop();
        });

        canvas.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state === 'dancing') {
                closeDecorator();
            }
        });

        decorator.closeDecorator = closeDecorator;
    });
})();



