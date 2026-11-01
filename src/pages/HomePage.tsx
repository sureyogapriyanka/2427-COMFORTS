import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryCards } from '../components/home/CategoryCards';
import { FabricMarquee } from '../components/home/FabricMarquee';
import { FeaturedProducts } from '../components/home/FeaturedProducts';

export function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FabricMarquee />
      <CategoryCards />
      <FeaturedProducts />
    </main>
  );
}
