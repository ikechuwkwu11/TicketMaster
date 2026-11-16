import { Link } from 'react-router-dom';
import { User, ChevronRight, Shield } from 'lucide-react';

const rows = [
  'My Account',
  'Purchase History',
  'Payment Methods',
  'Notification Settings',
  'Help & Support',
];

export default function AccountPage() {
  return (
    <div className="px-4 py-4 md:px-6 lg:px-8">
      <h1 className="mb-5 text-xl font-bold text-white">Account</h1>

      <div className="mb-6 flex items-center gap-3 rounded-[6px] border border-[#303030] bg-[#242424] p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171717]">
          <User className="h-6 w-6 text-[#A0A0A0]" />
        </div>
        <div>
          <p className="font-semibold text-white">Guest User</p>
          <p className="text-sm text-[#A0A0A0]">Sign in to sync your tickets</p>
        </div>
      </div>

      <ul className="overflow-hidden rounded-[6px] border border-[#303030] bg-[#242424]">
        {rows.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-white hover:bg-[#2a2a2a] ${
                i > 0 ? 'border-t border-[#303030]' : ''
              }`}
            >
              {label}
              <ChevronRight className="h-4 w-4 text-[#A0A0A0]" />
            </button>
          </li>
        ))}
      </ul>

      <Link
        to="/admin/login"
        className="mt-4 flex w-full items-center justify-between rounded-[6px] border border-[#303030] bg-[#242424] px-4 py-3.5 text-sm text-white hover:bg-[#2a2a2a]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Shield className="h-4 w-4 text-[#A0A0A0]" />
          Admin Console
        </span>
        <ChevronRight className="h-4 w-4 text-[#A0A0A0]" />
      </Link>

      <button
        type="button"
        className="mt-6 w-full rounded-md border border-[#303030] py-3 text-sm font-semibold text-white hover:bg-[#171717]"
      >
        Sign In
      </button>
    </div>
  );
}
