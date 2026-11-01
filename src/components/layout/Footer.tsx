
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Mail,
  Grid2X2,
  Heart,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

import { Logo } from '../brand/Logo';
import { Container } from '../ui/Container';
import { apiRequest } from '../../lib/api';

type ProductVisual = {
  label: string;
  image: string;
};

type BrandValueCard =
  | {
      title: string;
      description: string;
      image: string;
      alt: string;
      products?: never;
    }
  | {
      title: string;
      description: string;
      products: ProductVisual[];
      image?: never;
      alt?: never;
    };

const customerLinks = [
  {
    label: 'Contact Us',
    to: '/contact',
  },
  {
    label: 'Shipping Policy Preview',
    to: '/contact#shipping-policy',
  },
  {
    label: 'Returns Policy Preview',
    to: '/contact#returns',
  },
];

const companyLinks = [
  {
    label: 'About Us',
    to: '/about',
  },
  {
    label: 'Privacy Information Preview',
    to: '/contact#privacy',
  },
  {
    label: 'Terms Preview',
    to: '/contact#terms',
  },
];

const brandValueImages: BrandValueCard[] = [
  {
    title: 'Everyday Comfort',
    description: 'Comfort that moves with you, from morning to night.',
    image: 'elan-brand-cotton.webp',
    alt: 'Soft white cotton bolls in a warm, natural setting',
  },
  {
    title: 'Made with Purpose',
    description: 'Thoughtful essentials. Timeless style. Attention to detail.',
    products: [
      { label: 'Briefs', image: 'underwear/m-ub01-front.jpg' },
      { label: 'Boxers', image: 'boxers/m-bx02-printplay-front.jpg' },
      { label: 'Banians & vests', image: 'vests/m-v01-front.jpg' },
      { label: 'Sleeveless tops', image: 'sleeveless/m-s01-front.jpg' },
      { label: 'Camisoles', image: 'women-camisoles/w-c01-front.jpg' },
      { label: 'Women’s innerwear', image: 'bras/w-b02-front.jpg' },
    ],
  },
  {
    title: 'Your Trust Matters',
    description: 'A better shopping experience, with you at the heart of everything.',
    image: 'elan-brand-trust.webp',
    alt: 'A 2427 ÉLAN branded package held in two hands',
  },
];

const brandValueImageUrl = (image: string) =>
  `${import.meta.env.BASE_URL}images/home/${image}`;

const productImageUrl = (image: string) =>
  `${import.meta.env.BASE_URL}images/products/${image}`;

