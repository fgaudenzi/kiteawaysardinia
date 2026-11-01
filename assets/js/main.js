document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');

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

  // Gli URL restano stabili e non vengono reindirizzati in base alla lingua browser.
  // La lingua è selezionata dall'utente tramite i link di navigazione.
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
  initEmbedConsent();
});
