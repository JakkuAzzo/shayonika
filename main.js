/**
* Template Name: MyResume
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  // Header toggle removed: the hamburger control was intentionally removed from the HTML.
  // No-op here to avoid errors when the element is absent.

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate GLightbox instances
   * - image previews use links with class .preview-link
   * - video previews inside .video-scroller use a dedicated instance with a small fallback
   */
  const glightboxImages = GLightbox({ selector: '.glightbox.preview-link' });

  // Video lightbox with fallback: if the lightbox doesn't open (e.g. Drive blocks embedding),
  // open the video href in a new tab after a short timeout.
  let videoLightboxOpened = false;
  const glightboxVideos = GLightbox({
    selector: '.video-scroller .glightbox',
    onOpen: () => { videoLightboxOpened = true; },
    onClose: () => { videoLightboxOpened = false; }
  });

  // Fallback handler: attempt to open in new tab if onOpen didn't run within 900ms
  document.querySelectorAll('.video-scroller a.glightbox').forEach(a => {
    a.addEventListener('click', function () {
      videoLightboxOpened = false;
      const href = this.href;
      setTimeout(() => {
        if (!videoLightboxOpened) {
          // open in a new tab so the user can still view the video
          window.open(href, '_blank');
        }
      }, 900);
    });
  });

  /**
   * Hero slide controls (pause / prev / next)
   * - Default behavior: CSS animation cycles slides
   * - When user pauses or uses prev/next we enter manual mode and control slides via JS
   */
  (function initHeroControls() {
    const wrapper = document.querySelector('.hero-bg-slides');
    if (!wrapper) return;
    const slides = Array.from(wrapper.querySelectorAll('.hero-slide'));
    if (!slides.length) return;

    let index = 0;
    // mark initial active slide for manual mode
    slides.forEach(s => s.classList.remove('active'));
    slides[0].classList.add('active');

    const setActive = (i) => {
      slides.forEach(s => s.classList.remove('active'));
      slides[i].classList.add('active');
      index = i;
    };

    const enterManual = () => {
      if (!wrapper.classList.contains('manual')) wrapper.classList.add('manual');
      // set play button state
      const playBtn = document.getElementById('hero-play');
      if (playBtn) playBtn.innerText = 'Play';
    };

    const exitManual = () => {
      if (wrapper.classList.contains('manual')) wrapper.classList.remove('manual');
      const playBtn = document.getElementById('hero-play');
      if (playBtn) playBtn.innerText = 'Pause';
    };

    const prev = () => { enterManual(); setActive((index - 1 + slides.length) % slides.length); };
    const next = () => { enterManual(); setActive((index + 1) % slides.length); };

    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const playBtn = document.getElementById('hero-play');

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); next(); });
    if (playBtn) playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (wrapper.classList.contains('manual')) {
        // resume auto animation
        exitManual();
      } else {
        // pause and enter manual mode
        enterManual();
      }
    });
  })();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  // Swiper initialization removed (testimonials removed)

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();