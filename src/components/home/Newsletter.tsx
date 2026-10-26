import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { apiRequest } from '../../lib/api';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError(false);
    setSubmitting(true);
    try {
      const result = await apiRequest<{ message: string }>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email, consent }),
      });
      setMessage(`${result.message} No marketing email has been configured.`);
      setEmail('');
    } catch (requestError) {
      setError(true);
      setMessage(requestError instanceof Error
        ? `Subscription was not saved: ${requestError.message}`
        : 'Subscription was not saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAF8F5] py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[#FAF8F5]/10 bg-[#1F2022] p-8 text-[#FAF8F5] shadow-2xl grain-texture sm:p-14 lg:p-16">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#637666]/50 bg-[#637666]/30 px-3.5 py-1 text-xs text-[#FAF8F5] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#D9CBB7]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D9CBB7]">
                The Inner Circle
              </span>
            </div>

            <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl">
              Stay in the Loop.
              <br />
              <span className="italic text-[#D9CBB7]">Updates from 2427 ÉLAN.</span>
            </h2>

            <p className="mt-4 text-sm font-light leading-relaxed text-[#FAF8F5]/80 sm:text-base">
              Subscriptions are stored for review when the database is configured.
              No marketing email or discount is currently sent.
            </p>

            {message && (
              <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                {!error && <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-[#637666]" />}
                <p role={error ? 'alert' : 'status'} className="text-sm text-[#FAF8F5]/90">
                  {message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6F76]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-label="Email address for newsletter"
                    placeholder="Enter your email address..."
                    className="w-full rounded-full border border-white/20 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-hidden transition-all placeholder:text-[#FAF8F5]/40 focus:border-[#637666] focus:bg-white/15"
                  />
                </div>
                <Button type="submit" variant="light" size="md" className="shrink-0" disabled={submitting}>
                  <span>{submitting ? 'Saving…' : 'Subscribe'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <label className="mx-auto mt-4 flex max-w-md items-start gap-2 text-left text-[11px] leading-5 text-[#FAF8F5]/70">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 accent-[#637666]"
                />
                <span>
                  I agree to have this email stored as a newsletter subscription.
                  No emails are currently sent.
                </span>
              </label>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
