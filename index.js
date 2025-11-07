// index.js — richer interactions: nav toggle, filters, reveal, and lightbox
(function(){
  function onReady(fn){
    if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function(){
    // NAV burger: graceful handling if elements don't exist
    const burger = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');
    if(burger && links){
      burger.addEventListener('click', ()=>{
        links.classList.toggle('open');
        burger.classList.toggle('open');
      });
    }

    // Filters
    const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    function applyFilter(filter){
      portfolioItems.forEach(item=>{
        if(filter==='all') item.classList.remove('hidden');
        else if(item.dataset.category===filter) item.classList.remove('hidden');
        else item.classList.add('hidden');
      });
    }
    if(filterBtns.length){
      filterBtns.forEach(btn=>btn.addEventListener('click', function(){
        const active = document.querySelector('.filter-btn.active'); if(active) active.classList.remove('active');
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      }));
    }

    // Reveal on scroll: handled by AOS (Animate On Scroll). IntersectionObserver fallback removed to avoid duplicate animations.

    // Smooth scroll for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        const href = a.getAttribute('href'); if(href.length>1){ const el = document.querySelector(href); if(el){ ev.preventDefault(); el.scrollIntoView({behavior:'smooth'}); } }
      });
    });

    // LIGHTBOX: click any .portfolio-thumb image to open a modal
    function createLightbox(){
      const lb = document.createElement('div'); lb.className='lightbox';
      lb.innerHTML = '<div class="inner"><img alt="" /><button class="close" aria-label="Close">✕</button></div>';
      document.body.appendChild(lb);
      const img = lb.querySelector('img');
      const close = lb.querySelector('.close');
      function open(src, alt){ img.src = src; img.alt = alt||''; lb.classList.add('open'); document.body.style.overflow='hidden'; }
      function closeLB(){ lb.classList.remove('open'); img.src=''; document.body.style.overflow=''; }
      close.addEventListener('click', closeLB);
      lb.addEventListener('click', (ev)=>{ if(ev.target===lb) closeLB(); });
      document.addEventListener('keydown', (ev)=>{ if(ev.key==='Escape') closeLB(); });
      return {open,close:closeLB};
    }

    const lightbox = createLightbox();
    document.querySelectorAll('.portfolio-thumb').forEach(img=>{
      img.style.cursor='zoom-in';
      img.addEventListener('click', ()=>{
        const src = img.getAttribute('src'); if(!src) return; lightbox.open(src, img.alt);
      });
    });

    // Contact form helper (if the form exists)
    const contactForm = document.getElementById('contactForm');
    if(contactForm) contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const project = document.getElementById('project').value.trim();
      const date = document.getElementById('date').value.trim();
      const message = document.getElementById('message').value.trim();
      const subject = encodeURIComponent(`New enquiry from ${name} – ${project || 'Photo/Video project'}`);
      const bodyLines = [
        `Hi Shayonika,`, ``, `My name is ${name}. I'd love to work with you on a project.`, ``,
        `Project type: ${project || '(not specified yet)'}`, `Ideal date / timeframe: ${date || '(flexible)'}`, ``,
        `Details:`, `${message}`, ``, `You can reach me back on: ${email}`, ``, `Looking forward to hearing from you!`
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
    });

    // Footer year
    const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize AOS if available
    try{
      if(window.AOS && typeof window.AOS.init === 'function'){
        window.AOS.init({duration:700, once:true, offset:80});
      }
    }catch(e){
      console.warn('AOS init failed', e);
    }

  });

})();