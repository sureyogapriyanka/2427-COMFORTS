import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';

export function AuthModal() {
  const { overlay, closeOverlay } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (overlay !== 'auth') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeOverlay();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeOverlay} />

      <div className="relative w-full max-w-md rounded-2xl bg-[#FAF8F5] p-6 sm:p-8 shadow-2xl border border-[#E8E1D7] overflow-hidden animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={closeOverlay}
          className="absolute top-4 right-4 rounded-full p-1.5 text-[#1F2022]/60 hover:bg-[#F4EFEB] hover:text-[#1F2022]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Logo size="sm" />
          </div>
          <h3 className="font-display text-2xl font-medium text-[#1F2022]">
            {mode === 'signin' ? 'Welcome to 2427' : 'Create 2427 Profile'}
          </h3>
          <p className="mt-1 text-xs text-[#5E6064]">
            {mode === 'signin'
              ? 'Access saved sizes, orders, and curated replenishment.'
              : 'Join the inner circle for exclusive previews and 15% off.'}
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-[#637666]/10 p-6 text-center border border-[#637666]/20">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#637666] mb-2" />
            <h4 className="font-display text-xl text-[#1F2022]">Phase 1 Prototype Demo</h4>
            <p className="text-xs text-[#5E6064] mt-1">
              Authentication endpoints are registered on the Express backend (`/api/auth`) ready for MongoDB credential encryption in Phase 2.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-[#1F2022] mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F76]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Mehta"
                    className="w-full rounded-xl border border-[#E8E1D7] bg-white pl-10 pr-4 py-2.5 text-xs text-[#1F2022] outline-hidden focus:border-[#637666]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#1F2022] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F76]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-[#E8E1D7] bg-white pl-10 pr-4 py-2.5 text-xs text-[#1F2022] outline-hidden focus:border-[#637666]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1F2022] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F76]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#E8E1D7] bg-white pl-10 pr-4 py-2.5 text-xs text-[#1F2022] outline-hidden focus:border-[#637666]"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              <span>{mode === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-xs text-[#637666] font-medium hover:underline"
              >
                {mode === 'signin'
                  ? "Don't have an account? Sign up here"
                  : 'Already have an account? Sign in here'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
