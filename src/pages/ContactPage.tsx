import React, { useState } from 'react';
import { Mail, Phone, Clock, MessageSquare, ChevronDown, CheckCircle2, ShieldCheck, Ruler } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

const FAQS = [
  {
    q: 'How does the 30-Day First Pair Comfort Guarantee work?',
    a: 'Purchase your first pair of 2427 innerwear or bralette. Wear it, wash it, and test it for 30 days. If you are not thoroughly enamored with the fit and botanical softness, keep it and we will exchange the size or issue a full refund without returning the piece.',
  },
  {
    q: 'How do I care for Austrian MicroModal Air™ and Supima garments?',
    a: 'Machine wash on a gentle cold cycle (30°C max) using mild detergent. For longevity, dry flat in the shade or tumble dry on low heat. Avoid fabric softeners or chlorine bleach, as botanical fibers are naturally soft and need no chemical coating.',
  },
  {
    q: 'What are your pan-India shipping timelines and packaging?',
    a: 'Orders are dispatched within 24 hours from our Mumbai atelier. Delivery takes 2–4 business days across metro cities (Delhi NCR, Bengaluru, Mumbai, Chennai, Hyderabad, Kolkata) and 4–6 days for regional destinations. All orders are packed in discreet, recyclable boxes.',
  },
  {
    q: 'What is the difference between Trunks, Briefs, and Boxers?',
    a: 'Trunks feature a close mid-thigh fit engineered to avoid ride-up under modern trousers. Briefs offer zero thigh coverage with high leg mobility and athletic support. Boxers offer a traditional relaxed woven rise tailored with a flat front.',
  },
];

