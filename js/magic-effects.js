/** ============================================
 * iHeartTheatre - Magic Effects JavaScript
 * Curtain Reveal System
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
        this.curtain = curtain;
    },

    openCurtain() {
        setTimeout(() => {
            this.curtain.classList.add('open');
            setTimeout(() => {
                this.curtain.remove();
            }, 1200);
        }, 300);
    }
};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    CurtainSystem.init();
});
