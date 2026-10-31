
import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { useLocation } from 'react-router-dom';

import {
  Mail,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Ruler,
  Truck,
  RotateCcw,
  FileText,
  LockKeyhole,
  ArrowRight,
  Info,
} from 'lucide-react';

import { Container } from '../components/ui/Container';
import { apiRequest } from '../lib/api';

type Tab =
  | 'contact'
  | 'size-guide'
  | 'faq'
  | 'policies';

type PolicyId =
  | 'shipping-policy'
  | 'returns'
  | 'privacy'
  | 'terms';

type ContactDetails = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const initialContact: ContactDetails = {
  name: '',
  email: '',
  topic: 'Sizing & Fit',
  message: '',
};

const FAQS = [
  {
    question: 'How do I choose the correct size?',
    answer:
      'Use the size guide on this page as a general reference. Exact measurements may vary by product. Confirm the product-specific size chart before ordering.',
  },
  {
    question: 'How should I care for my garments?',
    answer:
      'Always follow the care label attached to your garment. Gentle washing and avoiding excessive heat may help preserve fabric quality.',
  },
  {
    question: 'How can I check delivery availability?',
    answer:
      'Delivery availability, charges and estimated timelines should be confirmed with the store before placing an order. The current website does not process real orders.',
  },
  {
    question: 'Can I return or exchange innerwear?',
    answer:
      'Returns and exchanges depend on the store’s confirmed policy and hygiene requirements. No specific return guarantee has been established on this demo website.',
  },
  {
    question: 'Can I pay online?',
    answer:
      'The checkout currently demonstrates payment-method selection only. No real online payment or Cash on Delivery order is processed.',
  },
];

const MEN_SIZES = [
  ['S', '28–30', '71–76'],
  ['M', '31–33', '79–84'],
  ['L', '34–36', '86–91'],
  ['XL', '37–39', '94–99'],
  ['XXL', '40–43', '102–109'],
];

const WOMEN_SIZES = [
  ['XS', '28–30', '71–76'],
  ['S', '30–32', '76–81'],
  ['M', '32–34', '81–86'],
  ['L', '34–36', '86–91'],
  ['XL', '36–38', '91–97'],
];

const POLICY_IDS: PolicyId[] = [
  'shipping-policy',
  'returns',
  'privacy',
  'terms',
];

function isPolicyId(value: string): value is PolicyId {
  return POLICY_IDS.includes(value as PolicyId);
}

