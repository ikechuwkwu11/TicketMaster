import { NavLink } from 'react-router-dom';
import { Bookmark, Ticket, User } from 'lucide-react';
import { useUserProfile } from '../../context/UserProfileContext';

function HomeIcon({ active }) {
  return (
    <span
      className={`relative flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-extrabold italic leading-none ${
        active ? 'bg-[#075BE8] text-white' : 'bg-[#2a2a2a] text-white'
      }`}
    >
      t
      <span
        className="pointer-events-none absolute -right-[1px] -top-[1px] text-[7px] font-normal not-italic leading-none"
        aria-hidden
      >
        ★
      </span>
    </span>
  );
}

const items = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { to: '/my-tickets', label: 'My Tickets', icon: Ticket },
  { to: '/account', label: 'Account', icon: User, badgeKey: 'inbox' },
];

export default function BottomNav() {
  const { inboxCount } = useUserProfile();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#303030] bg-[#000000] pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      <ul className="grid h-[58px] grid-cols-4">
        {items.map(({ to, label, icon: Icon, end, badgeKey }) => (
          <li key={to} className="relative">
            <NavLink
              to={to}
              end={end}
              className="flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-1/2 top-0 h-[2px] w-10 -translate-x-1/2 bg-[#075BE8]" />
                  )}
                  {Icon === 'home' ? (
                    <HomeIcon active={isActive} />
                  ) : (
                    <span className="relative">
                      {isActive && label === 'Account' ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#075BE8]">
                          <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                        </span>
                      ) : (
                        <Icon
                          className={`h-5 w-5 ${
                            isActive ? 'text-[#075BE8]' : 'text-white'
                          }`}
                          strokeWidth={1.75}
                        />
                      )}
                      {badgeKey === 'inbox' && inboxCount > 0 ? (
                        <span className="absolute -right-2.5 -top-1.5 inline-flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#FF3B30] px-1 text-[9px] font-bold leading-none text-white">
                          {inboxCount}
                        </span>
                      ) : null}
                    </span>
                  )}
                  <span
                    className={
                      isActive ? 'font-semibold text-white' : 'text-white'
                    }
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
