document.addEventListener('DOMContentLoaded', () => {
  const supportedLanguages = ['en', 'it', 'fr', 'de'];
  const defaultLanguage = 'en';
  const languagePreferenceKey = 'kiteaway_lang';
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const languageSwitcherLinks = Array.from(document.querySelectorAll('.language-switcher a'));

  // Contenuti di terze parti (Google Maps, Windguru): vengono caricati solo
  // dopo il clic esplicito dell'utente, quindi nessun dato lascia il sito prima.

  const loadScript = (src, onload) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (onload) {
      script.onload = onload;
    }
    document.head.appendChild(script);
    return script;
  };

  const loadMap = (box) => {
    const iframe = document.createElement('iframe');
    iframe.src = box.dataset.embedSrc;
    iframe.title = box.dataset.embedTitle || 'Map';
    iframe.width = '600';
    iframe.height = '450';
    iframe.style.border = '0';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceWith(iframe);
  };

  const loadWindguru = (box) => {
    const uid = 'wg_fwdg_436366_21_1787992405146';
    const args = ['s=436366', 'm=21', `uid=${uid}`, 'wj=knots', 'tj=c', 'waj=m', 'tij=cm', 'odh=9', 'doh=20',
      'fhours=240', 'hrsm=1', 'vt=forecasts', 'lng=en', 'p=WINDSPD,GUST,MWINDSPD,SMER,TMPE,CDC,APCP1s,RATING'];
    const anchor = document.createElement('script');
    anchor.id = uid;
    box.replaceWith(anchor);
    loadScript(`https://www.windguru.cz/js/widget.php?${args.join('&')}`);
  };

  const embedLoaders = { map: loadMap, windguru: loadWindguru };

  const consentKey = 'kiteaway_consent';
  const readConsent = () => {
    try { return localStorage.getItem(consentKey); } catch (e) { return null; }
  };
  const writeConsent = (value) => {
    try {
      if (value === null) { localStorage.removeItem(consentKey); } else { localStorage.setItem(consentKey, value); }
    } catch (e) { /* storage non disponibile */ }
  };

  const loadEmbed = (box) => {
    const loader = embedLoaders[box.dataset.embedType];
    if (loader && box.isConnected) {
      loader(box);
    }
  };
  const loadAllEmbeds = () => document.querySelectorAll('[data-embed-consent]').forEach(loadEmbed);

  const initEmbedConsent = () => {
    const modal = document.querySelector('[data-cookie-modal]');
    const showModal = () => {
      if (!modal) { return; }
      modal.hidden = false;
      modal.querySelector('[data-consent-accept]')?.focus();
    };
    const hideModal = () => { if (modal) { modal.hidden = true; } };

    // Bottone sul singolo riquadro: carica solo quel contenuto
    document.querySelectorAll('[data-embed-consent]').forEach((box) => {
      box.querySelector('[data-embed-load]')?.addEventListener('click', () => loadEmbed(box));
    });

    modal?.querySelector('[data-consent-accept]')?.addEventListener('click', () => {
      writeConsent('granted');
      hideModal();
      loadAllEmbeds();
    });
    modal?.querySelector('[data-consent-reject]')?.addEventListener('click', () => {
      const wasGranted = readConsent() === 'granted';
      writeConsent('denied');
      hideModal();
      if (wasGranted) { window.location.reload(); }
    });
    document.querySelectorAll('[data-open-consent]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showModal();
      });
    });

    const consent = readConsent();
    if (consent === 'granted') {
      loadAllEmbeds();
    } else if (consent === null) {
      showModal();
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
  updateHeader();
  setupLanguagePreference();
  initEmbedConsent();
});
