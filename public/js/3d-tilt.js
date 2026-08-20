document.addEventListener("DOMContentLoaded", () => {
    // Select all elements we want to apply the 3D tilt effect to
    const tiltElements = document.querySelectorAll('.portfolio-card, .glass-panel');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Mouse position relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation percentage (-1 to +1)
            // Multiply by max degrees (e.g. 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'transform 0.1s ease-out';
            el.style.zIndex = '10'; // Bring to front while hovering
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s ease-out';
            el.style.zIndex = '1';
        });
    });
});
