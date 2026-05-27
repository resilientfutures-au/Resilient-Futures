(async () => {
  async function include(selector, partial) {
    const host = document.querySelector(selector);
    if (!host) return;
    const res = await fetch(partial);
    if (!res.ok) { console.error('Failed to load', partial); return; }
    host.innerHTML = await res.text();
  }
  await Promise.all([
    include('[data-include="nav"]', 'partials/nav.html'),
    include('[data-include="footer"]', 'partials/footer.html'),
  ]);

  // Mark current page active in the nav (preserves per-page highlighting
  // that used to be hand-coded into each page's inline nav block).
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-include="nav"] a[href]').forEach(a => {
    if (a.getAttribute('href').toLowerCase() !== here) return;
    if (a.classList.contains('nav-link')) {
      a.classList.add('nav-link--active');
    }
    if (a.classList.contains('nav-dropdown-item')) {
      const trigger = a.closest('.nav-dropdown')?.querySelector('.nav-dropdown-trigger');
      trigger?.classList.add('nav-dropdown-trigger--active');
    }
  });

  document.dispatchEvent(new Event('partials:loaded'));
})();

// Dropdown behaviour — delegated from document so it works regardless of
// when the nav partial finishes loading.
(() => {
  function closeAll() {
    document.querySelectorAll('.nav-dropdown').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.nav-dropdown-trigger');
    if (trigger) {
      e.stopPropagation();
      const dropdown = trigger.closest('.nav-dropdown');
      const wasOpen = dropdown.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
      return;
    }
    if (!e.target.closest('.nav-dropdown')) closeAll();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.nav-dropdown.open');
    if (!open) return;
    closeAll();
    open.querySelector('.nav-dropdown-trigger')?.focus();
  });
})();
