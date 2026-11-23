import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  Shield,
  ShieldCheck,
  UserRoundPen,
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import {
  getPushPermission,
  pushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from '../pwa/push';

function Section({ title, children }) {
  return (
    <section className="mb-7">
      <h2 className="mb-2.5 px-1 text-[17px] font-bold text-white">{title}</h2>
      <ul className="overflow-hidden rounded-2xl bg-[#1C1C1E]">{children}</ul>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  to,
  badge,
  divider = true,
  trailing,
  onClick,
}) {
  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3.5">
        <Icon className="h-[22px] w-[22px] shrink-0 text-[#C7C7CC]" strokeWidth={1.75} />
        <span className="truncate text-[16px] text-white">{label}</span>
        {badge != null && badge > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF3B30] px-1.5 text-[11px] font-bold leading-none text-white">
            {badge}
          </span>
        ) : null}
      </span>
      {trailing || (
        <ChevronRight className="h-5 w-5 shrink-0 text-[#636366]" strokeWidth={2} />
      )}
    </>
  );

  const className = `flex w-full items-center justify-between px-4 py-[14px] text-left ${
    divider ? 'border-b border-[#2C2C2E]' : ''
  }`;

  if (to) {
    return (
      <li>
        <Link to={to} className={className}>
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    </li>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 ${
        checked ? 'bg-[#075BE8]' : 'bg-[#39393D]'
      }`}
    >
      <span
        className={`absolute top-[2px] left-0 h-[27px] w-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 ease-out ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

export default function AccountPage() {
  const {
    name,
    email,
    initials,
    hasDetails,
    locationContent,
    notifications,
    inboxCount,
    updateProfile,
  } = useUserProfile();
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function syncPush() {
      if (!pushSupported()) return;
      const permission = await getPushPermission();
      if (cancelled) return;
      if (permission === 'granted' && !notifications) {
        updateProfile({ notifications: true });
      }
    }
    syncPush();
    return () => {
      cancelled = true;
    };
  }, [notifications, updateProfile]);

  const onToggleLocation = (next) => {
    updateProfile({ locationContent: next });
  };

  const onToggleNotifications = async (next) => {
    updateProfile({ notifications: next });
    if (!pushSupported()) return;
    setPushBusy(true);
    try {
      if (next) {
        const result = await subscribeToPush();
        if (!result.ok && result.reason === 'denied') {
          updateProfile({ notifications: false });
        }
      } else {
        await unsubscribeFromPush();
      }
    } catch {
      /* keep local preference */
    } finally {
      setPushBusy(false);
    }
  };

  const displayName = hasDetails ? name || 'Account' : 'Guest User';
  const displayEmail = hasDetails
    ? email || 'Add your email in Edit Details'
    : 'Tap Edit Details to add your name & email';

  return (
    <div className="min-h-[100dvh] bg-[#000000] px-4 pb-8 pt-5 md:px-6 lg:px-8">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#075BE8] p-[3px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1C1C1E]">
            <span className="text-[22px] font-bold tracking-wide text-white">
              {hasDetails ? initials : '?'}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[26px] font-bold leading-tight tracking-tight text-white">
            {displayName}
          </p>
          <p className="mt-0.5 truncate text-[14px] text-[#8E8E93]">{displayEmail}</p>
        </div>
      </div>

      <Section title="Personalization">
        <Row icon={Mail} label="My Inbox" badge={inboxCount} />
        <Row icon={Heart} label="Favorites" to="/watchlist" />
        <Row icon={MapPin} label="Location" divider={false} />
      </Section>

      <Section title="Permissions">
        <Row
          icon={Navigation}
          label="Location Content"
          trailing={
            <Toggle checked={locationContent} onChange={onToggleLocation} />
          }
        />
        <Row
          icon={Bell}
          label="Notifications"
          divider={false}
          trailing={
            <Toggle
              checked={notifications}
              onChange={onToggleNotifications}
              disabled={pushBusy}
            />
          }
        />
      </Section>

      <Section title="Account">
        <Row icon={UserRoundPen} label="Edit Details" to="/account/edit" />
        <Row icon={ShieldCheck} label="Security" />
        <Row
          icon={CreditCard}
          label="Saved Payment Methods"
          divider={false}
        />
      </Section>

      <Section title="Help & Guidance">
        <Row icon={HelpCircle} label="Need Help?" />
        <Row icon={MessageSquare} label="Give Us Feedback" divider={false} />
      </Section>

      <div className="mb-2 overflow-hidden rounded-2xl bg-[#1C1C1E]">
        <Link
          to="/admin/login"
          className="flex w-full items-center justify-between px-4 py-[14px] text-left"
        >
          <span className="flex min-w-0 flex-1 items-center gap-3.5">
            <Shield
              className="h-[22px] w-[22px] shrink-0 text-[#C7C7CC]"
              strokeWidth={1.75}
            />
            <span className="truncate text-[16px] text-white">Admin Console</span>
          </span>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-[#636366]"
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}
