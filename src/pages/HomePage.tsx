import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryCards } from '../components/home/CategoryCards';
import { FabricMarquee } from '../components/home/FabricMarquee';

export function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FabricMarquee />
      <CategoryCards />
    </main>
  );
}
