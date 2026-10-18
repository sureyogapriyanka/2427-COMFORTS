import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState<'men' | 'women' | 'both'>('both');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F5]">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-[#1F2022] text-[#FAF8F5] p-8 sm:p-14 lg:p-16 border border-[#FAF8F5]/10 shadow-2xl relative grain-texture">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#637666]/30 border border-[#637666]/50 px-3.5 py-1 text-xs text-[#FAF8F5] backdrop-blur-md mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#D9CBB7]" />
              <span className="tracking-wider uppercase text-[11px] font-semibold text-[#D9CBB7]">
                The Inner Circle
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white leading-[1.1]">
              Elevate Your Morning Routine. <br />
              <span className="italic text-[#D9CBB7]">Receive 15% Off Your First Order.</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed font-light">
              We send one thoughtful dispatch per month: limited fabric restocks, private archive previews, and innerwear care guides. No algorithmic noise.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 animate-in zoom-in-95">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[#637666] mb-2" />
                <h3 className="font-display text-2xl font-medium text-white">
                  Welcome to the 2427 Atelier.
                </h3>
                <p className="text-xs text-[#FAF8F5]/80 mt-1">
                  We have dispatched your unique 15% voucher to <strong className="text-[#D9CBB7]">{email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8">
                {/* Preference Selector */}
                <div className="flex items-center justify-center gap-4 mb-4 text-xs">
                  <span className="text-[#FAF8F5]/60">Send me updates for:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#FAF8F5]">
                    <input
                      type="radio"
                      name="newsletter-pref"
                      checked={preference === 'both'}
                      onChange={() => setPreference('both')}
                      className="accent-[#637666]"
                    />
                    <span>Both</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#FAF8F5]">
                    <input
                      type="radio"
                      name="newsletter-pref"
                      checked={preference === 'men'}
                      onChange={() => setPreference('men')}
                      className="accent-[#637666]"
                    />
                    <span>Men's</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#FAF8F5]">
                    <input
                      type="radio"
                      name="newsletter-pref"
                      checked={preference === 'women'}
                      onChange={() => setPreference('women')}
                      className="accent-[#637666]"
                    />
                    <span>Women's</span>
                  </label>
                </div>

                {/* Input with Button */}
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B6F76]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full rounded-full border border-white/20 bg-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder:text-[#FAF8F5]/40 outline-hidden focus:border-[#637666] focus:bg-white/15 transition-all"
                    />
                  </div>
                  <Button type="submit" variant="light" size="md" className="shrink-0">
                    <span>Subscribe</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-4 text-[11px] text-[#FAF8F5]/50">
                  By subscribing, you agree to receive promotional dispatches. Unsubscribe anytime with 1-click.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
