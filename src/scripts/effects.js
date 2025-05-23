const card = document.getElementById('bioCard');

if (card) {
    let animationEnded = getComputedStyle(card).animationName === 'none' || getComputedStyle(card).animationPlayState === 'paused';

    card.addEventListener('mousemove', (e) => {
        if (!animationEnded) return; 

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (y / (rect.height / 2)) * -3.5; 
        const rotateY = (x / (rect.width / 2)) * 3.5;  

        card.style.transition = 'transform 0.05s ease-out'; 
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        if (!animationEnded) return;
        
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
        card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });

    card.addEventListener('animationend', (event) => {
        if (event.animationName === 'fadeInSlideUp') {
            animationEnded = true;
        }
    });
}