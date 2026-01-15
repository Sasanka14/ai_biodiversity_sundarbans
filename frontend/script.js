gsap.registerPlugin(ScrollTrigger);

// 1. Repeating Scroll Animations
gsap.utils.toArray(".animate-every-time").forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 90%", // Start when element is near bottom
            end: "bottom 10%", 
            toggleActions: "play reverse play reverse" // Repeating logic
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// 2. FAQ Accordion Logic
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = header.nextElementSibling;
        const isActive = item.classList.contains('active');
        
        // Close all others
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });

        // Toggle current if it wasn't already active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// 3. Hero Slideshow - Background + Text Synced
const bgSlides = document.querySelectorAll('.hero-bg-slide');
let currentBgSlide = 0;
const bgSlideInterval = 5000; // Change every 5 seconds

// Image URLs for masked text (must match hero-bg-slide order)
const slideImages = [
    'https://i.pinimg.com/736x/2d/95/f6/2d95f636137f00f172881e7f46759011.jpg',
    'https://images.unsplash.com/photo-1565118531796-763e5082d113?w=1920',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1920',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920',
    'https://images.unsplash.com/photo-1476362555312-ab9e108a0efd?w=1920'
];

// Text content for each slide
const slides = [
    { masked: "Man", white: "grove", sub: "Forest" },
    { masked: "Cli", white: "mate", sub: "Change" },
    { masked: "Spe", white: "cies", sub: "Richness" },
    { masked: "Eco", white: "system", sub: "Balance" },
    { masked: "Bio", white: "diversity", sub: "Index" },
    { masked: "Nat", white: "ure", sub: "Conservation" },
    { masked: "For", white: "est", sub: "Protection" }
];

function changeBgSlide() {
    const heroTitle = document.getElementById("hero-title");
    const outlineText = document.querySelector(".outline-text");
    const nextSlide = (currentBgSlide + 1) % bgSlides.length;
    
    // Create timeline for perfectly synced animation
    const tl = gsap.timeline();
    
    // Phase 1: Fade out text elements individually with stagger
    tl.to(".subtitle", { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" }, 0)
      .to("#hero-title", { opacity: 0, scale: 0.95, duration: 0.4, ease: "power2.in" }, 0.1)
      .to(".outline-text", { opacity: 0, x: -20, duration: 0.3, ease: "power2.in" }, 0.15)
      .to(".description-box", { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" }, 0.2)
    
    // Phase 2: Switch background (happens during text fade)
      .add(() => {
          bgSlides[currentBgSlide].classList.remove('active');
          currentBgSlide = nextSlide;
          bgSlides[currentBgSlide].classList.add('active');
      }, 0.3)
    
    // Phase 3: Update text content
      .add(() => {
          const slideData = slides[currentBgSlide];
          heroTitle.innerHTML = slideData.masked + '<span>' + slideData.white + '</span>';
          heroTitle.style.backgroundImage = `url('${slideImages[currentBgSlide]}')`;
          outlineText.innerText = slideData.sub;
      }, 0.8)
    
    // Phase 4: Fade in text elements with stagger
      .to(".subtitle", { opacity: 0.6, y: 0, duration: 0.4, ease: "power2.out" }, 0.9)
      .to("#hero-title", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }, 1.0)
      .to(".outline-text", { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 1.1)
      .to(".description-box", { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.2);
}

// Auto-advance slideshow
if (bgSlides.length > 0) {
    setInterval(changeBgSlide, bgSlideInterval);
}

// 4. Manual Hero Text Switcher (Arrow buttons)
function changeSlide(dir) {
    const heroTitle = document.getElementById("hero-title");
    const outlineText = document.querySelector(".outline-text");
    const nextSlide = (currentBgSlide + dir + bgSlides.length) % bgSlides.length;
    
    // Create timeline for perfectly synced animation
    const tl = gsap.timeline();
    
    // Phase 1: Slide out in direction
    tl.to(".subtitle", { opacity: 0, x: dir * -30, duration: 0.25, ease: "power2.in" }, 0)
      .to("#hero-title", { opacity: 0, x: dir * -50, duration: 0.3, ease: "power2.in" }, 0.05)
      .to(".outline-text", { opacity: 0, x: dir * -40, duration: 0.25, ease: "power2.in" }, 0.1)
      .to(".description-box", { opacity: 0, x: dir * -30, duration: 0.25, ease: "power2.in" }, 0.15)
    
    // Phase 2: Switch background
      .add(() => {
          bgSlides[currentBgSlide].classList.remove('active');
          currentBgSlide = nextSlide;
          bgSlides[currentBgSlide].classList.add('active');
      }, 0.25)
    
    // Phase 3: Update text content
      .add(() => {
          const slideData = slides[currentBgSlide];
          heroTitle.innerHTML = slideData.masked + '<span>' + slideData.white + '</span>';
          heroTitle.style.backgroundImage = `url('${slideImages[currentBgSlide]}')`;
          outlineText.innerText = slideData.sub;
      }, 0.5)
    
    // Phase 4: Slide in from opposite direction
      .fromTo(".subtitle", { x: dir * 30 }, { opacity: 0.6, x: 0, duration: 0.3, ease: "power2.out" }, 0.55)
      .fromTo("#hero-title", { x: dir * 50 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, 0.6)
      .fromTo(".outline-text", { x: dir * 40 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, 0.65)
      .fromTo(".description-box", { x: dir * 30 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, 0.7);
}