
import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';

type AuthMode = 'signin' | 'signup' | 'forgot';

export function AuthModal() {
  const { overlay, closeOverlay } = useStore();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [demoMessage, setDemoMessage] = useState('');

  const isOpen = overlay === 'auth';

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOverlay]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setDemoMessage('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');
    setDemoMessage('');

    const cleanEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setDemoMessage(
        'Password recovery is not connected yet. No reset email has been sent.'
      );
      return;
    }

    if (mode === 'signup' && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 8) {
      setError(
        'Password must contain at least 8 characters.'
      );
      return;
    }

    if (
      mode === 'signup' &&
      password !== confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }

    if (mode === 'signup') {
      setDemoMessage(
        'Signup form validated successfully. Demo mode only — no account has been created.'
      );
    } else {
      setDemoMessage(
        'Login form validated successfully. Demo mode only — you have not been signed in.'
      );
    }

    setPassword('');
    setConfirmPassword('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={closeOverlay}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="2427 account"
        className="relative z-10 my-auto w-full max-w-md overflow-y-auto rounded-3xl border border-[#E8E1D7] bg-[#FAF8F5] p-6 shadow-2xl sm:p-8"
        style={{ maxHeight: 'calc(100dvh - 32px)' }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={closeOverlay}
          aria-label="Close account modal"
          className="absolute right-4 top-4 rounded-full p-2 text-[#77736E] transition-colors hover:bg-[#F4EFEB] hover:text-[#1F2022]"
        >
          <X size={19} />
        </button>

        {/* Logo and Heading */}
        <div className="mb-7 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size="sm" />
          </div>

          <h2 className="font-display text-2xl font-medium text-[#1F2022] sm:text-3xl">
            {mode === 'signin'
              ? 'Welcome Back'
              : mode === 'signup'
                ? 'Create Your Account'
                : 'Reset Your Password'}
          </h2>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-[#77736E]">
            {mode === 'signin'
              ? 'Sign in to your 2427-COMFORTS account.'
              : mode === 'signup'
                ? 'Join 2427-COMFORTS for a personalized shopping experience.'
                : 'Enter your email address to request a password reset.'}
          </p>
        </div>

        {/* Sign In / Sign Up Tabs */}
        {mode !== 'forgot' && (
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#F1EDE7] p-1">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${mode === 'signin'
                ? 'bg-white text-[#1F2022] shadow-sm'
                : 'text-[#77736E] hover:text-[#1F2022]'
                }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-colors ${mode === 'signup'
                ? 'bg-white text-[#1F2022] shadow-sm'
                : 'text-[#77736E] hover:text-[#1F2022]'
                }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-[#E8E1D7] bg-white p-3">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-[#637666]"
          />

          <p className="text-[11px] leading-5 text-[#77736E]">
            <strong className="text-[#1F2022]">
              Demo Mode:
            </strong>{' '}
            Authentication is not connected to a backend.
            No accounts are created, passwords stored, or
            recovery emails sent.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1.5 block text-xs font-semibold text-[#1F2022]"
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
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-4 text-sm text-[#1F2022] outline-none transition-colors focus:border-[#637666]"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-xs font-semibold text-[#1F2022]"
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
                className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-4 text-sm text-[#1F2022] outline-none transition-colors focus:border-[#637666]"
              />
            </div>
          </div>

          {/* Password */}
          {mode !== 'forgot' && (
            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-xs font-semibold text-[#1F2022]"
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
                  minLength={8}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-12 text-sm text-[#1F2022] outline-none transition-colors focus:border-[#637666]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
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
                className="mb-1.5 block text-xs font-semibold text-[#1F2022]"
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
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Re-enter your password"
                  className="h-12 w-full rounded-xl border border-[#E8E1D7] bg-white pl-11 pr-12 text-sm text-[#1F2022] outline-none transition-colors focus:border-[#637666]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
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
          {demoMessage && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-[#CBD8CA] bg-[#F2F4EF] p-3 text-xs leading-5 text-[#47584A]"
            >
              <CheckCircle2
                size={18}
                className="shrink-0"
              />
              <span>{demoMessage}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="mt-2 w-full"
          >
            <span>
              {mode === 'signin'
                ? 'Sign In'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Request Password Reset'}
            </span>

            <ArrowRight size={17} />
          </Button>

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

        {/* Footer */}
        <p className="mt-6 border-t border-[#E8E1D7] pt-4 text-center text-[11px] leading-5 text-[#99938B]">
          2427-COMFORTS · Everyday Comfort, Thoughtfully Designed
        </p>
      </div>
    </div>
  );
}
