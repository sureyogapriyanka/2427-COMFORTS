import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export function AccountPage() {
  const { user, isLoading, updateProfile, signOut } = useAuth();
  const { openOverlay } = useStore();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
  }, [user?.id, user?.name, user?.phone]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setIsError(false);
    try {
      await updateProfile({ name, phone: phone.trim() });
      setMessage('Profile updated.');
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    setMessage('');
    try {
      await signOut();
      setMessage('You have been signed out.');
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'Sign out failed.');
    }
  };

  return (
    <div className="min-h-[60vh] bg-[#FAF8F5] py-12">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8E1D7] bg-white p-6 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F4EF] text-[#637666]">
              <UserRound size={21} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#637666]">2427 ÉLAN</p>
              <h1 className="font-display text-2xl text-[#1F2022]">Your account</h1>
            </div>
          </div>

          {isLoading ? (
            <p role="status" className="mt-8 text-sm text-[#77736E]">Checking your account…</p>
          ) : !user ? (
            <div className="mt-8">
              <p className="text-sm leading-6 text-[#77736E]">Sign in or create an account to manage profile details and sync your saved shopping data.</p>
              <button type="button" onClick={() => openOverlay('auth')} className="mt-5 min-h-11 rounded-xl bg-[#1F2022] px-5 text-sm font-semibold text-white">
                Sign in or create account
              </button>
            </div>
          ) : (
            <>
              <p className="mt-6 text-sm text-[#77736E]">{user.email} · {user.role}</p>
              <form onSubmit={saveProfile} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="account-name" className="mb-2 block text-xs font-semibold text-[#1F2022]">Name</label>
                  <input id="account-name" required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#E8E1D7] px-4 text-sm" />
                </div>
                <div>
                  <label htmlFor="account-phone" className="mb-2 block text-xs font-semibold text-[#1F2022]">Phone (optional)</label>
                  <input id="account-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Add a phone number" className="min-h-12 w-full rounded-xl border border-[#E8E1D7] px-4 text-sm" />
                </div>
                <button type="submit" disabled={saving} className="min-h-11 rounded-xl bg-[#1F2022] px-5 text-sm font-semibold text-white disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save profile'}
                </button>
              </form>
              <div className="mt-7 flex flex-wrap gap-3 border-t border-[#EEE7DE] pt-5">
                {user.role === 'admin' && (
                  <Link to="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8D0C5] px-4 text-sm font-semibold text-[#1F2022]">
                    <ShieldCheck size={17} /> Admin dashboard
                  </Link>
                )}
                <button type="button" onClick={() => void handleSignOut()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8D0C5] px-4 text-sm font-semibold text-[#1F2022]">
                  <LogOut size={17} /> Sign out
                </button>
              </div>
            </>
          )}

          {message && <p role={isError ? 'alert' : 'status'} className={`mt-5 text-sm ${isError ? 'text-red-700' : 'text-[#637666]'}`}>{message}</p>}
        </div>
      </Container>
    </div>
  );
}
