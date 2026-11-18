import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      // Periodically check for updates while the app is open
      setInterval(() => {
        registration.update().catch(() => {});
      }, 60 * 60 * 1000);
      if (import.meta.env.DEV) {
        console.info('[PWA] registered', swUrl);
      }
    },
    onRegisterError(error) {
      console.warn('[PWA] registration failed', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[90] px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 rounded-xl border border-[#303030] bg-[#171717] px-4 py-3 shadow-lg">
        <p className="text-[13px] font-medium text-white">
          A new version of TicketMaster is ready.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            className="rounded-md px-3 py-1.5 text-[12px] font-semibold text-[#A0A0A0]"
          >
            Later
          </button>
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="rounded-md bg-[#075BE8] px-3 py-1.5 text-[12px] font-bold text-white"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
