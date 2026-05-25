/**
 * Diálogo Ancestral — Main JavaScript
 * Handles smooth navigation, active states, keyboard support,
 * arrow buttons, section dots, and responsive behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main-container');
  const sections = document.querySelectorAll('.section');
  const headerLinks = document.querySelectorAll('.header__link');
  const tabBarItems = document.querySelectorAll('.tab-bar__item');
  const dots = document.querySelectorAll('.section-dot');
  const navLeft = document.getElementById('nav-left');
  const navRight = document.getElementById('nav-right');
  const mobileProgressBar = document.getElementById('mobile-progress-bar');

  const isMobile = () => window.innerWidth <= 768;
  const ids = Array.from(sections).map(s => s.id);

  /**
   * Smooth scroll to a section by ID
   */
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    if (isMobile()) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      main.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Get current visible section index
   */
  function getCurrentIndex() {
    if (isMobile()) {
      let closest = 0;
      let minDistance = Infinity;
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          closest = i;
        }
      });
      return closest;
    } else {
      const scrollLeft = main.scrollLeft;
      const viewportWidth = window.innerWidth;
      return Math.round(scrollLeft / viewportWidth);
    }
  }

  /**
   * Update active state on all navigation elements
   */
  function setActiveNav(id) {
    headerLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
    tabBarItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === id);
    });
    dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.section === id);
    });

    // Update mobile progress bar
    if (mobileProgressBar) {
      const index = ids.indexOf(id);
      const progress = ((index + 1) / ids.length) * 100;
      mobileProgressBar.style.width = progress + '%';
    }
  }

  /**
   * IntersectionObserver for active state updates
   */
  const observerOptions = {
    root: isMobile() ? null : main,
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNav(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  /**
   * Handle click on header links
   */
  headerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').substring(1);
      scrollToSection(id);
      setActiveNav(id);
    });
  });

  /**
   * Handle click on tab bar items
   */
  tabBarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const id = item.getAttribute('href').substring(1);
      scrollToSection(id);
      setActiveNav(id);
    });
  });

  /**
   * Handle click on section dots
   */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const id = dot.dataset.section;
      scrollToSection(id);
      setActiveNav(id);
    });
  });

  /**
   * Handle navigation arrows
   */
  navLeft.addEventListener('click', () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      scrollToSection(ids[currentIndex - 1]);
    }
  });

  navRight.addEventListener('click', () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < ids.length - 1) {
      scrollToSection(ids[currentIndex + 1]);
    }
  });

  /**
   * Keyboard navigation (arrow keys)
   */
  document.addEventListener('keydown', (e) => {
    if (isMobile()) return;

    const currentIndex = getCurrentIndex();

    if (e.key === 'ArrowRight' && currentIndex < ids.length - 1) {
      e.preventDefault();
      scrollToSection(ids[currentIndex + 1]);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      scrollToSection(ids[currentIndex - 1]);
    }
  });

  /**
   * Handle window resize: re-observe with correct root
   */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      observer.disconnect();
      const newOptions = {
        root: isMobile() ? null : main,
        threshold: 0.5
      };
      const newObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      }, newOptions);
      sections.forEach(section => newObserver.observe(section));
    }, 250);
  });

  /**
   * Biblioteca pagination
   */
  const bibPage1 = document.getElementById('bib-page-1');
  const bibPage2 = document.getElementById('bib-page-2');
  const bibNext = document.getElementById('bib-next');
  const bibPrev = document.getElementById('bib-prev');

  if (bibNext && bibPrev && bibPage1 && bibPage2) {
    bibNext.addEventListener('click', () => {
      bibPage1.classList.remove('active');
      bibPage2.classList.add('active');
    });

    bibPrev.addEventListener('click', () => {
      bibPage2.classList.remove('active');
      bibPage1.classList.add('active');
    });
  }

  /**
   * Prompt modal
   */
  const promptCards = document.querySelectorAll('.prompt-card');
  const promptModal = document.getElementById('prompt-modal');
  const promptText = document.getElementById('prompt-modal-text');
  const promptClose = document.getElementById('prompt-modal-close');
  const promptOverlay = document.getElementById('prompt-modal-overlay');

  if (promptCards.length && promptModal && promptText && promptClose && promptOverlay) {
    promptCards.forEach(card => {
      card.addEventListener('click', () => {
        promptText.textContent = card.dataset.prompt;
        promptModal.classList.add('prompt-modal--open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closePromptModal() {
      promptModal.classList.remove('prompt-modal--open');
      document.body.style.overflow = '';
    }

    promptClose.addEventListener('click', closePromptModal);
    promptOverlay.addEventListener('click', closePromptModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && promptModal.classList.contains('prompt-modal--open')) {
        closePromptModal();
      }
    });
  }

  /**
   * Mobile info toggle
   */
  const infoBtn = document.getElementById('header-info-btn');
  const infoPanel = document.getElementById('header-info');

  if (infoBtn && infoPanel) {
    infoBtn.addEventListener('click', () => {
      const isOpen = infoBtn.getAttribute('aria-expanded') === 'true';
      infoBtn.setAttribute('aria-expanded', !isOpen);
      infoPanel.classList.toggle('header-info--open', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#header-info') && !e.target.closest('#header-info-btn')) {
        infoBtn.setAttribute('aria-expanded', 'false');
        infoPanel.classList.remove('header-info--open');
      }
    });
  }

  /**
   * Set initial active state
   */
  const initialSection = ids[getCurrentIndex()] || 'inicio';
  setActiveNav(initialSection);
});
