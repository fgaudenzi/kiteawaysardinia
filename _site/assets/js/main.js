document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  menu?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
});