export function ContactPage() {
  const location = useLocation();

  const [activeTab, setActiveTab] =
    useState<Tab>('contact');

  const [openFaq, setOpenFaq] =
    useState<number | null>(0);

  const [details, setDetails] =
    useState<ContactDetails>(initialContact);

  const [formMessage, setFormMessage] =
    useState('');
  const [formStatus, setFormStatus] =
    useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activePolicy, setActivePolicy] =
    useState<PolicyId>('shipping-policy');

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '');

    if (isPolicyId(hash)) {
      setActiveTab('policies');
      setActivePolicy(hash);
    } else if (hash === 'size-guide') {
      setActiveTab('size-guide');
    } else if (hash === 'faq') {
      setActiveTab('faq');
    } else if (hash === 'contact') {
      setActiveTab('contact');
    }
  }, [location.hash]);

  const updateField = (
    field: keyof ContactDetails,
    value: string
  ) => {
    setDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFormMessage('');
    setFormStatus('');
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      details.name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        details.email.trim()
      ) ||
      details.message.trim().length < 10
    ) {
      setFormMessage(
        'Please enter your name, a valid email, and a message of at least 10 characters.'
      );
      setFormStatus('error');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(details),
      });
      setFormMessage('Your inquiry was saved for review. It has not been emailed, and no response timeline is provided.');
      setFormStatus('success');
      setDetails(initialContact);
    } catch (error) {
      setFormMessage(error instanceof Error
        ? `Your inquiry was not saved: ${error.message}`
        : 'Your inquiry was not saved. Please try again later.');
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'contact', label: 'Contact Us' },
    { id: 'size-guide', label: 'Size Guide' },
    { id: 'faq', label: 'FAQs' },
    { id: 'policies', label: 'Policies' },
  ];

  const inputClass =
    'min-h-12 w-full rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-4 text-sm text-[#1F2022] outline-none focus:border-[#637666]';

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#637666]">
            2427 ÉLAN
          </p>

          <h1 className="mt-3 font-display text-3xl font-medium text-[#1F2022] sm:text-5xl">
            How Can We Help?
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#77736E]">
            Explore sizing guidance, frequently asked
            questions, customer support information,
            and store policies.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-9 overflow-x-auto">
          <div className="mx-auto flex w-max min-w-full justify-center gap-2 rounded-2xl border border-[#E8E1D7] bg-white p-2 sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`min-h-11 whitespace-nowrap rounded-xl px-4 text-xs font-semibold transition-colors sm:px-6 ${activeTab === tab.id
                    ? 'bg-[#1F2022] text-white'
                    : 'text-[#77736E] hover:bg-[#FAF8F5] hover:text-[#1F2022]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        {activeTab === 'contact' && (
          <div className="grid gap-7 lg:grid-cols-12">
            {/* Contact Info */}
            <div className="flex flex-col justify-between rounded-3xl bg-[#1F2022] p-7 text-white sm:p-9 lg:col-span-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D9CBB7]">
                  Customer Care
                </p>

                <h2 className="mt-3 font-display text-3xl font-medium">
                  We're Here to Help
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-300">
                  Need help choosing a product,
                  understanding sizes or learning
                  about our collections?
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-3">
                    <Mail
                      size={21}
                      className="shrink-0 text-[#C5D1C2]"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        Email Support
                      </p>

                      <p className="mt-1 text-xs leading-6 text-neutral-400">
                        Official support email will
                        be added after verification.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare
                      size={21}
                      className="shrink-0 text-[#C5D1C2]"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        Product Inquiries
                      </p>

                      <p className="mt-1 text-xs leading-6 text-neutral-400">
                        Contact details and customer
                        support hours will be published
                        once confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-start gap-2 border-t border-white/15 pt-5">
                <ShieldCheck
                  size={17}
                  className="shrink-0 text-[#C5D1C2]"
                />

                <p className="text-xs leading-6 text-neutral-400">
                  This website is currently a
                  demonstration. Please do not submit
                  sensitive personal information.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-[#E8E1D7] bg-white p-6 sm:p-9 lg:col-span-7">
              <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                Send an Inquiry
              </h2>

              <p className="mt-2 text-xs leading-6 text-[#77736E]">
                Inquiries are stored for review when the
                database is available. They are not emailed
                or routed to a support team.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-semibold text-[#1F2022]"
                    >
                      Your Name *
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={details.name}
                      onChange={(event) =>
                        updateField(
                          'name',
                          event.target.value
                        )
                      }
                      placeholder="Full name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-semibold text-[#1F2022]"
                    >
                      Email Address *
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={details.email}
                      onChange={(event) =>
                        updateField(
                          'email',
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="mb-2 block text-xs font-semibold text-[#1F2022]"
                  >
                    Topic
                  </label>

                  <select
                    id="contact-topic"
                    value={details.topic}
                    onChange={(event) =>
                      updateField(
                        'topic',
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option>Sizing & Fit</option>
                    <option>Product Information</option>
                    <option>Shipping Information</option>
                    <option>Returns & Exchanges</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-semibold text-[#1F2022]"
                  >
                    Your Message *
                  </label>

                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    minLength={10}
                    value={details.message}
                    onChange={(event) =>
                      updateField(
                        'message',
                        event.target.value
                      )
                    }
                    placeholder="Tell us how we can help..."
                    className="w-full rounded-xl border border-[#E8E1D7] bg-[#FAF8F5] px-4 py-3 text-sm outline-none focus:border-[#637666]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F2022] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#34373C] disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving inquiry…' : 'Send Inquiry'}
                  <ArrowRight size={17} />
                </button>

                {formMessage && (
                  <div
                    role={formStatus === 'error' ? 'alert' : 'status'}
                    className={`flex items-start gap-2 rounded-xl border p-4 ${formStatus === 'error' ? 'border-red-200 bg-red-50' : 'border-[#CBD8CA] bg-[#F2F4EF]'}`}
                  >
                    <Info
                      size={18}
                      className="mt-0.5 shrink-0 text-[#637666]"
                    />

                    <p className={`text-xs leading-6 ${formStatus === 'error' ? 'text-red-800' : 'text-[#47584A]'}`}>
                      {formMessage}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Size Guide */}
        {activeTab === 'size-guide' && (
          <div className="space-y-7">
            <div className="rounded-2xl border border-[#CBD8CA] bg-[#F2F4EF] p-5">
              <div className="flex items-start gap-3">
                <Info
                  size={20}
                  className="shrink-0 text-[#637666]"
                />

                <p className="text-xs leading-6 text-[#47584A]">
                  These measurements are illustrative
                  sizing references, not verified
                  2427 ÉLAN product specifications.
                  Always check the actual product
                  measurements before purchasing.
                </p>
              </div>
            </div>

            {/* Men's Sizes */}
            <div className="rounded-3xl border border-[#E8E1D7] bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <Ruler
                  size={22}
                  className="text-[#637666]"
                />

                <h2 className="font-display text-xl font-medium text-[#1F2022] sm:text-2xl">
                  Men's Underwear & Boxers
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#637666]">
                    <tr>
                      <th className="p-4">Size</th>
                      <th className="p-4">
                        Waist (inches)
                      </th>
                      <th className="p-4">
                        Waist (cm)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {MEN_SIZES.map((size) => (
                      <tr
                        key={size[0]}
                        className="border-t border-[#E8E1D7]"
                      >
                        <td className="p-4 font-semibold">
                          {size[0]}
                        </td>
                        <td className="p-4">
                          {size[1]}
                        </td>
                        <td className="p-4">
                          {size[2]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women's Sizes */}
            <div className="rounded-3xl border border-[#E8E1D7] bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <Ruler
                  size={22}
                  className="text-[#637666]"
                />

                <h2 className="font-display text-xl font-medium text-[#1F2022] sm:text-2xl">
                  Women's General Size Reference
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#637666]">
                    <tr>
                      <th className="p-4">Size</th>
                      <th className="p-4">
                        Reference (inches)
                      </th>
                      <th className="p-4">
                        Reference (cm)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {WOMEN_SIZES.map((size) => (
                      <tr
                        key={size[0]}
                        className="border-t border-[#E8E1D7]"
                      >
                        <td className="p-4 font-semibold">
                          {size[0]}
                        </td>
                        <td className="p-4">
                          {size[1]}
                        </td>
                        <td className="p-4">
                          {size[2]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="mx-auto max-w-3xl space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-[#E8E1D7] bg-white p-5 sm:p-6"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(
                      openFaq === index
                        ? null
                        : index
                    )
                  }
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-display text-base font-medium text-[#1F2022] sm:text-lg">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={19}
                    className={`shrink-0 text-[#637666] transition-transform ${openFaq === index
                        ? 'rotate-180'
                        : ''
                      }`}
                  />
                </button>

                {openFaq === index && (
                  <p className="mt-4 border-t border-[#E8E1D7] pt-4 text-sm leading-7 text-[#77736E]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Policies */}
        {activeTab === 'policies' && (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 rounded-2xl border border-[#CBD8CA] bg-[#F2F4EF] p-5">
              <p className="text-xs leading-6 text-[#47584A]">
                The information below describes
                the current demo website. Actual
                shipping, returns, privacy and
                purchase terms must be reviewed
                and approved by the store owner
                before launch.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {[
                {
                  id: 'shipping-policy' as const,
                  label: 'Shipping',
                },
                {
                  id: 'returns' as const,
                  label: 'Returns',
                },
                {
                  id: 'privacy' as const,
                  label: 'Privacy',
                },
                {
                  id: 'terms' as const,
                  label: 'Terms',
                },
              ].map((policy) => (
                <button
                  key={policy.id}
                  type="button"
                  onClick={() =>
                    setActivePolicy(policy.id)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${activePolicy === policy.id
                      ? 'bg-[#1F2022] text-white'
                      : 'border border-[#E8E1D7] bg-white text-[#637666]'
                    }`}
                >
                  {policy.label}
                </button>
              ))}
            </div>

            <div
              id={activePolicy}
              className="rounded-3xl border border-[#E8E1D7] bg-white p-6 sm:p-9"
            >
              {activePolicy === 'shipping-policy' && (
                <>
                  <div className="flex items-center gap-3">
                    <Truck
                      size={24}
                      className="text-[#637666]"
                    />

                    <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                      Shipping Information
                    </h2>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#77736E]">
                    Shipping charges are not
                    calculated or displayed at
                    checkout.
                    Delivery coverage, dispatch
                    timelines, courier partners
                    and final shipping fees have
                    not yet been confirmed.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[#77736E]">
                    No real orders or deliveries
                    are currently processed
                    through this website.
                  </p>
                </>
              )}

              {activePolicy === 'returns' && (
                <>
                  <div className="flex items-center gap-3">
                    <RotateCcw
                      size={24}
                      className="text-[#637666]"
                    />

                    <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                      Returns & Exchanges
                    </h2>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#77736E]">
                    The official return and exchange
                    policy has not yet been finalized.
                    Eligibility may depend on product
                    category, condition, hygiene
                    requirements and applicable law.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[#77736E]">
                    No automatic refunds or exchange
                    requests are currently processed.
                  </p>
                </>
              )}

              {activePolicy === 'privacy' && (
                <>
                  <div className="flex items-center gap-3">
                    <LockKeyhole
                      size={24}
                      className="text-[#637666]"
                    />

                    <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                      Privacy Information
                    </h2>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#77736E]">
                    Guest cart and wishlist data
                    is stored in this browser.
                    When configured, signed-in
                    account and shopping data can
                    also be stored by the service.
                    Contact messages and
                    consented newsletter
                    subscriptions are stored for
                    review. Checkout details are
                    not submitted.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[#77736E]">
                    A complete privacy policy
                    covering data collection,
                    retention, security and
                    user rights must be published
                    before enabling live orders
                    or customer accounts.
                  </p>
                </>
              )}

              {activePolicy === 'terms' && (
                <>
                  <div className="flex items-center gap-3">
                    <FileText
                      size={24}
                      className="text-[#637666]"
                    />

                    <h2 className="font-display text-2xl font-medium text-[#1F2022]">
                      Terms & Conditions
                    </h2>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#77736E]">
                    Product listings, prices,
                    promotions and checkout
                    interactions on this demo
                    website are illustrative
                    until confirmed for launch.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[#77736E]">
                    The website does not currently
                    create binding purchase orders,
                    collect payments or arrange
                    deliveries. Final commercial
                    terms must be approved before
                    live sales begin.
                  </p>
                </>
              )}

              <div className="mt-7 flex items-start gap-2 border-t border-[#E8E1D7] pt-5">
                <ShieldCheck
                  size={17}
                  className="shrink-0 text-[#637666]"
                />

                <p className="text-xs leading-6 text-[#77736E]">
                  Policy details are pending
                  business approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Help */}
        <div className="mt-12 rounded-2xl border border-[#E8E1D7] bg-white p-6 text-center sm:p-8">
          <CheckCircle2
            size={26}
            className="mx-auto text-[#637666]"
          />

          <h3 className="mt-3 font-display text-xl font-medium text-[#1F2022]">
            Explore with Confidence
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-[#77736E]">
            Browse the collections, compare
            products and review sizing information.
            Ordering and support integrations
            will be added before the live launch.
          </p>
        </div>
      </Container>
    </div>
  );
}
