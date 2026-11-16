import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className={compact ? 'w-full' : 'w-full max-w-xl'}>
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-[#A0A0A0]"
          strokeWidth={2.25}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, artists, venues..."
          className="w-full rounded-full border border-[#303030] bg-[#171717] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#A0A0A0] outline-none transition-colors focus:border-[#075BE8]"
          aria-label="Search events, artists, venues and festivals"
        />
      </div>
    </form>
  );
}
