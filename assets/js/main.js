document.addEventListener('DOMContentLoaded', () => {
  const supportedLanguages = ['en', 'it', 'fr', 'de'];
  const defaultLanguage = 'en';
  const languagePreferenceKey = 'kiteaway_lang';
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const languageSwitcherLinks = Array.from(document.querySelectorAll('.language-switcher a'));
  const spotStory = document.querySelector('#spot .spot-story--media-right');
  const spotStoryContent = spotStory?.querySelector('.spot-story__content');
  const windguruEmbed = spotStory?.querySelector('[data-windguru-embed]');

  const syncWindguruHeight = () => {
    if (!spotStory || !spotStoryContent || !windguruEmbed) {
      return;
    }

    const isDesktop = window.matchMedia('(min-width: 861px)').matches;
    const windguruIframe = windguruEmbed.querySelector('iframe');

    if (!isDesktop) {
      windguruEmbed.style.height = '';
      if (windguruIframe) {
        windguruIframe.style.height = '';
      }
      return;
    }

    const targetHeight = Math.ceil(spotStoryContent.getBoundingClientRect().height);
    if (targetHeight > 0) {
      const heightPx = `${targetHeight}px`;
      windguruEmbed.style.height = heightPx;
      if (windguruIframe) {
        windguruIframe.style.height = heightPx;
      }
    }
  };

  const getLanguageFromPath = (pathName, basePath) => {
    const pathWithoutBase = pathName.startsWith(basePath) ? pathName.slice(basePath.length) : pathName;
    const normalized = pathWithoutBase.replace(/^\/+|\/+$/g, '');
    if (!normalized) {
      return null;
    }

    const firstSegment = normalized.split('/')[0];
    return supportedLanguages.includes(firstSegment) ? firstSegment : null;
  };

  const detectBrowserLanguage = () => {
    const browserLanguages = (navigator.languages && navigator.languages.length > 0)
      ? navigator.languages
      : [navigator.language || defaultLanguage];

    for (const lang of browserLanguages) {
      const normalized = String(lang).toLowerCase().split('-')[0];
      if (supportedLanguages.includes(normalized)) {
        return normalized;
      }
    }

    return defaultLanguage;
  };

  const setupLanguagePreference = () => {
    if (languageSwitcherLinks.length === 0) {
      return;
    }

    const enLink = languageSwitcherLinks[0];
    const enPath = new URL(enLink.href, window.location.origin).pathname;
    const basePath = enPath.replace(/\/+$/, '');
    const isRootPath =
      window.location.pathname === `${basePath}/` ||
      window.location.pathname === basePath ||
      window.location.pathname === `${basePath}/index.html`;
    const currentLanguage = getLanguageFromPath(window.location.pathname, basePath);

    if (currentLanguage) {
      localStorage.setItem(languagePreferenceKey, currentLanguage);
      return;
    }

    if (isRootPath) {
      const savedLanguage = localStorage.getItem(languagePreferenceKey);
      const preferredLanguage = supportedLanguages.includes(savedLanguage)
        ? savedLanguage
        : detectBrowserLanguage();

      if (preferredLanguage !== defaultLanguage) {
        const targetPath = `${basePath}/${preferredLanguage}/`;
        const targetUrl = `${targetPath}${window.location.search}${window.location.hash}`;
        window.location.replace(targetUrl);
        return;
      }
    }

    languageSwitcherLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const lang = getLanguageFromPath(new URL(link.href, window.location.origin).pathname, basePath) || defaultLanguage;
        localStorage.setItem(languagePreferenceKey, lang);
      });
    });
  };

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
  window.addEventListener('resize', syncWindguruHeight);

  if (spotStoryContent && windguruEmbed && 'ResizeObserver' in window) {
    const windguruHeightObserver = new ResizeObserver(syncWindguruHeight);
    windguruHeightObserver.observe(spotStoryContent);
    windguruHeightObserver.observe(windguruEmbed);
  }

  if (spotStoryContent && windguruEmbed) {
    const syncSchedule = [0, 200, 500, 1000, 1800, 2600];
    syncSchedule.forEach((delay) => {
      window.setTimeout(syncWindguruHeight, delay);
    });
  }

  updateHeader();
  setupLanguagePreference();
  syncWindguruHeight();
});
