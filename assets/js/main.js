/**
 * Diálogo Ancestral — Main JavaScript
 * Handles smooth navigation, active states, and keyboard support.
 */

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main-container');
  const sections = document.querySelectorAll('.section');
  const headerLinks = document.querySelectorAll('.header__link');
  const tabBarItems = document.querySelectorAll('.tab-bar__item');
  const tabBar = document.getElementById('tab-bar');

  // Detect if we're in mobile mode (matches the CSS media query)
  const isMobile = () => window.innerWidth <= 768;

  /**
   * Smooth scroll to a section by ID
   */
  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    if (isMobile()) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // On desktop, main is the scroll container
      main.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Update active state on navigation links
   */
  function setActiveNav(id) {
    headerLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
    tabBarItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === id);
    });
  }

  /**
   * Determine which section is currently in view
   */
  function getCurrentSection() {
    if (isMobile()) {
      // Mobile: find section closest to top of viewport
      let closest = null;
      let minDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          closest = section;
        }
      });

      return closest ? closest.id : null;
    } else {
      // Desktop: based on main scroll position
      const scrollLeft = main.scrollLeft;
      const viewportWidth = window.innerWidth;
      const index = Math.round(scrollLeft / viewportWidth);
      return sections[index] ? sections[index].id : null;
    }
  }

  /**
   * IntersectionObserver for active state updates (mobile + desktop)
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
   * Keyboard navigation (arrow keys)
   */
  document.addEventListener('keydown', (e) => {
    if (isMobile()) return; // Keyboard nav only useful on desktop horizontal

    const currentId = getCurrentSection();
    if (!currentId) return;

    const ids = Array.from(sections).map(s => s.id);
    const currentIndex = ids.indexOf(currentId);

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
  const initialSection = getCurrentSection() || 'inicio';
  setActiveNav(initialSection);
});
