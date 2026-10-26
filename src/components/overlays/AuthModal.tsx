
import { useEffect, useState, type FormEvent } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Heart,
  ShoppingBag,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../brand/Logo';

type AuthMode = 'signin' | 'signup' | 'forgot';

export function AuthModal() {
  const { overlay, closeOverlay } = useStore();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = overlay === 'auth';

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOverlay]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setResultMessage('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setResultMessage('');

    const cleanEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setResultMessage(
        'Password recovery is not connected yet. No reset email has been sent.'
      );
      return;
    }

    if (mode === 'signup' && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length === 0 || password.length > 128) {
      setError('Please enter a valid password.');
      return;
    }

    if (mode === 'signup' && (
      password.length < 12 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    )) {
      setError('Use at least 12 characters, including letters and numbers.');
      return;
    }

    if (
      mode === 'signup' &&
      password !== confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const account = mode === 'signup'
        ? await signUp(name.trim(), cleanEmail, password)
        : await signIn(cleanEmail, password);
      setResultMessage(`You are signed in as ${account.name}.`);
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Account request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-5">
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeOverlay}
        aria-label="Close account window"
        className="fixed inset-0 h-full w-full cursor-default"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 my-auto w-full max-w-[460px] overflow-y-auto rounded-2xl border border-[#E8E1D7] bg-white shadow-2xl sm:rounded-3xl"
        style={{ maxHeight: 'calc(100dvh - 24px)' }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={closeOverlay}
          aria-label="Close account modal"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#77736E] transition-colors hover:bg-[#F4EFEB] hover:text-[#1F2022]"
        >
          <X size={19} />
        </button>

        {/* Branding Header */}
        <div className="bg-[#F5F4EF] px-6 pb-7 pt-8 text-center sm:px-8">
          <div className="mb-4 flex justify-center">
            <Logo size="sm" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#637666]">
            2427 ÉLAN
          </p>

          <h2
            id="auth-modal-title"
            className="mt-3 font-display text-2xl font-medium text-[#1F2022] sm:text-3xl"
          >
            {mode === 'signin'
              ? 'Welcome Back'
              : mode === 'signup'
                ? 'Create Your Account'
                : 'Forgot Password?'}
          </h2>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-[#77736E]">
            {mode === 'signin'
              ? 'Sign in to continue your comfort journey.'
              : mode === 'signup'
                ? 'Join 2427 ÉLAN and explore your favorite styles.'
                : 'Enter your email to request a password reset.'}
          </p>
        </div>

        <div className="px-5 pb-6 pt-6 sm:px-8 sm:pb-8">
          {/* Sign In / Sign Up Tabs */}
          {mode !== 'forgot' && (
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#F3F0EC] p-1">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                aria-pressed={mode === 'signin'}
                className={`rounded-lg py-3 text-sm font-semibold transition-all ${mode === 'signin'
                    ? 'bg-white text-[#1F2022] shadow-sm'
                    : 'text-[#77736E] hover:text-[#1F2022]'
                  }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => switchMode('signup')}
                aria-pressed={mode === 'signup'}
                className={`rounded-lg py-3 text-sm font-semibold transition-all ${mode === 'signup'
                    ? 'bg-white text-[#1F2022] shadow-sm'
                    : 'text-[#77736E] hover:text-[#1F2022]'
                  }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Account availability */}
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] p-3">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-[#637666]"
            />

            <p className="text-[11px] leading-5 text-[#77736E]">
              <strong className="text-[#1F2022]">
                Account access:
              </strong>{' '}
              Sign-in and registration require the API to be configured. Password reset is unavailable until email delivery is set up.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Name */}
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="mb-2 block text-xs font-semibold text-[#1F2022]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736E]"
                  />

                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-4 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="auth-email"
                className="mb-2 block text-xs font-semibold text-[#1F2022]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736E]"
                />

                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-4 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-2 block text-xs font-semibold text-[#1F2022]"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736E]"
                  />

                  <input
                    id="auth-password"
                    type={
                      showPassword ? 'text' : 'password'
                    }
                    autoComplete={
                      mode === 'signup'
                        ? 'new-password'
                        : 'current-password'
                    }
                    required
                    minLength={mode === 'signup' ? 12 : 1}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder={mode === 'signup' ? '12+ characters with letters and numbers' : 'Enter your password'}
                    className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-12 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#77736E] hover:text-[#1F2022]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="auth-confirm-password"
                  className="mb-2 block text-xs font-semibold text-[#1F2022]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736E]"
                  />

                  <input
                    id="auth-confirm-password"
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="new-password"
                    required
                    minLength={12}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Re-enter your password"
                    className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-12 text-sm text-[#1F2022] outline-none focus:border-[#637666]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#77736E] hover:text-[#1F2022]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password */}
            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs font-semibold text-[#637666] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              >
                <AlertCircle
                  size={17}
                  className="shrink-0"
                />
                <span>{error}</span>
              </div>
            )}

            {/* Demo Result */}
            {resultMessage && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-[#CBD8CA] bg-[#F2F4EF] p-3 text-xs leading-5 text-[#47584A]"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0"
                />

                <span>{resultMessage}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F2022] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#34373C] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Please wait…' : mode === 'signin'
                ? 'Sign In'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Request Password Reset'}

              <ArrowRight size={17} />
            </button>

            {/* Switch Mode */}
            <div className="pt-2 text-center">
              {mode === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#637666] hover:underline"
                >
                  <ArrowLeft size={15} />
                  Back to Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    switchMode(
                      mode === 'signin'
                        ? 'signup'
                        : 'signin'
                    )
                  }
                  className="text-xs font-medium text-[#637666] hover:underline"
                >
                  {mode === 'signin'
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Sign In'}
                </button>
              )}
            </div>
          </form>

          {/* Benefits */}
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#EEE7DE] pt-5">
            <div className="flex items-center gap-2 text-xs text-[#77736E]">
              <Heart
                size={16}
                className="shrink-0 text-[#637666]"
              />
              Save Favorites
            </div>

            <div className="flex items-center gap-2 text-xs text-[#77736E]">
              <ShoppingBag
                size={16}
                className="shrink-0 text-[#637666]"
              />
              Shop Comfortably
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] leading-5 text-[#99938B]">
            2427 ÉLAN · Everyday Comfort,
            Thoughtfully Designed
          </p>
        </div>
      </div>
    </div>
  );
}
