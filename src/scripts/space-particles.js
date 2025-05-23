const canvas = document.getElementById('spaceParticles');

if (!canvas) {
    console.error("Space Particles Error: Canvas element #spaceParticles not found.");
} else {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let baseNumberOfParticles = 70;
    let currentNumberOfParticles = baseNumberOfParticles;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.6 + 0.4; 
            this.speedX = (Math.random() * 0.4 - 0.2); 
            this.speedY = (Math.random() * 0.4 - 0.2); 
            this.color = `rgba(226, 232, 240, ${Math.random() * 0.5 + 0.15})`; // Tailwind Slate 200 con opacidad variable
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0) { 
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles(numParticles) {
        particlesArray = [];
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    function setCanvasDimensionsAndInitialize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const screenArea = canvas.width * canvas.height;
        currentNumberOfParticles = Math.min(150, Math.max(40, Math.floor(screenArea / 20000))); 
        
        initParticles(currentNumberOfParticles);
    }

    setCanvasDimensionsAndInitialize(); 
    animateParticles(); 

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setCanvasDimensionsAndInitialize();
        }, 200); 
    });
}