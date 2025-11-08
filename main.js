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

  // Preloader: remove on window load, with a safety timeout fallback
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const removePreloader = () => { if (preloader && preloader.parentNode) preloader.remove(); };
    window.addEventListener('load', removePreloader, { once: true });
    // Safety: ensure it goes away even if load hangs due to a third-party asset
    setTimeout(removePreloader, 6000);
  }

  // AOS (Animate On Scroll) init – required so elements with data-aos become visible
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  // Typed.js init (guarded)
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items') || '';
    typed_strings = typed_strings.split(',').map(s => s.trim()).filter(Boolean);
    if (typed_strings.length) {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
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
   * GLightbox for images. Video anchors are handled by delegated click handler below.
   */
  const glightboxImages = GLightbox({ selector: '.glightbox.preview-link' });

  /**
   * Delegated click handler for video lightbox with multi-step fallback.
   */
  document.addEventListener('click', function(e) {
    const anchor = e.target && e.target.closest && e.target.closest('.video-scroller a.glightbox');
    if (!anchor) return;
    e.preventDefault();

    const originalHref = anchor.href;
    const previewHref = originalHref.replace(/\/view(\?[^#]*)?$/, '/preview');
    const fileIdMatch = originalHref.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;
    const directHref = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : originalHref;

    let opened = false;
    const inst1 = GLightbox({
      elements: [{ href: previewHref, type: 'iframe' }],
      onOpen: () => { opened = true; },
      onClose: () => { opened = false; }
    });
    inst1.open();

    setTimeout(() => {
      if (opened) return;
      let opened2 = false;
      const inst2 = GLightbox({
        elements: [{ href: directHref, type: 'video' }],
        onOpen: () => { opened2 = true; },
        onClose: () => { opened2 = false; }
      });
      inst2.open();
      setTimeout(() => { if (!opened2) window.open(directHref, '_blank'); }, 800);
    }, 800);
  });

  /**
   * Populate video gallery from a plain text list file.
   * File format: <url> - <title>
   * The file lives at `Assets/Videos/videos.txt` (normalized path with no trailing space).
   */
  (function populateVideoGallery() {
    // Cache-bust locally to avoid stale list during development; keep cache in production
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
    const listPath = 'Assets/Videos/videos.txt' + (isLocal ? `?v=${Date.now()}` : '');
    const scroller = document.querySelector('.video-scroller');
    if (!scroller) return;

    fetch(listPath).then(r => {
      if (!r.ok) throw new Error('Could not fetch videos list');
      return r.text();
    }).then(text => {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      // Optional thumbnails mapped by index; fallback to first image when missing
      const thumbnails = [
        'Assets/Images/Perfume advert/Pink Minimalist New Product Skincare Poster.PNG',
        'Assets/Images/Perfume advert/DC4631ED-4DFB-4BAB-9A82-B6D3FC93F7EE.PNG',
        'Assets/Images/Logo Competition Award/Untitled design.png',
        'Assets/Images/Logo Competition Award/Shades of Brown Minimal Aesthetic Fashion Collection Instagram Post (1).png',
        'Assets/Images/Logo Competition Award/WhatsApp Image 2024-02-23 at 14.05.15_794f1019.jpg'
      ];

      scroller.innerHTML = '';

      lines.forEach((line, i) => {
        const parts = line.split(' - ');
        let url = parts[0].trim();
        const title = (parts.slice(1).join(' - ') || `Video ${i+1}`).trim();

        // Normalize common Drive share URLs to the /preview form used for embedding
        url = url.replace('/view?usp=drive_link', '/preview').replace('/view?usp=drivesdk', '/preview');

        const a = document.createElement('a');
        a.className = 'glightbox';
        a.setAttribute('data-type', 'iframe');
        a.href = url;

        const card = document.createElement('div');
        card.className = 'video-card';
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        const thumb = thumbnails[i] || thumbnails[0];
        card.style.backgroundImage = `url('${thumb}')`;

        const play = document.createElement('div'); play.className = 'play'; play.textContent = '▶';
        const label = document.createElement('div'); label.className = 'label'; label.textContent = title;

        card.appendChild(play);
        card.appendChild(label);
        a.appendChild(card);
        scroller.appendChild(a);
      });

      // No need to re-init GLightbox here; the delegated click handler above
      // handles dynamically added anchors reliably.

    }).catch(err => {
      console.warn('Could not populate video gallery from list:', err);
    });
  })();

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