export function Footer() {
  const year = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterError, setNewsletterError] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const submitNewsletter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterMessage('');
    setNewsletterError(false);
    setNewsletterSubmitting(true);
    try {
      const result = await apiRequest<{ message: string }>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email: newsletterEmail, consent: newsletterConsent }),
      });
      setNewsletterMessage(`${result.message} No marketing email has been configured.`);
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterError(true);
      setNewsletterMessage(error instanceof Error ? `Subscription was not saved: ${error.message}` : 'Subscription was not saved.');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-[#303236] bg-[#18191B] text-[#FAF8F5]">
      {/* Brand Values */}
      <section
        aria-label="2427 ÉLAN brand values"
        className="border-b border-[#E8E1D7] bg-[#FAF8F5] text-[#1F2022]"
      >
        <Container className="py-4 sm:py-5 lg:py-5">
          <div className="border-b border-[#DED7CE] pb-3 text-center sm:pb-4">
            <p className="font-numeral text-2xl font-semibold tracking-[0.12em] text-[#1F2022] sm:text-3xl">
              24 <span className="text-[#637666]">|</span> 27
            </p>
            <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#77736E] sm:text-xs">
              Comfort. Quality. Confidence.
            </p>
          </div>

          <div className="grid gap-5 pt-4 sm:grid-cols-3 sm:gap-0 sm:pt-5">
            {brandValueImages.map((value, index) => (
              <article
                key={value.title}
                className={`flex flex-col items-center px-3 text-center sm:px-4 lg:px-6 ${
                  index > 0 ? 'sm:border-l sm:border-[#DED7CE]' : ''
                }`}
              >
                {value.products ? (
                  <ul
                    aria-label="Existing catalog product photographs"
                    className="grid aspect-square w-full max-w-[14rem] grid-cols-2 gap-1.5 rounded-2xl border border-[#E8E1D7] bg-[#F0ECE5] p-1.5 sm:max-w-[12.5rem] lg:max-w-[10.5rem]"
                  >
                    {value.products.map((product) => (
                      <li
                        key={product.image}
                        className="flex min-h-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-[#E8E1D7] bg-white px-1.5 py-1"
                      >
                        <img
                          src={productImageUrl(product.image)}
                          alt=""
                          width={140}
                          height={72}
                          loading="lazy"
                          decoding="async"
                          className="min-h-0 w-full flex-1 object-contain"
                        />
                        <span className="mt-0.5 text-center text-[9px] font-medium leading-3 text-[#637666] sm:text-[10px]">
                          {product.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <img
                    src={brandValueImageUrl(value.image)}
                    alt={value.alt}
                    width={322}
                    height={313}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full max-w-[14rem] rounded-2xl object-cover sm:max-w-[12.5rem] lg:max-w-[10.5rem]"
                  />
                )}
                <h2 className="mt-2 font-display text-xl font-semibold text-[#1F2022] sm:mt-3 sm:text-xl">
                  {value.title}
                </h2>
                <p className="mt-1 max-w-xs text-sm leading-5 text-[#77736E] sm:mt-1.5 sm:text-sm sm:leading-6">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <div className="border-b border-white/10 bg-[#202225]">
        <Container className="py-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Grid2X2
                size={22}
                className="shrink-0 text-[#C5D1C2]"
              />

              <div>
                <p className="text-xs font-semibold text-white">
                  Browse the Catalog
                </p>

                <p className="mt-1 text-[11px] text-neutral-400">
                  Explore Men’s and Women’s collections
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Heart
                size={22}
                className="shrink-0 text-[#C5D1C2]"
              />

              <div>
                <p className="text-xs font-semibold text-white">
                  Saved Wishlist
                </p>

                <p className="mt-1 text-[11px] text-neutral-400">
                  Saved in this browser
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShoppingBag
                size={22}
                className="shrink-0 text-[#C5D1C2]"
              />

              <div>
                <p className="text-xs font-semibold text-white">
                  Checkout Preview
                </p>

                <p className="mt-1 text-[11px] text-neutral-400">
                  No real orders or payments
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer */}
      <Container className="py-10 sm:py-12">
        <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo inverted size="sm" />

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#B9B7B2]">
              2427 ÉLAN brings together thoughtfully
              designed everyday innerwear and essentials,
              with a focus on comfort, simplicity, and
              effortless style.
            </p>

            <div className="mt-4 flex items-start gap-3 text-xs text-[#B9B7B2]">
              <Mail
                size={17}
                className="shrink-0 text-[#C5D1C2]"
              />

              <Link
                to="/contact"
                className="transition-colors hover:text-white"
              >
                Get in touch with our team
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#D9CBB7]">
              Customer Service
            </h3>

            <ul className="space-y-3">
              {customerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-[#B9B7B2] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#D9CBB7]">
              Company
            </h3>

            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-[#B9B7B2] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-10 grid min-w-0 gap-5 rounded-2xl border border-white/10 bg-[#222427] p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5D1C2]">
              Stay Connected
            </p>

            <h3 className="mt-2 font-display text-xl font-medium text-white sm:text-2xl">
              Discover what's new at 2427 ÉLAN
            </h3>

            <p className="mt-2 max-w-xl text-xs leading-5 text-[#B9B7B2]">
              Subscriptions are stored for review when the database is configured. No marketing email service is connected.
            </p>
          </div>

          <form onSubmit={submitNewsletter} className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="Email address"
              className="min-h-11 min-w-0 rounded-lg border border-white/20 bg-[#18191B] px-3 text-sm text-white placeholder:text-neutral-400"
            />
            <label className="flex items-start gap-2 text-[11px] leading-5 text-[#B9B7B2] sm:col-span-2">
              <input
                type="checkbox"
                required
                checked={newsletterConsent}
                onChange={(event) => setNewsletterConsent(event.target.checked)}
                className="mt-1 accent-[#C5D1C2]"
              />
              I agree to have this email stored as a newsletter subscription. No emails are currently sent.
            </label>
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D9CBB7] px-5 text-xs font-bold text-[#18191B] transition-colors hover:bg-white disabled:opacity-60"
            >
              {newsletterSubmitting ? 'Saving…' : 'Subscribe'}
              <ArrowRight size={16} />
            </button>
            {newsletterMessage && (
              <p role={newsletterError ? 'alert' : 'status'} className={`text-xs leading-5 sm:col-span-2 ${newsletterError ? 'text-red-300' : 'text-[#C5D1C2]'}`}>
                {newsletterMessage}
              </p>
            )}
          </form>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {year} 2427 ÉLAN. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact#privacy"
              className="text-[11px] text-neutral-500 hover:text-white"
            >
              Privacy Preview
            </Link>

            <Link
              to="/contact#terms"
              className="text-[11px] text-neutral-500 hover:text-white"
            >
              Terms Preview
            </Link>

            <Link
              to="/contact"
              className="text-[11px] text-neutral-500 hover:text-white"
            >
              Support
            </Link>
          </div>
        </div>

        {/* Demo Note */}
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#C5D1C2]"
          />

          <p className="text-[11px] leading-5 text-neutral-400">
            This website currently demonstrates the
            shopping experience. Online payments and
            order processing are not yet active.
          </p>
        </div>
      </Container>
    </footer>
  );
}
