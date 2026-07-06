document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-accordion] .accordion__item').forEach((item) => {
    item.querySelector('.accordion__header')?.addEventListener('click', () => {
      const isOpen = item.hasAttribute('open');
      document.querySelectorAll('[data-accordion] .accordion__item').forEach((other) => other.removeAttribute('open'));
      if (!isOpen) item.setAttribute('open', '');
    });
  });
});
