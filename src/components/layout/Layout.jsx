import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopNav from './DesktopNav';

export default function Layout() {
  const { pathname } = useLocation();
  const isViewTickets = pathname.startsWith('/my-tickets/') && pathname !== '/my-tickets/';

  return (
    <div
      className={`min-h-screen ${
        isViewTickets ? 'bg-[#F2F2F2] text-black' : 'bg-[#111111] text-white'
      }`}
    >
      {!isViewTickets && <DesktopNav />}
      <main
        className={
          isViewTickets
            ? 'min-h-screen'
            : 'mx-auto max-w-7xl pb-20 md:pb-8'
        }
      >
        <Outlet />
      </main>
      {!isViewTickets && <BottomNav />}
    </div>
  );
}
