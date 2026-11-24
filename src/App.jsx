import { HashRouter, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import { CatalogProvider } from './context/CatalogContext';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import EventsListPage from './pages/EventsListPage';
import WatchlistPage from './pages/WatchlistPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ViewTicketsPage from './pages/ViewTicketsPage';
import DigitalTicketPage from './pages/DigitalTicketPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import TransferredPage from './pages/TransferredPage';
import AccountPage from './pages/AccountPage';
import EditDetailsPage from './pages/EditDetailsPage';
import AcceptTicketsPage from './pages/AcceptTicketsPage';
import SearchPage from './pages/SearchPage';
import { UserProfileProvider } from './context/UserProfileContext';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminEvents from './admin/pages/AdminEvents';
import AdminEventForm from './admin/pages/AdminEventForm';
import AdminTickets from './admin/pages/AdminTickets';
import AdminTicketForm from './admin/pages/AdminTicketForm';
import AdminSections from './admin/pages/AdminSections';
import AdminImages from './admin/pages/AdminImages';
import InstallPrompt from './components/pwa/InstallPrompt';
import UpdatePrompt from './components/pwa/UpdatePrompt';
import OfflineBanner from './components/pwa/OfflineBanner';
import IosStandaloneNavFix from './components/pwa/IosStandaloneNavFix';

export default function App() {
  return (
    <CatalogProvider>
      <WatchlistProvider>
        <UserProfileProvider>
          <AdminAuthProvider>
            {/* HashRouter keeps iOS Home Screen apps from escaping into Safari on tab changes */}
            <HashRouter>
              <IosStandaloneNavFix />
              <OfflineBanner />
              <UpdatePrompt />
              <InstallPrompt />
              <Routes>
                <Route path="admin/login" element={<AdminLogin />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="events/new" element={<AdminEventForm />} />
                  <Route path="events/:id" element={<AdminEventForm />} />
                  <Route path="tickets" element={<AdminTickets />} />
                  <Route path="tickets/new" element={<AdminTicketForm />} />
                  <Route path="tickets/:id" element={<AdminTicketForm />} />
                  <Route path="sections" element={<AdminSections />} />
                  <Route path="images" element={<AdminImages />} />
                </Route>

                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="event/:slug" element={<EventDetailPage />} />
                  <Route path="category/:category" element={<EventsListPage />} />
                  <Route path="watchlist" element={<WatchlistPage />} />
                  <Route path="my-tickets" element={<MyTicketsPage />} />
                  <Route path="my-tickets/:slug" element={<ViewTicketsPage />} />
                  <Route
                    path="my-tickets/:slug/admission"
                    element={<DigitalTicketPage />}
                  />
                  <Route
                    path="my-tickets/:slug/details"
                    element={<TicketDetailsPage />}
                  />
                  <Route
                    path="my-tickets/:slug/transferred"
                    element={<TransferredPage />}
                  />
                  <Route path="account" element={<AccountPage />} />
                  <Route path="account/edit" element={<EditDetailsPage />} />
                  <Route path="accept-tickets" element={<AcceptTicketsPage />} />
                  <Route path="search" element={<SearchPage />} />
                </Route>
              </Routes>
            </HashRouter>
          </AdminAuthProvider>
        </UserProfileProvider>
      </WatchlistProvider>
    </CatalogProvider>
  );
}
