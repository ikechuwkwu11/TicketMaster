import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * iOS Home Screen web apps often break out into Safari when <a href="/path">
 * triggers a document navigation. Keep same-origin app links inside React Router
 * so Watchlist / My Tickets / Account stay fullscreen.
 */
function isStandaloneDisplay() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}

function routeFromUrl(url) {
  // HashRouter links look like https://host/#/my-tickets
  if (url.hash && url.hash.startsWith('#/')) {
    return url.hash.slice(1) || '/';
  }
  if (url.hash === '#' || url.hash === '') {
    return `${url.pathname}${url.search}` || '/';
  }
  return `${url.pathname}${url.search}${url.hash}` || '/';
}

export default function IosStandaloneNavFix() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStandaloneDisplay()) return undefined;

    const onClick = (event) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;

      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const hrefAttr = anchor.getAttribute('href');
      if (
        !hrefAttr ||
        hrefAttr.startsWith('mailto:') ||
        hrefAttr.startsWith('tel:')
      ) {
        return;
      }

      let url;
      try {
        url = new URL(hrefAttr, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      navigate(routeFromUrl(url));
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  return null;
}
