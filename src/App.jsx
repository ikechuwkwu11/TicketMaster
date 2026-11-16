import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import EventsListPage from './pages/EventsListPage';
import WatchlistPage from './pages/WatchlistPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ViewTicketsPage from './pages/ViewTicketsPage';
import DigitalTicketPage from './pages/DigitalTicketPage';
import AccountPage from './pages/AccountPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <Routes>
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
            <Route path="account" element={<AccountPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WatchlistProvider>
  );
}
