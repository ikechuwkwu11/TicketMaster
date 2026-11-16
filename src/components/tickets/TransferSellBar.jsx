import { ArrowUpRight, RefreshCcw } from 'lucide-react';

export default function TransferSellBar({ onTransfer, onSell, hidden }) {
  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 md:bottom-8">
      <div className="pointer-events-auto flex overflow-hidden rounded-full border border-[#E5E5E5] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onTransfer}
          className="flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-black"
        >
          <ArrowUpRight className="h-5 w-5 text-[#075BE8]" strokeWidth={2.5} />
          Transfer
        </button>
        <span className="my-2.5 w-px bg-[#D8D8D8]" />
        <button
          type="button"
          onClick={onSell}
          className="flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-black"
        >
          <RefreshCcw className="h-4 w-4 text-[#6B6B6B]" strokeWidth={2.25} />
          Sell
        </button>
      </div>
    </div>
  );
}
