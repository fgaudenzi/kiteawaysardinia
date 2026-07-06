document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navbar-toggle');
  const mobileMenu = document.querySelector('.navbar__mobile');
  const nav = document.querySelector('.navbar');

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('is-open');
  });

  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
