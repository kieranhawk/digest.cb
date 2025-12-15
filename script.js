// Performance optimization utilities
const debounce = (fn, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const throttle = (fn, limit = 300) => {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      fn(...args);
      lastRun = now;
    }
  };
};

document.addEventListener('DOMContentLoaded', () => {
  
  const sections = Array.from(document.querySelectorAll('header.hero, .section'));
  let indicator = document.getElementById('section-indicator');
  let forwardBtn = document.querySelector('.cta-btn.floating');
  let backToTop = document.getElementById('back-to-top');
  
  // Создаем новые кнопки
  const btnBack = document.createElement('button');
  btnBack.id = 'btn-back';
  btnBack.textContent = 'Назад';
  btnBack.setAttribute('aria-label', 'Перейти к предыдущему блоку');
  btnBack.setAttribute('type', 'button');
  btnBack.setAttribute('role', 'button');
  document.body.appendChild(btnBack);
  
  const btnForward = document.createElement('button');
  btnForward.id = 'btn-forward';
  btnForward.textContent = 'Вперёд';
  btnForward.setAttribute('aria-label', 'Перейти к следующему блоку');
  btnForward.setAttribute('type', 'button');
  btnForward.setAttribute('role', 'button');
  btnForward.setAttribute('aria-live', 'polite');
  document.body.appendChild(btnForward);
  
  const btnTop = document.createElement('button');
  btnTop.id = 'btn-top';
  btnTop.innerHTML = '&uarr;';
  btnTop.setAttribute('aria-label', 'Вернуться наверх');
  btnTop.setAttribute('type', 'button');
  btnTop.setAttribute('role', 'button');
  document.body.appendChild(btnTop);
  
  // Screen reader announcements
  const srAnnouncer = document.createElement('div');
  srAnnouncer.setAttribute('role', 'status');
  srAnnouncer.setAttribute('aria-live', 'polite');
  srAnnouncer.setAttribute('aria-atomic', 'true');
  srAnnouncer.className = 'sr-only';
  srAnnouncer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
  document.body.appendChild(srAnnouncer);
  
  console.log('Sections count:', sections.length);
  const allCards = Array.from(document.querySelectorAll('.card'));

  // Initialize carousels
  function initCarousels() {
    const carousels = document.querySelectorAll('.card-carousel');
    carousels.forEach((carousel) => {
      const container = carousel.querySelector('.carousel-container');
      const slides = container.querySelectorAll('.carousel-slide');
      const prevBtn = container.querySelector('.carousel-arrow.prev');
      const nextBtn = container.querySelector('.carousel-arrow.next');
      const currentSpan = container.querySelector('.carousel-current');
      const totalSpan = container.querySelector('.carousel-total');

      if (!slides.length) return;

      let currentIndex = 0;
      const totalSlides = slides.length;

      if (totalSpan) totalSpan.textContent = totalSlides;

      const updateSlide = () => {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentIndex].classList.add('active');
        if (currentSpan) currentSpan.textContent = currentIndex + 1;
      };

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlide();
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlide();
      });

      // Prevent click events from triggering parent card lightbox
      container.addEventListener('click', (e) => {
        if (e.target.tagName !== 'IMG') e.stopPropagation();
      });

      // Fullscreen carousel view - click on image to open fullscreen
      slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
          img.style.cursor = 'pointer';
          img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openFullscreenCarousel(slides, index, carousel);
          });
        }
      });
    });
  }

  // Fullscreen carousel modal
  function openFullscreenCarousel(slides, startIndex, sourceCarousel) {
    const modal = document.createElement('div');
    modal.className = 'fullscreen-carousel-modal';
    const showNav = slides.length > 1;
    modal.innerHTML = `
      <div class="fs-carousel-content">
        <button class="fs-carousel-close" aria-label="Закрыть">✕</button>
        ${showNav ? '<button class="fs-carousel-nav fs-carousel-prev" aria-label="Предыдущее фото">‹</button>' : ''}
        ${showNav ? '<button class="fs-carousel-nav fs-carousel-next" aria-label="Следующее фото">›</button>' : ''}
        <div class="fs-carousel-container"></div>
        ${showNav ? `<div class="fs-carousel-counter">
          <span class="fs-carousel-current">1</span> / <span class="fs-carousel-total">${slides.length}</span>
        </div>` : ''}
      </div>
    `;

    // Add slides to modal
    const fsContainer = modal.querySelector('.fs-carousel-container');
    slides.forEach((slide, idx) => {
      const slideClone = slide.cloneNode(true);
      slideClone.classList.remove('active');
      if (idx === startIndex) slideClone.classList.add('active');

      const img = slideClone.querySelector('img');
      if (img) {
        img.style.maxWidth = '100vw';
        img.style.maxHeight = '100vh';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
      }

      fsContainer.appendChild(slideClone);
    });

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    let currentIdx = startIndex;
    const fsSlides = modal.querySelectorAll('.carousel-slide');
    const currentSpan = modal.querySelector('.fs-carousel-current');
    const prevBtn = modal.querySelector('.fs-carousel-prev');
    const nextBtn = modal.querySelector('.fs-carousel-next');
    const closeBtn = modal.querySelector('.fs-carousel-close');

    const updateFsSlide = () => {
      fsSlides.forEach(s => s.classList.remove('active'));
      fsSlides[currentIdx].classList.add('active');
      if (currentSpan) currentSpan.textContent = currentIdx + 1;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIdx = (currentIdx - 1 + slides.length) % slides.length;
        updateFsSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % slides.length;
        updateFsSlide();
      });
    }

    closeBtn.addEventListener('click', () => {
      modal.remove();
      document.body.style.overflow = 'auto';
    });

    // Keyboard navigation
    const handleKeyboard = (e) => {
      if (prevBtn && e.key === 'ArrowLeft') prevBtn.click();
      if (nextBtn && e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'Escape') {
        closeBtn.click();
        document.removeEventListener('keydown', handleKeyboard);
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBtn.click();
        document.removeEventListener('keydown', handleKeyboard);
      }
    });
  }

  initCarousels();

  /* count-based layout logic removed — restore base grid behavior */

  // Lightbox effect for card images — delegated handler (works for dynamic content)
  function openLightboxFromImage(img) {
    if (!img) return;
    // create overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '100000',
      padding: '20px',
      boxSizing: 'border-box',
      opacity: '0',
      transition: 'opacity 220ms ease',
    });

    const imgWrap = document.createElement('div');
    imgWrap.style.maxWidth = '100%';
    imgWrap.style.maxHeight = '100%';
    imgWrap.style.display = 'flex';
    imgWrap.style.alignItems = 'center';
    imgWrap.style.justifyContent = 'center';

    const largeImg = document.createElement('img');
    largeImg.src = img.src;
    largeImg.alt = img.alt || '';
    largeImg.style.maxWidth = '90%';
    largeImg.style.maxHeight = '90%';
    largeImg.style.borderRadius = '12px';
    largeImg.style.boxShadow = '0 10px 40px rgba(0,0,0,0.6)';
    largeImg.style.cursor = 'zoom-out';
    largeImg.style.transition = 'transform 260ms cubic-bezier(.2,.8,.2,1)';
    largeImg.style.transform = 'scale(0.92)';

    imgWrap.appendChild(largeImg);
    overlay.appendChild(imgWrap);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      position: 'fixed',
      top: '18px',
      right: '18px',
      zIndex: '100001',
      background: 'rgba(0,0,0,0.6)',
      color: '#fff',
      border: 'none',
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      fontSize: '18px',
      cursor: 'pointer',
    });
    overlay.appendChild(closeBtn);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function removeOverlay() {
      if (!overlay.parentElement) return;
      // play reverse animation then remove
      try {
        largeImg.style.transform = 'scale(0.92)';
        overlay.style.opacity = '0';
      } catch (e) {}
      window.removeEventListener('keydown', onKeyDown);
      setTimeout(() => {
        if (overlay.parentElement) overlay.remove();
        document.body.style.overflow = prevOverflow || '';
      }, 260);
    }

    function onKeyDown(ev) {
      if (ev.key === 'Escape') removeOverlay();
    }

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay || ev.target === imgWrap) removeOverlay();
    });

    largeImg.addEventListener('click', removeOverlay);
    closeBtn.addEventListener('click', removeOverlay);
    window.addEventListener('keydown', onKeyDown);

    // append and trigger enter animation
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      // small delay for image to be in DOM
      requestAnimationFrame(() => {
        largeImg.style.transform = 'scale(1)';
      });
    });
  }

  // Delegated click handler so images added dynamically also work
  document.body.addEventListener('click', (e) => {
    // Исключаем клики на изображения внутри карусели
    if (e.target.closest && e.target.closest('.carousel-container')) return;
    if (e.target.closest && e.target.closest('.fullscreen-carousel-modal')) return;
    
    // Проверяем клик на изображение внутри карточки или с классом clickable-image
    if (e.target.tagName === 'IMG' && (e.target.closest('.card') || e.target.classList.contains('clickable-image'))) {
      e.preventDefault();
      e.stopPropagation();
      // Создаём временный слайд для одиночного изображения
      const tempSlide = document.createElement('div');
      tempSlide.className = 'carousel-slide';
      const imgClone = e.target.cloneNode(true);
      imgClone.style.maxWidth = '';
      imgClone.style.width = '';
      imgClone.style.height = '';
      tempSlide.appendChild(imgClone);
      openFullscreenCarousel([tempSlide], 0, null);
    }
  });

  // Track current section index
  let currentIndex = 0;

  const site = document.querySelector('.site');

  const modalContainer = document.getElementById('modal-container') || (() => {
    const mc = document.createElement('div');
    mc.id = 'modal-container';
    document.body.appendChild(mc);
    return mc;
  })();
  modalContainer.style.position = 'fixed';
  modalContainer.style.top = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100vw';
  modalContainer.style.height = '100vh';
  modalContainer.style.zIndex = '99999';
  modalContainer.style.display = 'none';
  modalContainer.style.background = 'rgba(0,0,0,0.35)';
  modalContainer.style.backdropFilter = 'blur(10px)';
  modalContainer.style.alignItems = 'center';
  modalContainer.style.justifyContent = 'center';
  modalContainer.style.padding = '20px';

  if (!sections.length) {
    console.warn('No sections found. Buttons won\'t work without them.');
    return;
  }

  if (!forwardBtn) console.warn('Forward button (.cta-btn) not found in HTML.');
  if (!backToTop) console.warn('Back-to-top button (#back-to-top) not found in HTML.');

  // helper: get absolute top of section
  function getSectionTop(el) {
    const rect = el.getBoundingClientRect();
    return window.scrollY + rect.top - 60; // Better offset for comfortable reading position
  }

  // Smooth scroll: native smooth with temporary snap disable
  function smoothScroll(targetY) {
    const originalSnap = document.documentElement.style.scrollSnapType ||
                         getComputedStyle(document.documentElement).scrollSnapType;

    document.documentElement.style.scrollSnapType = 'none';
    if (site) site.style.scrollSnapType = 'none';

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });

    setTimeout(() => {
      document.documentElement.style.scrollSnapType = originalSnap;
      if (site) site.style.scrollSnapType = originalSnap || 'y proximity';
    }, 800);
  }

  // build indicator dots (if indicator exists)
  let dots = [];
  
  // Create indicator if it doesn't exist
  if (!indicator) {
    indicator = document.createElement('nav');
    indicator.id = 'section-indicator';
    indicator.className = 'section-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    document.body.appendChild(indicator);
  }
  
  if (indicator) {
    indicator.innerHTML = '';
    indicator.style.position = 'fixed';
    indicator.style.top = '50%';
    indicator.style.left = '20px';
    indicator.style.transform = 'translateY(-50%)';
    indicator.style.zIndex = '9999';
    indicator.style.display = 'flex';
    indicator.style.flexDirection = 'column';
    indicator.style.gap = '12px';
    indicator.style.visibility = 'visible';
    indicator.style.opacity = '1';
    sections.forEach((sec, i) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      
      const btn = document.createElement('button');
      btn.className = 'dot';
      const label = sec.querySelector('h2')?.textContent?.trim() || (i === 0 ? 'Главная' : `Раздел ${i}`);
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('data-label', label);
      
      const tooltip = document.createElement('span');
      tooltip.className = 'nav-tooltip';
      tooltip.textContent = label;
      tooltip.style.cssText = `
        position: absolute;
        left: 32px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.95);
        color: #be0318;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        cursor: pointer;
        z-index: 10;
      `;
      
      const navigateToSection = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Navigating to section:', i, sections[i]);
        sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      
      btn.addEventListener('click', navigateToSection);
      tooltip.addEventListener('click', navigateToSection);
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
      
      btn.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.left = '36px';
        tooltip.style.pointerEvents = 'auto';
      });
      
      btn.addEventListener('mouseleave', (e) => {
        if (!tooltip.matches(':hover')) {
          setTimeout(() => {
            if (!tooltip.matches(':hover')) {
              tooltip.style.opacity = '0';
              tooltip.style.left = '32px';
              tooltip.style.pointerEvents = 'none';
            }
          }, 200);
        }
      });
      
      tooltip.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';
      });
      
      tooltip.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.left = '32px';
        tooltip.style.pointerEvents = 'none';
      });
      
      wrapper.appendChild(btn);
      wrapper.appendChild(tooltip);
      indicator.appendChild(wrapper);
      dots.push(btn);
    });
    // Always show indicator
    indicator.style.display = 'flex';
  }

  // Setup back button with haptic feedback
  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Back button clicked, current index:', currentIndex);
    let prevIndex = currentIndex - 1;
    if (prevIndex >= 0 && sections[prevIndex]) {
      console.log('Scrolling to section:', prevIndex);
      sections[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      const label = sections[prevIndex].querySelector('h2')?.textContent?.trim() || 'Предыдущий раздел';
      srAnnouncer.textContent = `Переход к разделу: ${label}`;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  });
  
  // Setup forward button with haptic feedback
  btnForward.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Forward button clicked, current index:', currentIndex);
    let nextIndex = currentIndex + 1;
    if (nextIndex < sections.length && sections[nextIndex]) {
      console.log('Scrolling to section:', nextIndex);
      sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      const label = sections[nextIndex].querySelector('h2')?.textContent?.trim() || 'Следующий раздел';
      srAnnouncer.textContent = `Переход к разделу: ${label}`;
      if (navigator.vibrate) navigator.vibrate(10);
    }
  });
  
  // Setup top button with haptic feedback
  btnTop.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Top button clicked, scrolling to top');
    if (sections[0]) {
      sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      srAnnouncer.textContent = 'Переход в начало страницы';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (navigator.vibrate) navigator.vibrate(10);
  });
  
  // Mobile: tap on top 100px of screen to scroll to top
  let tapStartY = 0;
  document.addEventListener('touchstart', (e) => {
    tapStartY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    const tapEndY = e.changedTouches[0].clientY;
    const tapY = (tapStartY + tapEndY) / 2;
    
    if (tapY < 100 && window.scrollY > 300) {
      if (sections[0]) {
        sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (navigator.vibrate) navigator.vibrate(10);
    }
  }, { passive: true });



  // IntersectionObserver to mark active section and reveal cards
  const obsOptions = { root: null, threshold: 0.15 };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = sections.indexOf(entry.target);
      if (idx === -1) return;
      currentIndex = idx;

      // update dots
      if (dots.length) {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
      
      // Update forward button visibility - hide only on last section
      if (idx >= sections.length - 1) {
        btnForward.classList.add('hidden');
        btnForward.setAttribute('aria-hidden', 'true');
      } else {
        btnForward.classList.remove('hidden');
        btnForward.setAttribute('aria-hidden', 'false');
      }
      
      // Update back button visibility - hide on first section
      if (idx <= 0) {
        btnBack.classList.remove('visible');
        btnBack.setAttribute('aria-hidden', 'true');
      } else {
        btnBack.classList.add('visible');
        btnBack.setAttribute('aria-hidden', 'false');
      }
      
      // Update top button visibility - show from second section onwards
      if (idx >= 1) {
        btnTop.classList.add('visible');
        btnTop.setAttribute('aria-hidden', 'false');
      } else {
        btnTop.classList.remove('visible');
        btnTop.setAttribute('aria-hidden', 'true');
      }
      
      // Announce section change to screen readers
      const sectionLabel = entry.target.querySelector('h2')?.textContent?.trim() || `Раздел ${idx + 1}`;
      srAnnouncer.textContent = `Текущий раздел: ${sectionLabel}`;

      // reveal section and stagger cards
      entry.target.classList.add('visible');
      const cards = Array.from(entry.target.querySelectorAll('.card'));
      cards.forEach((card, i) => {
        card.style.transitionDelay = (i * 100) + 'ms';
        setTimeout(() => card.classList.add('visible'), 100 + i * 100);
      });
    });
  }, obsOptions);

  sections.forEach(sec => io.observe(sec));

  // Separate scroll listener to manage button visibility always
  let lastActiveIdx = -1;
  const updateButtonVisibility = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Find current section
    let activeIdx = 0;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
        activeIdx = idx;
      }
    });
    currentIndex = activeIdx;
    
    console.log('Current section index:', currentIndex, 'Total sections:', sections.length);
    
    // Update forward button - hide only on last section
    const isLastSection = currentIndex >= sections.length - 1;
    
    if (isLastSection) {
      btnForward.classList.add('hidden');
      console.log('Hiding forward button - last section');
    } else {
      btnForward.classList.remove('hidden');
      console.log('Showing forward button');
    }
    
    // Update back button - show from second section
    if (currentIndex <= 0) {
      btnBack.classList.remove('visible');
    } else {
      btnBack.classList.add('visible');
    }
    
    // Update top button - show when scrolled down
    if (scrollY > 300) {
      btnTop.classList.add('visible');
      console.log('Showing top button');
    } else {
      btnTop.classList.remove('visible');
      console.log('Hiding top button');
    }


    
    lastActiveIdx = activeIdx;
  };

  // Scroll progress bar with accessibility
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('role', 'progressbar');
  progressBar.setAttribute('aria-label', 'Прогресс прокрутки страницы');
  progressBar.setAttribute('aria-valuemin', '0');
  progressBar.setAttribute('aria-valuemax', '100');
  document.body.appendChild(progressBar);
  
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
    progressBar.style.width = scrollPercent + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
  };
  
  // Throttle scroll for performance
  let scrollTicking = false;
  let lastScrollTime = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (!scrollTicking && now - lastScrollTime > 16) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        updateButtonVisibility();
        scrollTicking = false;
        lastScrollTime = Date.now();
      });
      scrollTicking = true;
    }
  }, { passive: true });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      btnForward.click();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        btnBack.click();
      } else {
        btnTop.click();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      btnTop.click();
    } else if (e.key === 'End') {
      e.preventDefault();
      if (sections[sections.length - 1]) {
        sections[sections.length - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        srAnnouncer.textContent = 'Переход к последнему разделу';
      }
    }
  });
  
  // Initial calls
  updateScrollProgress();
  setTimeout(updateButtonVisibility, 100);

  // initial activation: always start at hero (index 0)
  function initialActivate() {
    currentIndex = 0;
    
    // Scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Activate first dot
    if (dots.length > 0) {
      dots.forEach(d => d.classList.remove('active'));
      dots[0].classList.add('active');
    }
    
    // Make sections visible with staggered card reveal
    sections.forEach((sec, sectionIdx) => {
      sec.classList.add('visible');
      const cards = Array.from(sec.querySelectorAll('.card'));
      cards.forEach((card, cardIdx) => {
        // Use dataset to store delay
        card.dataset.cardIndex = cardIdx;
        // Immediately add visible class with delay
        if (sectionIdx === 0) {
          // For first section, show cards immediately with stagger
          // Add immediately first
          card.classList.add('visible');
          // Then trigger animation with delay
          card.style.transitionDelay = (cardIdx * 100) + 'ms';
        } else {
          // For other sections, will be revealed by IntersectionObserver
          card.classList.remove('visible');
        }
      });
    });
    
    console.log('initialActivate: sections =', sections.length, 'dots =', dots.length);
  }
  // run initial activation immediately
  initialActivate();

  // snowflakes: optimized
  (function runSnow() {
    const container = document.createElement('div');
    container.className = 'snow-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '2';
    container.style.overflow = 'visible';
    document.body.insertBefore(container, document.body.firstChild);

    const emojis = ['❄','❅','❆','❉'];
    const maxFlakes = 30;
    let interval;
    let isPaused = localStorage.getItem('snowPaused') === 'true';

    function spawn() {
      if (container.children.length >= maxFlakes) return;
      const el = document.createElement('div');
      el.className = 'snowflake';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.fontSize = (Math.random() * 10 + 10) + 'px';
      el.style.animationDuration = (Math.random() * 8 + 8) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 20000);
    }

    function start() {
      if (!interval) interval = setInterval(spawn, 500);
      container.style.display = 'block';
    }

    function pause() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      container.style.display = 'none';
    }

    if (!isPaused) start();
    else pause();

    const btnSnow = document.getElementById('btn-snow-toggle');
    if (btnSnow) {
      if (isPaused) btnSnow.classList.add('paused');
      btnSnow.addEventListener('click', () => {
        isPaused = !isPaused;
        localStorage.setItem('snowPaused', isPaused);
        if (isPaused) {
          pause();
          btnSnow.classList.add('paused');
        } else {
          start();
          btnSnow.classList.remove('paused');
        }
      });
    }
  })();



  // performance: throttle resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => initialActivate(), 150);
  });

  // Snow toggle button always visible
  const btnSnow = document.getElementById('btn-snow-toggle');
  if (btnSnow) {
    btnSnow.style.display = 'flex';
  }



  // ============ АНИМАЦИЯ СЧЕТЧИКОВ ============
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 1500; // ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // ease-out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeProgress);
        
        counter.textContent = current.toLocaleString('ru-RU');
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target.toLocaleString('ru-RU');
        }
      };
      
      animate();
    });
  }

  // Запускаем анимацию при прокрутке
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.card').forEach(card => {
    counterObserver.observe(card);
  });

  // ============ УЛУЧШЕННЫЕ ИНТЕРАКТИВНЫЕ ЭФФЕКТЫ ============
  // Эффект при наведении на карточки
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.willChange = 'transform, box-shadow';
      }, { passive: true });
      
      card.addEventListener('mouseleave', function() {
        this.style.willChange = 'auto';
      }, { passive: true });
    });
  }

  // Освещение при клике на достижение
  document.querySelectorAll('.achievement').forEach(badge => {
    badge.addEventListener('click', function(e) {
      e.stopPropagation();
      this.style.animation = 'pulse-glow 0.6s ease-out';
      setTimeout(() => {
        this.style.animation = '';
      }, 600);
    });
  });

  // Hide scroll hint after first scroll
  const scrollHint = document.querySelector('.scroll-hint');
  let hasScrolled = false;
  
  window.addEventListener('scroll', () => {
    if (!hasScrolled && window.scrollY > 100) {
      if (scrollHint) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
        scrollHint.style.transition = 'opacity 0.3s ease';
      }
      hasScrolled = true;
    }
  }, { passive: true });

  // ============ ПОИСК ПО ДАЙДЖЕСТУ ============
  const btnSearch = document.createElement('button');
  btnSearch.id = 'btn-search';
  btnSearch.className = 'control-btn';
  btnSearch.innerHTML = '🔍';
  btnSearch.setAttribute('aria-label', 'Поиск по дайджесту');
  document.body.appendChild(btnSearch);

  const searchPanel = document.createElement('div');
  searchPanel.className = 'search-panel';
  searchPanel.innerHTML = `
    <input type="text" class="search-input" placeholder="Поиск по дайджесту..." aria-label="Поле поиска">
    <div class="search-results" role="region" aria-live="polite"></div>
  `;
  document.body.appendChild(searchPanel);

  const searchInput = searchPanel.querySelector('.search-input');
  const searchResults = searchPanel.querySelector('.search-results');

  btnSearch.addEventListener('click', () => {
    searchPanel.classList.toggle('active');
    if (searchPanel.classList.contains('active')) {
      searchInput.focus();
      if (navigator.vibrate) navigator.vibrate(10);
    }
  });

  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    
    if (query.length < 2) return;

    const results = [];
    document.querySelectorAll('.card article').forEach(article => {
      const text = article.textContent.toLowerCase();
      const title = article.querySelector('h3, h4')?.textContent || '';
      
      if (text.includes(query)) {
        const section = article.closest('.section');
        const sectionTitle = section?.querySelector('h2')?.textContent || 'Раздел';
        results.push({ title, text: article.textContent.substring(0, 150), element: article, sectionTitle });
      }
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<div style="padding: 10px; color: #2a0808;">Ничего не найдено</div>';
      return;
    }

    results.slice(0, 10).forEach(result => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="search-result-title">${result.title || result.sectionTitle}</div>
        <div class="search-result-text">${result.text.substring(0, 100)}...</div>
      `;
      item.addEventListener('click', () => {
        result.element.closest('.section').scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchPanel.classList.remove('active');
        if (navigator.vibrate) navigator.vibrate(10);
      });
      searchResults.appendChild(item);
    });
  }, 300));

  // ============ НАСТРОЙКИ РАЗМЕРА ШРИФТА ============
  const btnSettings = document.createElement('button');
  btnSettings.id = 'btn-settings';
  btnSettings.className = 'control-btn';
  btnSettings.innerHTML = 'Aa';
  btnSettings.setAttribute('aria-label', 'Размер шрифта');
  document.body.appendChild(btnSettings);

  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'settings-panel';
  settingsPanel.innerHTML = `
    <div class="settings-item">
      <label class="settings-label">Размер шрифта</label>
      <div class="font-size-btns">
        <button class="font-size-btn" data-size="small">A</button>
        <button class="font-size-btn active" data-size="medium">A</button>
        <button class="font-size-btn" data-size="large">A</button>
      </div>
    </div>
  `;
  document.body.appendChild(settingsPanel);

  const savedFontSize = localStorage.getItem('fontSize') || 'medium';
  document.body.classList.add(`font-${savedFontSize}`);
  settingsPanel.querySelector(`[data-size="${savedFontSize}"]`)?.classList.add('active');

  btnSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
    if (navigator.vibrate) navigator.vibrate(10);
  });

  settingsPanel.querySelectorAll('.font-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.size;
      document.body.className = document.body.className.replace(/font-(small|medium|large)/g, '');
      document.body.classList.add(`font-${size}`);
      localStorage.setItem('fontSize', size);
      
      settingsPanel.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (navigator.vibrate) navigator.vibrate(10);
    });
  });

  // Закрытие панелей при клике вне их
  document.addEventListener('click', (e) => {
    if (!searchPanel.contains(e.target) && e.target !== btnSearch) {
      searchPanel.classList.remove('active');
    }
    if (!settingsPanel.contains(e.target) && e.target !== btnSettings) {
      settingsPanel.classList.remove('active');
    }
  });

  // Interactive card hover - track mouse position for radial gradient effect
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseMoveTimer;
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (mouseMoveTimer) return;
        mouseMoveTimer = setTimeout(() => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mouse-x', `${x}%`);
          card.style.setProperty('--mouse-y', `${y}%`);
          mouseMoveTimer = null;
        }, 16);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      }, { passive: true });
    });
  }



  // Бинго
  console.log('Starting bingo creation');
  const bingoTasks = ['Нарезать салаты','Запустить салюты','Подвести итоги года','Загадать желание','Поздравить коллег','Спеть караоке','Посмотреть фильм','Сделать селфи','Съесть мандарин','Выпить шампанское','Станцевать','Отдохнуть 🎉'];
  const bingoSection = document.querySelector('#fortune .container');
  console.log('bingoSection found:', bingoSection);
  if (bingoSection) {
    console.log('Creating bingo card');
    const bingoCard = document.createElement('div');
    bingoCard.className = 'bingo-card';
    bingoCard.id = 'bingo-card';
    bingoCard.innerHTML = '<h3>🎊 Бинго Новогодних Праздников</h3><div class="bingo-grid"></div><div class="bingo-actions"><button class="bingo-btn" id="btn-print">🖨️ Печать</button><button class="bingo-btn" id="btn-pdf">💾 PDF</button></div>';
    const grid = bingoCard.querySelector('.bingo-grid');
    const saved = JSON.parse(localStorage.getItem('bingo') || '{}');
    bingoTasks.forEach((task, i) => {
      const cell = document.createElement('div');
      cell.className = 'bingo-cell' + (saved[i] ? ' checked' : '');
      cell.textContent = task;
      cell.onclick = () => {
        cell.classList.toggle('checked');
        saved[i] = cell.classList.contains('checked');
        localStorage.setItem('bingo', JSON.stringify(saved));
        if (navigator.vibrate) navigator.vibrate(20);
      };
      grid.appendChild(cell);
    });
    const remixApp = bingoSection.querySelector('.remix-app');
    console.log('remixApp found:', remixApp);
    console.log('Inserting bingo card before:', remixApp ? remixApp.nextSibling : 'end');
    bingoSection.insertBefore(bingoCard, remixApp ? remixApp.nextSibling : null);
    console.log('Bingo card inserted');

    document.getElementById('btn-print').onclick = () => {
      const w = window.open('', '', 'width=800,height=600');
      const html = document.getElementById('bingo-card').cloneNode(true);
      html.querySelector('.bingo-actions').remove();
      w.document.write(`<!DOCTYPE html><html><head><title>Бинго</title><style>body{font-family:'Montserrat',sans-serif;margin:20px;background:white}.bingo-card{background:white;border:3px solid #be0318;border-radius:16px;padding:28px;max-width:600px;margin:0 auto}.bingo-card h3{color:#be0318;font-size:1.5rem;margin:0 0 20px 0;text-align:center}.bingo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;aspect-ratio:4/3}.bingo-cell{background:rgba(190,3,24,0.1);border:2px solid #be0318;border-radius:8px;padding:10px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:0.85rem;font-weight:600;color:#2a0808}.bingo-cell.checked{background:#be0318;color:white}</style></head><body>${html.outerHTML}</body></html>`);
      w.document.close();
      w.print();
    };

    document.getElementById('btn-pdf').onclick = () => document.getElementById('btn-print').click();
  } else {
    console.log('bingoSection not found');
  }
    
    document.getElementById('btn-print').onclick = () => {
      const w = window.open('', '', 'width=800,height=600');
      const html = document.getElementById('bingo-card').cloneNode(true);
      html.querySelector('.bingo-actions').remove();
      w.document.write(`<!DOCTYPE html><html><head><title>Бинго</title><style>body{font-family:'Montserrat',sans-serif;margin:20px;background:white}.bingo-card{background:white;border:3px solid #be0318;border-radius:16px;padding:28px;max-width:600px;margin:0 auto}.bingo-card h3{color:#be0318;font-size:1.5rem;margin:0 0 20px 0;text-align:center}.bingo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;aspect-ratio:4/3}.bingo-cell{background:rgba(190,3,24,0.1);border:2px solid #be0318;border-radius:8px;padding:10px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:0.85rem;font-weight:600;color:#2a0808}.bingo-cell.checked{background:#be0318;color:white}</style></head><body>${html.outerHTML}</body></html>`);
      w.document.close();
      w.print();
    };
    
    document.getElementById('btn-pdf').onclick = () => document.getElementById('btn-print').click();
  }

});
