// Mountain Parallax Animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('GSAP version:', gsap.version);
    
    const layers = document.querySelectorAll('.parallax-layer');
    
    // All landscape elements (not sky/bg) - including birds
    const landscapeLayers = [
        { el: document.querySelector('.layer-clouds img'), startY: 0, unit: '%' },
        { el: document.querySelector('.layer-mountains img'), startY: 60, unit: '%' },
        { el: document.querySelector('.layer-hills img'), startY: 56, unit: '%' },
        { el: document.querySelector('.layer-canopy-back img'), startY: 55, unit: '%' },
        { el: document.querySelector('.layer-canopy-mid-back img'), startY: 60, unit: '%' },
        { el: document.querySelector('.layer-canopy-mid-front img'), startY: 62, unit: '%' },
        { el: document.querySelector('.layer-canopy-front img'), startY: 51, unit: '%' },
        { el: document.querySelector('.birds-sm img'), startY: 55, unit: 'vh' },
        { el: document.querySelector('.birds-lg img'), startY: 56, unit: 'vh' }
    ];
    
    // Birds - for fly away effect after main animation
    const birds = [
        { el: document.querySelector('.birds-sm img'), startY: 55, unit: 'vh', xDir: -1 },  // Move left
        { el: document.querySelector('.birds-lg img'), startY: 56, unit: 'vh', xDir: 1 }    // Move right
    ];
    
    // Glass window overlay
    const glassWindow = document.querySelector('.glass-window-overlay');
    
    // Navigation
    const mainNav = document.querySelector('.main-nav');
    
    let scrollProgress = 0; // 0 to 3 progress (phase 1: 0-1, phase 2: 1-2, phase 3: 2-3)
    let animationComplete = false;
    
    // Wheel event - pull up all landscape elements
    window.addEventListener('wheel', function(e) {
        // If animation is complete, allow normal scrolling
        if (animationComplete) {
            // If scrolling back up at top of page, re-enable animation
            if (window.scrollY === 0 && e.deltaY < 0) {
                animationComplete = false;
                scrollProgress = 3;
                e.preventDefault();
            }
            return;
        }
        
        e.preventDefault(); // Stop page from scrolling during animation
        
        // Update scroll progress (0 to 2 range)
        scrollProgress += e.deltaY * 0.001;
        scrollProgress = Math.max(0, Math.min(3, scrollProgress)); // Clamp 0-3
        
        // Phase 1 progress (0-1): everything moves up
        const phase1 = Math.min(scrollProgress, 1);
        
        // Phase 2 progress (0-1): birds fly away (only after phase 1 complete)
        const phase2 = Math.max(0, scrollProgress - 1);
        
        // Animate landscape layers (phase 1)
        landscapeLayers.forEach(layer => {
            if (layer.el) {
                const moveAmount = layer.unit === 'vh' ? 10 : 10; // Same pace for all
                const targetY = layer.startY - (phase1 * moveAmount);
                
                gsap.to(layer.el, {
                    y: `${targetY}${layer.unit}`,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        });
        
        // Phase 2: Birds fly away and towards each other
        birds.forEach(bird => {
            if (bird.el) {
                const baseY = bird.startY - 10; // Position after phase 1
                const flyAwayY = baseY - (phase2 * 15); // Continue up, shorter distance
                const flyAwayX = phase2 * 20 * bird.xDir; // Move towards each other
                const opacity = 1 - phase2; // Fade out
                
                gsap.to(bird.el, {
                    y: `${flyAwayY}${bird.unit}`,
                    x: `${flyAwayX}vw`,
                    opacity: opacity,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: true
                });
            }
        });
        
        // Navigation fades with birds
        if (mainNav) {
            const navOpacity = 1 - phase2;
            const navY = phase2 * -30; // Move up as it fades
            
            gsap.to(mainNav, {
                opacity: navOpacity,
                y: navY,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        }
        
        // Phase 3: Glass window tint grows towards user
        const phase3 = Math.max(0, scrollProgress - 2);
        if (glassWindow) {
            const size = phase3 * 300; // Grow from 0 to 300vmax
            const opacity = Math.min(phase3 * 2, 1); // Fade in quickly
            
            gsap.to(glassWindow, {
                width: `${size}vmax`,
                height: `${size}vmax`,
                opacity: opacity,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        }
        
        // When animation is complete, enable normal scrolling
        if (scrollProgress >= 3 && !animationComplete) {
            animationComplete = true;
            // Smooth scroll to portfolio section
            const portfolio = document.querySelector('.portfolio');
            if (portfolio) {
                setTimeout(() => {
                    portfolio.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }
    }, { passive: false });
    
    // Floating animation for birds
    // const birdsSm = document.querySelector('.birds-sm');
    // const birdsLg = document.querySelector('.birds-lg');
    
 
    
    // Initial entrance animation
    gsap.from(layers, {
        scale: 1.1,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power2.out'
    });
});
