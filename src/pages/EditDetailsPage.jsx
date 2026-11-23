import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';

export default function EditDetailsPage() {
  const { name, email, saveDetails } = useUserProfile();
  const navigate = useNavigate();
  const [formName, setFormName] = useState(name || '');
  const [formEmail, setFormEmail] = useState(email || '');
  const [saved, setSaved] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    saveDetails(formName, formEmail);
    setSaved(true);
    window.setTimeout(() => navigate('/account'), 400);
  };

  return (
    <div className="min-h-[100dvh] bg-[#000000] px-4 pb-24 pt-3 md:px-6 lg:px-8">
      <header className="mb-6 flex items-center gap-3">
        <Link
          to="/account"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
          aria-label="Back to Account"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <h1 className="text-[20px] font-bold text-white">Edit Details</h1>
      </header>

      <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-5">
        <div>
          <label
            htmlFor="account-name"
            className="mb-1.5 block text-[13px] font-semibold text-[#A0A0A0]"
          >
            Name
          </label>
          <input
            id="account-name"
            type="text"
            value={formName}
            onChange={(e) => {
              setSaved(false);
              setFormName(e.target.value);
            }}
            placeholder="Your full name"
            autoComplete="name"
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1E] px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-[#6B6B6B] focus:border-[#075BE8]"
          />
        </div>

        <div>
          <label
            htmlFor="account-email"
            className="mb-1.5 block text-[13px] font-semibold text-[#A0A0A0]"
          >
            Email
          </label>
          <input
            id="account-email"
            type="email"
            value={formEmail}
            onChange={(e) => {
              setSaved(false);
              setFormEmail(e.target.value);
            }}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#1C1C1E] px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-[#6B6B6B] focus:border-[#075BE8]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#075BE8] py-3.5 text-[16px] font-bold text-white"
        >
          {saved ? 'Saved' : 'Save'}
        </button>

        <p className="text-center text-[12px] text-[#6B6B6B]">
          Your name and email show at the top of Account on this device.
        </p>
      </form>
    </div>
  );
}
