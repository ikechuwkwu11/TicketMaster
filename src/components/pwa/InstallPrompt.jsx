import { useEffect, useMemo, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

const DISMISS_KEY = 'tm-pwa-install-dismissed';
const DISMISS_DAYS = 14;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    window.navigator.standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function wasDismissedRecently() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(null); // 'android' | 'ios'

  const canShow = useMemo(
    () => typeof window !== 'undefined' && !isStandalone() && !wasDismissedRecently(),
    [],
  );

  useEffect(() => {
    if (!canShow) return undefined;

    const onBip = (e) => {
      e.preventDefault();
      setDeferred(e);
      setMode('android');
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBip);

    // iOS has no beforeinstallprompt — show Share instructions once eligible
    if (isIos()) {
      const t = window.setTimeout(() => {
        setMode('ios');
        setVisible(true);
      }, 2500);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', onBip);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, [canShow]);

  if (!visible || !mode) return null;

  const close = () => {
    dismiss();
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    dismiss();
    setVisible(false);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:left-auto md:right-4 md:w-[360px]"
      role="dialog"
      aria-label="Install TicketMaster"
    >
      <div className="rounded-xl border border-[#303030] bg-[#171717] p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.45)]">
        <div className="flex items-start gap-3">
          <img
            src={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-[10px] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-white">
              Install TicketMaster
            </p>
            {mode === 'android' ? (
              <p className="mt-1 text-[13px] leading-snug text-[#A0A0A0]">
                Add the app to your home screen for faster access without the
                browser bar.
              </p>
            ) : (
              <p className="mt-1 text-[13px] leading-snug text-[#A0A0A0]">
                On iPhone: tap <Share className="mx-0.5 inline h-3.5 w-3.5" />{' '}
                <span className="font-semibold text-white">Share</span>, then{' '}
                <span className="font-semibold text-white">Add to Home Screen</span>.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-1 text-[#A0A0A0] hover:bg-white/5 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          {mode === 'android' ? (
            <button
              type="button"
              onClick={install}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#075BE8] px-3 py-2.5 text-[13px] font-bold text-white"
            >
              <Download className="h-4 w-4" />
              Install
            </button>
          ) : null}
          <button
            type="button"
            onClick={close}
            className="flex-1 rounded-md border border-[#303030] px-3 py-2.5 text-[13px] font-semibold text-white"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
