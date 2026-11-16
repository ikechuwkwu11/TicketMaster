import { NavLink } from 'react-router-dom';
import { Bookmark, Ticket, User } from 'lucide-react';

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
  { to: '/account', label: 'Account', icon: User },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#303030] bg-[#111111] pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      <ul className="grid h-[58px] grid-cols-4">
        {items.map(({ to, label, icon: Icon, end }) => (
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
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? 'text-[#075BE8]' : 'text-white'
                      }`}
                      strokeWidth={1.75}
                    />
                  )}
                  <span
                    className={
                      isActive ? 'font-semibold text-[#075BE8]' : 'text-white'
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
