// index.js — small helpers for filtering portfolio items and reveal-on-scroll
document.addEventListener('DOMContentLoaded', function(){
  // Filter buttons (use data-filter attributes)
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  if(filterBtns.length){
    filterBtns.forEach(btn=>btn.addEventListener('click', function(){
      const active = document.querySelector('.filter-btn.active');
      if(active) active.classList.remove('active');
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.portfolio-item').forEach(item=>{
        if(filter === 'all'){
          item.classList.remove('hidden');
        } else {
          if(item.dataset.category === filter) item.classList.remove('hidden');
          else item.classList.add('hidden');
        }
      });
    }));
  }

  // Simple reveal-on-scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if(reveals.length){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    },{threshold: 0.12});
    reveals.forEach(r=>io.observe(r));
  }

  // Smooth anchor scrolling for nav links (if present)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        const el = document.querySelector(href);
        if(el){
          ev.preventDefault();
          el.scrollIntoView({behavior:'smooth'});
        }
      }
    });
  });
});
