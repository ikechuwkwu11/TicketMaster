import { useEffect, useState } from 'react';
import { NavLink, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Menu,
  Ticket,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/tickets', label: 'Tickets & Seats', icon: Ticket },
  { to: '/admin/sections', label: 'Homepage Sections', icon: LayoutList },
  { to: '/admin/images', label: 'Images', icon: ImageIcon },
];

function NavItems({ onNavigate }) {
  return (
    <>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-semibold transition ${
                isActive
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default function AdminLayout() {
  const { authed, checking, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] px-4 text-[#64748B]">
        Loading admin…
      </div>
    );
  }

  if (!authed) return <Navigate to="/admin/login" replace />;

  const closeMenu = () => setMenuOpen(false);

  const footerLinks = (
    <div className="space-y-1 border-t border-white/10 px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <a
        href="/#/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-semibold text-[#94A3B8] hover:bg-white/5 hover:text-white"
      >
        <ExternalLink className="h-4 w-4" />
        Open app
      </a>
      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/admin/login');
        }}
        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-semibold text-[#94A3B8] hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );

  return (
    <div data-admin className="flex min-h-screen bg-[#F4F5F7] text-[#1A1A1A]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col bg-[#0F172A] text-white md:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
            TicketMaster
          </p>
          <h1 className="mt-1 text-[18px] font-bold">Admin</h1>
        </div>
        <NavItems />
        {footerLinks}
      </aside>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,280px)] flex-col bg-[#0F172A] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
                  TicketMaster
                </p>
                <h1 className="mt-1 text-[17px] font-bold">Admin</h1>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="rounded-md p-2 text-[#94A3B8] hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavItems onNavigate={closeMenu} />
            {footerLinks}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 backdrop-blur md:hidden pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-md border border-[#E2E8F0] bg-white p-2 text-[#0F172A]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94A3B8]">
              TicketMaster
            </p>
            <p className="truncate text-[15px] font-bold text-[#0F172A]">Admin</p>
          </div>
        </header>

        <div className="min-w-0 flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
