/** ============================================
 * iHeartTheatre - Magic Effects JavaScript
 * Phase 1: Visual Theatre Magic
 * ============================================ */

// ============================================
// Curtain Reveal System
// ============================================
const CurtainSystem = {
    init() {
        this.createCurtain();
        this.openCurtain();
    },

    createCurtain() {
        const curtain = document.createElement('div');
        curtain.className = 'curtain-reveal';
        curtain.innerHTML = `
            <div class="curtain-left"></div>
            <div class="curtain-right"></div>
        `;
        document.body.appendChild(curtain);
        
        // Store reference
        this.curtain = curtain;
    },

    openCurtain() {
        // Small delay for dramatic effect
        setTimeout(() => {
            this.curtain.classList.add('open');
            
            // Remove after animation
            setTimeout(() => {
                this.curtain.remove();
            }, 1200);
        }, 300);
    },

    // Manual trigger for scene changes
    closeAndOpen(callback) {
        const curtain = document.createElement('div');
        curtain.className = 'curtain-reveal';
        curtain.innerHTML = `
            <div class="curtain-left"></div>
            <div class="curtain-right"></div>
        `;
        document.body.appendChild(curtain);
        
        // Force reflow
        curtain.offsetHeight;
        
        // Close first
        curtain.classList.add('open');
        
        setTimeout(() => {
            if (callback) callback();
            
            // Reopen
            curtain.classList.remove('open');
            
            setTimeout(() => {
                curtain.remove();
            }, 1200);
        }, 600);
    }
};

// ============================================
// Spotlight Cursor Effect
// ============================================
const SpotlightSystem = {
    init() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.createOverlay();
        this.bindEvents();
    },

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'spotlight-overlay';
        document.body.appendChild(overlay);
        this.overlay = overlay;
        
        // Activate after a moment
        setTimeout(() => overlay.classList.add('active'), 1000);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
        });
    }
};

// ============================================
// Floating Theatre Emojis
// ============================================
const FloatingEmojiSystem = {
    emojis: ['🎭', '🎪', '🎨', '🎼', '🎬', '🎫', '🎟️', '🎵', '🎶', '🎤'],
    
    init() {
        this.bindScrollEvents();
    },

    bindScrollEvents() {
        let lastScroll = 0;
        let emojiCount = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const scrollDelta = currentScroll - lastScroll;
            
            // Create emoji on significant scroll
            if (Math.abs(scrollDelta) > 100 && emojiCount < 3) {
                this.createEmoji();
                emojiCount++;
                
                // Reset counter after delay
                setTimeout(() => emojiCount--, 2000);
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    },

    createEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        emoji.style.left = Math.random() * 80 + 10 + '%';
        emoji.style.bottom = '0';
        emoji.style.animationDuration = (3 + Math.random() * 2) + 's';
        
        document.body.appendChild(emoji);
        
        // Cleanup
        setTimeout(() => emoji.remove(), 5000);
    },

    // Manual trigger
    burst(count = 10) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createEmoji(), i * 100);
        }
    }
};

// ============================================
// Typewriter Effect
// ============================================
const TypewriterSystem = {
    init() {
        const elements = document.querySelectorAll('[data-typewriter]');
        elements.forEach(el => this.typewrite(el));
    },

    typewrite(element) {
        const text = element.textContent;
        element.textContent = '';
        element.classList.add('typewriter-text');
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        };
        
        // Start when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    }
};

// ============================================
// Magic Wand Cursor Trail
// ============================================
const SparkleSystem = {
    colors: ['gold', 'purple'],
    lastX: 0,
    lastY: 0,
    
    init() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            const distance = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);
            
            // Create sparkle every 20px of movement
            if (distance > 20) {
                this.createSparkle(e.clientX, e.clientY);
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        });
    },

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle ' + this.colors[Math.floor(Math.random() * this.colors.length)];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
};

// ============================================
// Applause Button System
// ============================================
const ApplauseSystem = {
    init() {
        this.createButtons();
    },

    createButtons() {
        // Add applause buttons to review cards
        const reviewCards = document.querySelectorAll('.review-card, .review-teaser-card');
        reviewCards.forEach(card => {
            const btn = document.createElement('button');
            btn.className = 'applause-btn';
            btn.innerHTML = `
                <span>👏</span>
                <span class="clap-count">0</span>
            `;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clap(btn);
            });
            
            // Add to card footer or create one
            const footer = card.querySelector('.show-card-footer, .review-card-footer') || card;
            footer.appendChild(btn);
        });
    },

    clap(button) {
        if (button.classList.contains('clapped')) return;
        
        button.classList.add('clapped');
        const count = button.querySelector('.clap-count');
        count.textContent = parseInt(count.textContent) + 1;
        
        // Trigger confetti
        ConfettiSystem.burst(20, button.getBoundingClientRect());
        
        // Show achievement
        AchievementSystem.show('Bravo!', 'You applauded this review');
    }
};

