import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/category/concerts', label: 'Concerts' },
  { to: '/category/sports', label: 'Sports' },
  { to: '/category/arts', label: 'Arts & Theater' },
  { to: '/category/family', label: 'Family' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/my-tickets', label: 'My Tickets' },
];

export default function DesktopNav() {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-[#303030] bg-[#111111]/95 backdrop-blur-md md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#075BE8] text-lg font-extrabold italic text-white">
            t
            <span className="absolute right-0.5 top-0.5 text-[9px] not-italic">★</span>
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            TicketMaster
          </span>
        </Link>

        <div className="mx-auto w-full max-w-md flex-1">
          <SearchBar />
        </div>

        <nav className="flex shrink-0 items-center gap-1">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#075BE8]'
                    : 'text-[#A0A0A0] hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `ml-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                isActive ? 'text-[#075BE8]' : 'text-[#A0A0A0] hover:text-white'
              }`
            }
          >
            Account
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
