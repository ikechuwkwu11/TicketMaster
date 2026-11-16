import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { searchEvents } from '../data/events';
import SearchBar from '../components/layout/SearchBar';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const results = searchEvents(q);

  return (
    <div className="px-4 py-4 md:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-3 md:hidden">
        <Link
          to="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#303030]"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <SearchBar compact />
        </div>
      </div>

      <h1 className="mb-1 text-xl font-bold text-white">Search</h1>
      {q && (
        <p className="mb-5 text-sm text-[#A0A0A0]">
          Results for &ldquo;{q}&rdquo; · {results.length} found
        </p>
      )}

      {!q && (
        <div className="flex flex-col items-center py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-[#303030]" />
          <p className="text-[#A0A0A0]">Search events, artists, venues...</p>
        </div>
      )}

      <ul className="space-y-3">
        {results.map((event) => (
          <li key={event.id}>
            <Link
              to={`/event/${event.slug}`}
              className="flex overflow-hidden rounded-[6px] border border-[#303030] bg-[#242424]"
            >
              <img
                src={event.image}
                alt=""
                className="h-20 w-24 shrink-0 object-cover"
              />
              <div className="min-w-0 p-3">
                <h3 className="truncate text-sm font-bold uppercase text-white">
                  {event.title}
                </h3>
                <p className="mt-0.5 truncate text-xs text-[#A0A0A0]">
                  {event.dateLabel ||
                    event.location ||
                    event.venue ||
                    event.category}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {q && results.length === 0 && (
        <p className="py-12 text-center text-[#A0A0A0]">No matches found.</p>
      )}
    </div>
  );
}