export function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'size-guide' | 'faq'>('contact');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5] min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="eyebrow text-[#637666]">Client Concierge</span>
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#1F2022] mt-2">
            How May We Assist You?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5E6064]">
            Personalized sizing consultations, order inquiries, and material questions.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-8 inline-flex rounded-full border border-[#E8E1D7] bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'contact'
                  ? 'bg-[#1F2022] text-white shadow-xs'
                  : 'text-[#6B6F76] hover:text-[#1F2022]'
              }`}
            >
              Get in Touch
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('size-guide')}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'size-guide'
                  ? 'bg-[#1F2022] text-white shadow-xs'
                  : 'text-[#6B6F76] hover:text-[#1F2022]'
              }`}
            >
              Interactive Size Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'faq'
                  ? 'bg-[#1F2022] text-white shadow-xs'
                  : 'text-[#6B6F76] hover:text-[#1F2022]'
              }`}
            >
              Frequently Asked Questions
            </button>
          </div>
        </div>

        {/* Tab 1: Contact Form & Info */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 rounded-3xl bg-[#1F2022] p-8 text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9CBB7]">
                  Dedicated Concierge
                </span>
                <h3 className="font-display text-3xl font-medium mt-2">Direct Contact</h3>
                <p className="mt-3 text-xs sm:text-sm text-[#FAF8F5]/75 leading-relaxed font-light">
                  Our innerwear fit specialists are available 6 days a week to provide tailored sizing recommendations.
                </p>

                <div className="mt-8 space-y-4 text-xs text-[#FAF8F5]/85">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#637666]" />
                    <div>
                      <span className="block text-[10px] uppercase text-[#FAF8F5]/50 font-bold">Email Concierge</span>
                      <span>concierge@2427atelier.com</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#637666]" />
                    <div>
                      <span className="block text-[10px] uppercase text-[#FAF8F5]/50 font-bold">Client Hotline / WhatsApp</span>
                      <span>+91 (0) 80 4924 2427</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#637666]" />
                    <div>
                      <span className="block text-[10px] uppercase text-[#FAF8F5]/50 font-bold">Operating Hours</span>
                      <span>Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#FAF8F5]/60 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#637666]" />
                <span>Confidential, discreet communication assured</span>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl bg-white p-8 sm:p-10 border border-[#E8E1D7] shadow-xs">
              <h3 className="font-display text-2xl font-medium text-[#1F2022]">Send a Message</h3>
              <p className="text-xs text-[#5E6064] mt-1">
                We typically respond within 2 to 4 business hours.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-[#637666]/10 p-8 text-center border border-[#637666]/20">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[#637666] mb-3" />
                  <h4 className="font-display text-2xl font-medium text-[#1F2022]">
                    Message Dispatched Successfully
                  </h4>
                  <p className="mt-2 text-xs text-[#5E6064]">
                    Thank you. A 2427 fit consultant has been assigned to your inquiry and will follow up promptly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="mt-6 space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-[#1F2022] mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Vikram Sengupta"
                        className="w-full rounded-xl border border-[#E8E1D7] p-3 text-xs outline-hidden focus:border-[#637666]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#1F2022] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="vikram@domain.com"
                        className="w-full rounded-xl border border-[#E8E1D7] p-3 text-xs outline-hidden focus:border-[#637666]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-[#1F2022] mb-1">Topic</label>
                    <select className="w-full rounded-xl border border-[#E8E1D7] p-3 text-xs outline-hidden focus:border-[#637666] bg-white">
                      <option>Sizing &amp; Fit Recommendation</option>
                      <option>Order &amp; Delivery Tracking</option>
                      <option>First Pair Guarantee Inquiry</option>
                      <option>Fabric &amp; Care Guidance</option>
                      <option>Wholesale &amp; Gifting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#1F2022] mb-1">Your Inquiry</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please share details regarding your inquiry or sizing requirements..."
                      className="w-full rounded-xl border border-[#E8E1D7] p-3 text-xs outline-hidden focus:border-[#637666]"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full py-3">
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Size Guide */}
        {activeTab === 'size-guide' && (
          <div className="space-y-10">
            {/* Men's Size Guide */}
            <div className="rounded-3xl bg-white p-8 border border-[#E8E1D7] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="h-5 w-5 text-[#637666]" />
                <h3 className="font-display text-2xl font-medium text-[#1F2022]">
                  Men's Underwear &amp; Boxers Sizing (Inches &bull; cm)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-[#1F2022]">
                  <thead className="bg-[#FAF8F5] border-b border-[#E8E1D7] font-numeral text-[11px] uppercase tracking-wider text-[#637666]">
                    <tr>
                      <th className="p-3">Size Tag</th>
                      <th className="p-3">Waist (Inches)</th>
                      <th className="p-3">Waist (cm)</th>
                      <th className="p-3">Standard Trouser Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E1D7] font-numeral">
                    <tr>
                      <td className="p-3 font-bold">Small (S)</td>
                      <td className="p-3">28" – 30"</td>
                      <td className="p-3">71 – 76 cm</td>
                      <td className="p-3 font-sans">Slim / Athletic 28-30</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Medium (M)</td>
                      <td className="p-3">31" – 33"</td>
                      <td className="p-3">78 – 84 cm</td>
                      <td className="p-3 font-sans">Most Common 32</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">Large (L)</td>
                      <td className="p-3">34" – 36"</td>
                      <td className="p-3">86 – 91 cm</td>
                      <td className="p-3 font-sans">Regular 34-36</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">X-Large (XL)</td>
                      <td className="p-3">37" – 39"</td>
                      <td className="p-3">94 – 99 cm</td>
                      <td className="p-3 font-sans">Relaxed 38</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">XX-Large (XXL)</td>
                      <td className="p-3">40" – 43"</td>
                      <td className="p-3">101 – 109 cm</td>
                      <td className="p-3 font-sans">Comfort 40-42</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women's Size Guide */}
            <div className="rounded-3xl bg-white p-8 border border-[#E8E1D7] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="h-5 w-5 text-[#637666]" />
                <h3 className="font-display text-2xl font-medium text-[#1F2022]">
                  Women's Wire-Free Bras &amp; Bralettes Sizing
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-[#1F2022]">
                  <thead className="bg-[#FAF8F5] border-b border-[#E8E1D7] font-numeral text-[11px] uppercase tracking-wider text-[#637666]">
                    <tr>
                      <th className="p-3">Size Tag</th>
                      <th className="p-3">Underbust Band</th>
                      <th className="p-3">Traditional Cup Equivalent</th>
                      <th className="p-3">Recommended For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E1D7] font-numeral">
                    <tr>
                      <td className="p-3 font-bold">XS</td>
                      <td className="p-3">28" – 30"</td>
                      <td className="p-3">30A, 30B, 32A</td>
                      <td className="p-3 font-sans">Petite frame contour</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">S</td>
                      <td className="p-3">31" – 32"</td>
                      <td className="p-3">32B, 32C, 34A</td>
                      <td className="p-3 font-sans">Standard Small</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">M</td>
                      <td className="p-3">33" – 34"</td>
                      <td className="p-3">34B, 34C, 36A, 36B</td>
                      <td className="p-3 font-sans">Most Popular Fit</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">L</td>
                      <td className="p-3">35" – 36"</td>
                      <td className="p-3">36C, 36D, 38B</td>
                      <td className="p-3 font-sans">Fuller coverage &amp; hold</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold">XL</td>
                      <td className="p-3">37" – 39"</td>
                      <td className="p-3">38C, 38D, 40B, 40C</td>
                      <td className="p-3 font-sans">Enhanced wide-band ease</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: FAQ */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#E8E1D7] p-6 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-display text-lg sm:text-xl font-medium text-[#1F2022]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#637666] transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-[#5E6064] leading-relaxed border-t border-[#E8E1D7] pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
