// Mobile nav toggle
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
navBurger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navBurger.classList.toggle('open');
  const bars = navBurger.querySelectorAll('span');
  if (navBurger.classList.contains('open')) {
    bars[0].style.transform = 'translateY(3px) rotate(45deg)';
    bars[1].style.transform = 'translateY(-3px) rotate(-45deg)';
  } else {
    bars[0].style.transform = '';
    bars[1].style.transform = '';
  }
});
// Close nav when clicking a link (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navBurger.classList.remove('open');
      const bars = navBurger.querySelectorAll('span');
      bars[0].style.transform = '';
      bars[1].style.transform = '';
    }
  });
});
// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealElements.forEach(el => observer.observe(el));
// Portfolio filters
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});
// Contact form: open mail client with prefilled content
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const project = document.getElementById('project').value.trim();
  const date = document.getElementById('date').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`New enquiry from ${name} – ${project || 'Photo/Video project'}`);
  const bodyLines = [
    `Hi Shayonika,`,
    ``,
    `My name is ${name}. I'd love to work with you on a project.`,
    ``,
    `Project type: ${project || '(not specified yet)'}`,
    `Ideal date / timeframe: ${date || '(flexible)'}`,
    ``,
    `Details:`,
    `${message}`,
    ``,
    `You can reach me back on: ${email}`,
    ``,
    `Looking forward to hearing from you!`
  ];
  const body = encodeURIComponent(bodyLines.join('\n'));
  // TODO: Replace email below with her real contact email
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
}
// Footer year
document.getElementById('year').textContent = new Date().getFullYear();