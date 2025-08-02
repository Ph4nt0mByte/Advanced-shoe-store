
let scrollPosition = 0;
let slideInterval;
let isScrolling = false;
let slides = [];
let totalSlides = 0;
let slideWidth = 320; 
let scrollSpeed = 0.5; 


export function initSlideshow() {
  slides = document.querySelectorAll('.slides');
  totalSlides = slides.length;
  
  if (totalSlides === 0) return;
  
  calculateSlideWidth();
  duplicateSlides(); 
  startInfiniteScroll();
}

function calculateSlideWidth() {
  const container = document.querySelector('.slideshow-container');
  if (!container) return;
  
  const containerWidth = container.offsetWidth;
  if (containerWidth <= 600) {
    slideWidth = 240; 
  } else if (containerWidth <= 900) {
    slideWidth = 290;
  } else {
    slideWidth = 320; 
  }
}


function duplicateSlides() {
  const track = document.querySelector('.slideshow-track');
  if (!track) return;
  

  const originalSlides = Array.from(slides);
  originalSlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });
  

  slides = document.querySelectorAll('.slides');
}

function updateScrollPosition() {
  const track = document.querySelector('.slideshow-track');
  if (!track) return;
  

  scrollPosition -= scrollSpeed;
  

  const resetPoint = -(totalSlides * slideWidth);
  if (scrollPosition <= resetPoint) {
    scrollPosition = 0;
  }
  
  track.style.transform = `translateX(${scrollPosition}px)`;
  

  if (isScrolling) {
    requestAnimationFrame(updateScrollPosition);
  }
}


function startInfiniteScroll() {
  if (isScrolling) return;
  isScrolling = true;
  updateScrollPosition();
}

function stopInfiniteScroll() {
  isScrolling = false;
}
function speedUpScroll() {
  const originalSpeed = scrollSpeed;
  scrollSpeed = 2; 
  setTimeout(() => {
    scrollSpeed = originalSpeed;
  }, 1000);
}
function plusSlides(n) {
  speedUpScroll();
}

let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    speedUpScroll(); 
  }
}

function pauseOnHover() {
  const container = document.querySelector('.slideshow-container');
  if (container) {
    container.addEventListener('mouseenter', stopInfiniteScroll);
    container.addEventListener('mouseleave', startInfiniteScroll);
  }
}

function addTouchEvents() {
  const container = document.querySelector('.slideshow-container');
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
}

function handleResize() {
  calculateSlideWidth();
}
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initSlideshow();
    pauseOnHover();
    addTouchEvents();
    window.addEventListener('resize', handleResize);
  }, 100);
});

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const body = document.body;

  menu.classList.toggle('active');

  if (menu.classList.contains('active')) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }

  const menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      body.style.overflow = '';
    });
  });
}
