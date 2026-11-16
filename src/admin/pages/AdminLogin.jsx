import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';

export default function AdminLogin() {
  const { authed, checking, login, ADMIN_USER } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    'mt-1.5 w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2.5 text-[14px] text-[#0F172A] caret-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#0F172A]';

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A] text-white">
        Checking session…
      </div>
    );
  }

  if (authed) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const ok = await login(username.trim(), password);
    setSubmitting(false);
    if (!ok) {
      setError('Invalid username or password.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div
      data-admin
      className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 text-[#0F172A]"
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 text-[#0F172A] shadow-xl"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
          TicketMaster
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#0F172A]">Admin sign in</h1>
        <p className="mt-2 text-[13px] text-[#64748B]">
          Connected to Django REST Framework. Manage events, tickets, seats,
          sections, and images.
        </p>

        <label className="mt-6 block">
          <span className="text-[12px] font-bold text-[#334155]">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            placeholder="admin"
            autoComplete="username"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[12px] font-bold text-[#334155]">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <p className="mt-3 text-[13px] font-medium text-[#DC2626]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-[#0F172A] py-3 text-[14px] font-bold text-white disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-[12px] text-[#94A3B8]">
          Demo login: <span className="font-semibold">{ADMIN_USER}</span> /{' '}
          <span className="font-semibold">admin123</span>
        </p>
      </form>
    </div>
  );
}
