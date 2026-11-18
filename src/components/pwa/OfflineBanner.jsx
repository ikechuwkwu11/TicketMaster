import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

/** Only show when the device truly has no network — not when the API is just unavailable. */
export default function OfflineBanner() {
  const { refresh } = useCatalog();
  const [offline, setOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );
  const [recovered, setRecovered] = useState(false);

  useEffect(() => {
    const goOffline = () => {
      setOffline(true);
      setRecovered(false);
    };
    const goOnline = () => {
      setOffline(false);
      setRecovered(true);
      refresh();
      window.setTimeout(() => setRecovered(false), 3500);
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [refresh]);

  if (!offline && !recovered) return null;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[85] px-3 pt-[max(0.5rem,env(safe-area-inset-top))] ${
        offline ? '' : 'pointer-events-none'
      }`}
      role="status"
    >
      <div
        className={`mx-auto flex max-w-lg items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold shadow-lg ${
          offline
            ? 'border border-[#334155] bg-[#1E293B] text-[#E2E8F0]'
            : 'border border-[#14532D] bg-[#052E16] text-[#BBF7D0]'
        }`}
      >
        {offline ? <WifiOff className="h-4 w-4 shrink-0" /> : null}
        <span>
          {offline
            ? 'No internet connection. You can still browse saved events and tickets.'
            : 'Back online.'}
        </span>
      </div>
    </div>
  );
}
