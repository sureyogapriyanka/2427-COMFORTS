import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryCards } from '../components/home/CategoryCards';

export function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <CategoryCards />
    </main>
  );
}
