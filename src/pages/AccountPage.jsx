import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Shield, User } from 'lucide-react';
import {
  getPushPermission,
  pushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from '../pwa/push';

const rows = [
  'My Account',
  'Purchase History',
  'Payment Methods',
  'Help & Support',
];

export default function AccountPage() {
  const [pushStatus, setPushStatus] = useState('loading');
  const [pushBusy, setPushBusy] = useState(false);
  const [pushMessage, setPushMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!pushSupported()) {
        if (!cancelled) setPushStatus('unsupported');
        return;
      }
      const permission = await getPushPermission();
      if (!cancelled) setPushStatus(permission);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const enablePush = async () => {
    setPushBusy(true);
    setPushMessage('');
    try {
      const result = await subscribeToPush();
      if (result.ok) {
        setPushStatus('granted');
        setPushMessage(
          'Notifications enabled for booking updates and event reminders.',
        );
      } else if (result.reason === 'denied') {
        setPushStatus('denied');
        setPushMessage(
          'Permission denied. Enable notifications in your browser settings.',
        );
      }
    } catch (err) {
      setPushMessage(err.message || 'Could not enable notifications.');
    } finally {
      setPushBusy(false);
    }
  };

  const disablePush = async () => {
    setPushBusy(true);
    setPushMessage('');
    try {
      await unsubscribeFromPush();
      setPushStatus('default');
      setPushMessage('Notifications turned off on this device.');
    } catch (err) {
      setPushMessage(err.message || 'Could not disable notifications.');
    } finally {
      setPushBusy(false);
    }
  };

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8">
      <h1 className="mb-5 text-xl font-bold text-white">Account</h1>

      <div className="mb-6 flex items-center gap-3 rounded-[6px] border border-[#303030] bg-[#242424] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171717]">
          <User className="h-6 w-6 text-[#A0A0A0]" />
        </div>
        <div>
          <p className="font-semibold text-white">Guest User</p>
          <p className="text-sm text-[#A0A0A0]">Sign in to sync your tickets</p>
        </div>
      </div>

      <ul className="overflow-hidden rounded-[6px] border border-[#303030] bg-[#242424]">
        {rows.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-white hover:bg-[#2a2a2a] ${
                i > 0 ? 'border-t border-[#303030]' : ''
              }`}
            >
              {label}
              <ChevronRight className="h-4 w-4 text-[#A0A0A0]" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-[6px] border border-[#303030] bg-[#242424] p-4">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-[#A0A0A0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">Push notifications</p>
            <p className="mt-1 text-[13px] leading-snug text-[#A0A0A0]">
              Opt in for booking confirmations, upcoming-event reminders, and
              important ticket updates. We only subscribe after you allow
              permission.
            </p>
            {pushStatus === 'unsupported' ? (
              <p className="mt-2 text-[12px] text-[#A0A0A0]">
                Not supported in this browser. On iPhone, install to Home Screen
                first (iOS 16.4+).
              </p>
            ) : null}
            {pushMessage ? (
              <p className="mt-2 text-[12px] text-[#A0A0A0]">{pushMessage}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {pushStatus !== 'granted' ? (
                <button
                  type="button"
                  disabled={pushBusy || pushStatus === 'unsupported'}
                  onClick={enablePush}
                  className="rounded-md bg-[#075BE8] px-3 py-2 text-[13px] font-bold text-white disabled:opacity-50"
                >
                  {pushBusy ? 'Working…' : 'Enable notifications'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={pushBusy}
                  onClick={disablePush}
                  className="rounded-md border border-[#303030] px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                >
                  {pushBusy ? 'Working…' : 'Turn off'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/admin/login"
        className="mt-4 flex w-full items-center justify-between rounded-[6px] border border-[#303030] bg-[#242424] px-4 py-3.5 text-sm text-white hover:bg-[#2a2a2a]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Shield className="h-4 w-4 text-[#A0A0A0]" />
          Admin Console
        </span>
        <ChevronRight className="h-4 w-4 text-[#A0A0A0]" />
      </Link>

      <button
        type="button"
        className="mt-6 w-full rounded-md border border-[#303030] py-3 text-sm font-semibold text-white hover:bg-[#171717]"
      >
        Sign In
      </button>
    </div>
  );
}
