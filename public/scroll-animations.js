// Vanilla IntersectionObserver for scroll reveal
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-scroll-reveal]').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.dataset.revealOnce === 'true') {
          observer.unobserve(entry.target);
        }
      } else if (entry.target.dataset.revealOnce !== 'true') {
        entry.target.classList.remove('visible');
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
  document.querySelectorAll('[data-scroll-reveal]').forEach(el => observer.observe(el));
})();