// ============================================
// Virtual Standing Ovation
// ============================================
const StandingOvationSystem = {
    init() {
        this.createOverlay();
        this.bindScrollTracking();
    },

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'standing-ovation';
        overlay.innerHTML = `
            <div class="ovation-hands">👏👏👏</div>
            <div class="ovation-text">Standing Ovation!</div>
            <div class="ovation-subtext">You've reached the end of this review</div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    },

    bindScrollTracking() {
        let triggered = false;
        
        window.addEventListener('scroll', () => {
            if (triggered) return;
            
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            
            if (scrollPercent > 0.95) {
                triggered = true;
                this.show();
            }
        }, { passive: true });
    },

    show() {
        this.overlay.classList.add('show');
        ConfettiSystem.burst(100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.overlay.classList.remove('show');
        }, 5000);
    }
};

// ============================================
// Enhanced Confetti System
// ============================================
const ConfettiSystem = {
    colors: ['#667eea', '#764ba2', '#ffd700', '#ff6b6b', '#f093fb', '#4facfe'],
    shapes: ['paper', 'circle', 'streamer'],
    
    burst(count = 50, origin = null) {
        const rect = origin || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createPiece(centerX, centerY);
            }, i * 30);
        }
    },

    createPiece(originX, originY) {
        const piece = document.createElement('div');
        piece.className = 'confetti ' + this.shapes[Math.floor(Math.random() * this.shapes.length)];
        piece.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        piece.style.left = originX + 'px';
        piece.style.top = originY + 'px';
        
        // Random spread
        const spreadX = (Math.random() - 0.5) * 400;
        const rotation = Math.random() * 720;
        
        piece.style.setProperty('--spread-x', spreadX + 'px');
        piece.style.transform = `translateX(${spreadX}px) rotate(${rotation}deg)`;
        
        document.body.appendChild(piece);
        
        setTimeout(() => piece.remove(), 3000);
    }
};

// ============================================
// Enhanced Achievement System
// ============================================
const AchievementSystem = {
    achievements: new Set(),
    
    init() {
        this.bindScrollAchievements();
        this.checkFirstVisit();
    },

    bindScrollAchievements() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                this.checkScrollMilestones(maxScroll);
            }
        }, { passive: true });
    },

    checkScrollMilestones(percent) {
        const milestones = [
            { threshold: 25, id: 'explorer', title: 'Theatre Explorer', message: 'You\'re getting into it!', icon: '🎭' },
            { threshold: 50, id: 'reader', title: 'Dedicated Reader', message: 'Halfway there!', icon: '📖' },
            { threshold: 75, id: 'lover', title: 'True Theatre Lover', message: 'Almost at the finale!', icon: '❤️' },
            { threshold: 90, id: 'champion', title: 'Renaissance Champion', message: 'Standing ovation!', icon: '👏' }
        ];
        
        milestones.forEach(m => {
            if (percent >= m.threshold && !this.achievements.has(m.id)) {
                this.achievements.add(m.id);
                this.show(m.title, m.message, m.icon);
                
                if (m.id === 'champion') {
                    ConfettiSystem.burst(100);
                }
            }
        });
    },

    checkFirstVisit() {
        if (!localStorage.getItem('iht-visited')) {
            localStorage.setItem('iht-visited', 'true');
            setTimeout(() => {
                this.show('Welcome to the Renaissance', 'Your theatre journey begins', '🎭');
            }, 2000);
        }
    },

    show(title, message, icon = '🎭') {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <span class="icon">${icon}</span>
            <div class="content">
                <span class="title">${title}</span>
                <span class="message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 4500);
    }
};

// ============================================
// Theatre Trivia Loading System
// ============================================
const TriviaSystem = {
    facts: [
        { icon: '🎭', text: 'Did you know?', fact: 'The longest-running musical in the world is The Fantasticks, with over 21,000 performances' },
        { icon: '🎪', text: 'Melbourne Theatre Trivia', fact: 'The Princess Theatre is said to be haunted by the ghost of Frederick Federici' },
        { icon: '🎵', text: 'Musical Theatre Fact', fact: 'Les Misérables has been performed in 42 countries and translated into 21 languages' },
        { icon: '🎬', text: 'Stage Secret', fact: 'The phrase "break a leg" comes from the curtain legs - breaking them meant taking multiple bows' },
        { icon: '🎫', text: 'Theatre History', fact: 'The first theatre in Melbourne opened in 1842 on the corner of Bourke and Russell Streets' },
        { icon: '🎤', text: 'Performance Fact', fact: 'The average musical theatre performer burns 400-600 calories per show' }
    ],
    
    show() {
        const trivia = this.facts[Math.floor(Math.random() * this.facts.length)];
        
        const loader = document.createElement('div');
        loader.className = 'trivia-loader';
        loader.innerHTML = `
            <div class="trivia-icon">${trivia.icon}</div>
            <div class="trivia-text">${trivia.text}</div>
            <div class="trivia-fact">${trivia.fact}</div>
        `;
        
        document.body.appendChild(loader);
        
        return {
            hide: () => loader.remove()
        };
    }
};

// ============================================
// Stage Lighting Hover Effect
// ============================================
const StageLightingSystem = {
    init() {
        const elements = document.querySelectorAll('.review-card, .show-card');
        elements.forEach(el => {
            el.classList.add('stage-light-hover');
            this.bindHover(el);
        });
    },

    bindHover(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            element.style.setProperty('--hover-x', x + '%');
            element.style.setProperty('--hover-y', y + '%');
        });
    }
};

// ============================================
// Theatre Journey Tracker
// ============================================
const JourneyTracker = {
    init() {
        this.loadStats();
        this.createWidget();
        this.trackActivity();
    },

    loadStats() {
        this.stats = {
            showsViewed: parseInt(localStorage.getItem('iht-shows-viewed') || '0'),
            reviewsRead: parseInt(localStorage.getItem('iht-reviews-read') || '0'),
            timeOnSite: parseInt(localStorage.getItem('iht-time-on-site') || '0'),
            venuesExplored: JSON.parse(localStorage.getItem('iht-venues') || '[]').length
        };
    },

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'journey-progress';
        widget.innerHTML = `
            <h4>🎭 Your Theatre Journey</h4>
            <div class="journey-stats">
                <div class="journey-stat">
                    <span class="label">Shows explored</span>
                    <span class="value" id="journey-shows">${this.stats.showsViewed}</span>
                </div>
                <div class="journey-stat">
                    <span class="label">Reviews read</span>
                    <span class="value" id="journey-reviews">${this.stats.reviewsRead}</span>
                </div>
                <div class="journey-stat">
                    <span class="label">Venues discovered</span>
                    <span class="value" id="journey-venues">${this.stats.venuesExplored}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        this.widget = widget;
    },

    trackActivity() {
        // Track time on site
        setInterval(() => {
            this.stats.timeOnSite++;
            localStorage.setItem('iht-time-on-site', this.stats.timeOnSite);
        }, 60000); // Every minute

        // Track clicks on show cards
        document.addEventListener('click', (e) => {
            const showCard = e.target.closest('.show-card, .review-card');
            if (showCard) {
                this.stats.showsViewed++;
                localStorage.setItem('iht-shows-viewed', this.stats.showsViewed);
                this.updateWidget();
            }
        });
    },

    updateWidget() {
        const showsEl = document.getElementById('journey-shows');
        const reviewsEl = document.getElementById('journey-reviews');
        const venuesEl = document.getElementById('journey-venues');
        
        if (showsEl) showsEl.textContent = this.stats.showsViewed;
        if (reviewsEl) reviewsEl.textContent = this.stats.reviewsRead;
        if (venuesEl) venuesEl.textContent = this.stats.venuesExplored;
    },

    // Track venue visits
    trackVenue(venueName) {
        const venues = JSON.parse(localStorage.getItem('iht-venues') || '[]');
        if (!venues.includes(venueName)) {
            venues.push(venueName);
            localStorage.setItem('iht-venues', JSON.stringify(venues));
            this.stats.venuesExplored = venues.length;
            this.updateWidget();
        }
    }
};

// ============================================
// Initialize All Systems
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Core visual effects
    CurtainSystem.init();
    SpotlightSystem.init();
    FloatingEmojiSystem.init();
    SparkleSystem.init();
    
    // Interactive effects
    TypewriterSystem.init();
    ApplauseSystem.init();
    StageLightingSystem.init();
    
    // Achievement and tracking
    AchievementSystem.init();
    StandingOvationSystem.init();
    JourneyTracker.init();
    
    console.log('🎭 iHeartTheatre Magic Effects initialized');
});

// Export for global access
window.MagicEffects = {
    CurtainSystem,
    SpotlightSystem,
    FloatingEmojiSystem,
    TypewriterSystem,
    SparkleSystem,
    ApplauseSystem,
    StandingOvationSystem,
    ConfettiSystem,
    AchievementSystem,
    TriviaSystem,
    StageLightingSystem,
    JourneyTracker
};
