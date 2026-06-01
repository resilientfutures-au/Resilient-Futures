(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const markVisible = (el) => el.classList.add('reveal-visible');

  const isInViewport = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };

  const init = () => {
    const targets = document.querySelectorAll('.reveal:not(.reveal-visible)');
    if (reduced) {
      targets.forEach(markVisible);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => {
      if (isInViewport(el)) {
        // Already in view at script-init: skip the animation.
        markVisible(el);
      } else {
        io.observe(el);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init after partials (nav/footer) inject — they may contain
  // reveal targets and existing targets may shift position.
  document.addEventListener('partials:loaded', init);
})();
