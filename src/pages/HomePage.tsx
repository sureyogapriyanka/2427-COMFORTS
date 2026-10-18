import React from 'react';
import { Hero } from '../components/home/Hero';
import { FabricMarquee } from '../components/home/FabricMarquee';
import { MenCategories } from '../components/home/MenCategories';
import { WomenCategories } from '../components/home/WomenCategories';
import { NewArrivals } from '../components/home/NewArrivals';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BundlesSection } from '../components/home/BundlesSection';
import { BrandStory } from '../components/home/BrandStory';
import { Benefits } from '../components/home/Benefits';
import { Newsletter } from '../components/home/Newsletter';

export function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Premium Hero Banner */}
      <Hero />

      {/* Botanical Textile Ticker */}
      <FabricMarquee />

      {/* 2. Men's Category Cards */}
      <MenCategories />

      {/* 3. Women's Category Cards */}
      <WomenCategories />

      {/* 4. New Arrivals */}
      <NewArrivals />

      {/* 5. Featured Products & Fabric Lab */}
      <FeaturedProducts />

      {/* 6. Multipacks and Bundles */}
      <BundlesSection />

      {/* 7. Brand Story ("The Philosophy of 2427") */}
      <BrandStory />

      {/* 8. Customer Support and Shopping Benefits */}
      <Benefits />

      {/* 9. Newsletter Subscription Interface */}
      <Newsletter />
    </main>
  );
}
