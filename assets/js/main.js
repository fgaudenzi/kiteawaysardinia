document.addEventListener('DOMContentLoaded', () => {
  const supportedLanguages = ['en', 'it', 'fr', 'de'];
  const defaultLanguage = 'en';
  const languagePreferenceKey = 'kiteaway_lang';
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const languageSwitcherLinks = Array.from(document.querySelectorAll('.language-switcher a'));
  const webcamVideo = document.getElementById('punta-trettu-webcam');

  const initSpotWebcam = () => {
    if (!webcamVideo) {
      return;
    }

    const streamUrl = webcamVideo.dataset.hlsSrc;
    if (!streamUrl) {
      return;
    }

    if (webcamVideo.canPlayType('application/vnd.apple.mpegurl')) {
      webcamVideo.src = streamUrl;
      return;
    }

    const attachHls = () => {
      if (!window.Hls || !window.Hls.isSupported()) {
        return;
      }

      const hls = new window.Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(webcamVideo);

      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        webcamVideo.play().catch(() => {});
      });

      hls.on(window.Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('Webcam stream error:', data.type);
        }
      });
    };

    if (window.Hls) {
      attachHls();
      return;
    }

    const hlsScript = document.createElement('script');
    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@1';
    hlsScript.async = true;
    hlsScript.onload = attachHls;
    document.head.appendChild(hlsScript);
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
  updateHeader();
  setupLanguagePreference();
  initSpotWebcam();
});
