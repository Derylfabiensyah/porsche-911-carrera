// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== 360° ROTATION ON SCROLL =====
const rotateSection = document.getElementById('rotate');
const rotateStage = document.getElementById('rotate-stage');
const rotateImages = document.querySelectorAll('.rotate-img');
const rotateAngleEl = document.getElementById('rotate-angle');
const rotateProgress = document.getElementById('rotate-progress');
const rotateDotsContainer = document.getElementById('rotate-dots');
const totalImages = rotateImages.length;

// Create dots
for (let i = 0; i < totalImages; i++) {
    const dot = document.createElement('div');
    dot.className = 'rotate-dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dot.addEventListener('click', () => setRotateImage(i));
    rotateDotsContainer.appendChild(dot);
}

let currentRotateIndex = 0;

function setRotateImage(index) {
    if (index === currentRotateIndex) return;
    rotateImages.forEach(img => img.classList.remove('active'));
    rotateImages[index].classList.add('active');
    
    const dots = document.querySelectorAll('.rotate-dot');
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
    
    const angle = Math.round((index / totalImages) * 360);
    rotateAngleEl.textContent = angle + '°';
    rotateProgress.style.width = ((index + 1) / totalImages * 100) + '%';
    currentRotateIndex = index;
}

// Scroll-based rotation
function handleRotateScroll() {
    const rect = rotateSection.getBoundingClientRect();
    const sectionHeight = rotateSection.offsetHeight;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress through the section
    const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - rect.top) / (sectionHeight + viewportHeight)
    ));
    
    // Map scroll progress to image index
    const imageIndex = Math.min(totalImages - 1, Math.floor(scrollProgress * totalImages));
    
    if (imageIndex !== currentRotateIndex && imageIndex >= 0 && imageIndex < totalImages) {
        setRotateImage(imageIndex);
    }
}

window.addEventListener('scroll', handleRotateScroll, { passive: true });

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
    '.feature-card, .spec-row, .perf-stat, .mini-stat, .stat-item, .section-header'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger animation for siblings
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            const index = Array.from(siblings).indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== SPEC BAR ANIMATION =====
const specBars = document.querySelectorAll('.spec-bar-fill');
const specBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transition = 'width 1.2s ease-out';
            entry.target.style.width = entry.target.style.getPropertyValue('--fill');
        }
    });
}, { threshold: 0.3 });

specBars.forEach(bar => {
    const targetWidth = getComputedStyle(bar).getPropertyValue('--fill');
    bar.style.width = '0%';
    specBarObserver.observe(bar);
});

// ===== HERO PARTICLES =====
const hero = document.querySelector('.hero');
function createParticle() {
    const particle = document.createElement('div');
    const size = 1 + Math.random() * 2;
    particle.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        background: rgba(232, 83, 14, ${0.3 + Math.random() * 0.4});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none; z-index: 1;
        animation: particleDrift ${4 + Math.random() * 5}s linear forwards;
    `;
    hero.appendChild(particle);
    setTimeout(() => particle.remove(), 9000);
}

// Add particle animation keyframes
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleDrift {
        0% { opacity: 0; transform: translateY(0) scale(0); }
        15% { opacity: 1; transform: translateY(-15px) scale(1); }
        85% { opacity: 0.4; }
        100% { opacity: 0; transform: translateY(-180px) scale(0.3); }
    }
`;
document.head.appendChild(particleStyle);
setInterval(createParticle, 400);

// ===== SMOOTH ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== COUNTER ANIMATION FOR STATS =====
function animateCounter(element, target, suffix = '') {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(start + (target - start) * eased);
        
        // Format with comma for thousands
        const formatted = current.toLocaleString();
        element.innerHTML = formatted + '<span>' + suffix + '</span>';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

const statsBar = document.getElementById('stats-bar');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            const statValues = statsBar.querySelectorAll('.stat-value');
            animateCounter(statValues[0], 385, 'HP');
            animateCounter(statValues[1], 4.2, 's');
            animateCounter(statValues[2], 293, 'km/h');
            animateCounter(statValues[3], 450, 'Nm');
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(statsBar);
