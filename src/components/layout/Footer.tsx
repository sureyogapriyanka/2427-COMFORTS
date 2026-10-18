import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  Leaf,
  Mail,
  Phone,
  Clock,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#E8E1D7] bg-[#1F2022] text-[#FAF8F5]">
      {/* Upper Highlight Strip */}
      <div className="border-b border-[#FAF8F5]/10 py-10">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#637666]/20 text-[#637666]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-xs text-[#FAF8F5]">First Pair Guarantee</p>
                <p className="text-[11px] text-[#FAF8F5]/60">30-day hassle-free comfort trial</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#637666]/20 text-[#637666]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-xs text-[#FAF8F5]">Express Pan-India</p>
                <p className="text-[11px] text-[#FAF8F5]/60">Free shipping on orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#637666]/20 text-[#637666]">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-xs text-[#FAF8F5]">Botanical Sourcing</p>
                <p className="text-[11px] text-[#FAF8F5]/60">Austrian Lenzing™ &amp; Supima</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#637666]/20 text-[#637666]">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-xs text-[#FAF8F5]">Discreet Packaging</p>
                <p className="text-[11px] text-[#FAF8F5]/60">100% Recyclable organic boxes</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Directory */}
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Logo inverted size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#FAF8F5]/70">
              2427 crafts architectural second-skin innerwear and everyday essentials for men and women. Engineered for 24 hours a day, 7 days a week of uncompromising physical ease.
            </p>

            <div className="mt-6 space-y-2 text-xs text-[#FAF8F5]/80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#637666]" />
                <span>concierge@2427atelier.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#637666]" />
                <span>+91 (0) 80 4924 2427</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#637666]" />
                <span>Mon – Sat: 9:00 AM – 8:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Men Column */}
          <div className="lg:col-span-2">
            <h4 className="eyebrow text-[#D9CBB7] mb-4">Men</h4>
            <ul className="space-y-2.5 text-xs text-[#FAF8F5]/75">
              <li>
                <Link to="/category/men-underwear" className="hover:text-white transition-colors">
                  Underwear &amp; Trunks
                </Link>
              </li>
              <li>
                <Link to="/category/men-boxers" className="hover:text-white transition-colors">
                  Pure Supima Boxers
                </Link>
              </li>
              <li>
                <Link to="/category/men-vests" className="hover:text-white transition-colors">
                  Bonded Banians / Vests
                </Link>
              </li>
              <li>
                <Link to="/category/men-sleeveless" className="hover:text-white transition-colors">
                  Sleeveless Tops &amp; Ribs
                </Link>
              </li>
              <li>
                <Link to="/category/bundles" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>3-Pack Value Sets</span>
                  <span className="text-[10px] text-[#D9CBB7]">• 20% Off</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Women Column */}
          <div className="lg:col-span-2">
            <h4 className="eyebrow text-[#D9CBB7] mb-4">Women</h4>
            <ul className="space-y-2.5 text-xs text-[#FAF8F5]/75">
              <li>
                <Link to="/category/women-bras" className="hover:text-white transition-colors">
                  Wire-Free Bras &amp; Bralettes
                </Link>
              </li>
              <li>
                <Link to="/category/women-underwear" className="hover:text-white transition-colors">
                  Raw-Cut Invisible Briefs
                </Link>
              </li>
              <li>
                <Link to="/category/women-camisoles" className="hover:text-white transition-colors">
                  SilkTouch Modal Camisoles
                </Link>
              </li>
              <li>
                <Link to="/category/women-crop-tops" className="hover:text-white transition-colors">
                  Sculpted Lounge Crop Tops
                </Link>
              </li>
              <li>
                <Link to="/category/bundles" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Cloud Bralette Duos</span>
                  <span className="text-[10px] text-[#D9CBB7]">• Save</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-2">
            <h4 className="eyebrow text-[#D9CBB7] mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-[#FAF8F5]/75">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Help Desk
                </Link>
              </li>
              <li>
                <Link to="/contact#size-guide" className="hover:text-white transition-colors">
                  Interactive Size Guide
                </Link>
              </li>
              <li>
                <Link to="/contact#track" className="hover:text-white transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/contact#returns" className="hover:text-white transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link to="/about#sustainability" className="hover:text-white transition-colors">
                  Material Sourcing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="lg:col-span-2">
            <h4 className="eyebrow text-[#D9CBB7] mb-4">Policies &amp; Legal</h4>
            <ul className="space-y-2.5 text-xs text-[#FAF8F5]/75">
              <li>
                <Link to="/contact#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact#shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact#care-guide" className="hover:text-white transition-colors">
                  Garment Care Instructions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Brand Atelier Story
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Payment Badges */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#FAF8F5]/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-[#FAF8F5]/60">
            <Lock className="h-3.5 w-3.5 text-[#637666]" />
            <span>256-Bit SSL Encrypted Checkout &bull; PCI-DSS Level 1 Compliant</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-numeral text-[11px] text-[#FAF8F5]/70">
            <span className="rounded bg-white/10 px-2 py-1 font-semibold">UPI / QR</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold">RuPay</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold">VISA</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold">MasterCard</span>
            <span className="rounded bg-white/10 px-2 py-1 font-semibold">NetBanking</span>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-8 border-t border-[#FAF8F5]/10 pt-6 text-center text-[11px] text-[#FAF8F5]/50 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} 2427 Innerwear &amp; Atelier Private Limited. All rights reserved.</p>
          <p className="text-[#D9CBB7]/80">
            Phase 1 UI Prototype. Unverified product data and prices are demo content for development.
          </p>
        </div>
      </Container>
    </footer>
  );
}
