export default function AppleWalletButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md bg-black px-3.5 py-2.5 text-white"
      aria-label="Add to Apple Wallet"
    >
      {/* Simplified Apple Wallet mark */}
      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden>
        <rect x="0" y="2" width="18" height="12" rx="2" fill="#34C759" />
        <rect x="2" y="1" width="18" height="12" rx="2" fill="#FF3B30" />
        <rect x="4" y="0" width="18" height="12" rx="2" fill="#007AFF" />
        <path
          d="M8.2 3.2c.5.6.4 1.5-.2 2.1-.5.5-1.3.7-1.9.3.5-.6.4-1.5.1-2 .6-.6 1.4-.8 2-.4zM6.5 5.6c.9 0 1.7.5 2.1 1.2-.9.5-1.5 1.5-1.5 2.6 0 .3 0 .6.1.9-.8.4-1.7.2-2.3-.4C4.2 9.2 4 8.2 4.2 7.3c.3-1 .9-1.7 2.3-1.7z"
          fill="white"
          transform="translate(6,1) scale(0.85)"
        />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[9px] font-normal opacity-90">Add to</span>
        <span className="block text-[13px] font-semibold tracking-tight">
          Apple Wallet
        </span>
      </span>
    </button>
  );
}
