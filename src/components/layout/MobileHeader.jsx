import SearchBar from './SearchBar';

export default function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#111111] px-4 pb-3 pt-3 md:hidden">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#075BE8] text-[15px] font-extrabold italic leading-none text-white">
          t
          <span className="absolute right-0 top-0 text-[8px] not-italic leading-none">
            ★
          </span>
        </span>
        <span className="text-[17px] font-bold tracking-tight text-white">
          TicketMaster
        </span>
      </div>
      <SearchBar compact />
    </header>
  );
}
