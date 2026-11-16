import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Ticket,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/tickets', label: 'Tickets & Seats', icon: Ticket },
  { to: '/admin/sections', label: 'Homepage Sections', icon: LayoutList },
  { to: '/admin/images', label: 'Images', icon: ImageIcon },
];

export default function AdminLayout() {
  const { authed, checking, logout } = useAdminAuth();
  const navigate = useNavigate();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] text-[#64748B]">
        Loading admin…
      </div>
    );
  }

  if (!authed) return <Navigate to="/admin/login" replace />;

  return (
    <div data-admin className="flex min-h-screen bg-[#F4F5F7] text-[#1A1A1A]">
      <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col bg-[#0F172A] text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
            TicketMaster
          </p>
          <h1 className="mt-1 text-[18px] font-bold">Admin</h1>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          <a
            href="/"
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
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
