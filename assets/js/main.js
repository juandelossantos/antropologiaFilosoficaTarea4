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
   * Set initial active state
   */
  const initialSection = ids[getCurrentIndex()] || 'inicio';
  setActiveNav(initialSection);
});
