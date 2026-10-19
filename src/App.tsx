
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DemoBadge } from './components/brand/DemoBadge';

// Overlays
import { CartDrawer } from './components/overlays/CartDrawer';
import { SearchModal } from './components/overlays/SearchModal';
import { MobileNav } from './components/overlays/MobileNav';
import { QuickViewModal } from './components/overlays/QuickViewModal';
import { AuthModal } from './components/overlays/AuthModal';
import { NotificationToast } from './components/overlays/NotificationToast';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

export function App() {
  return (
    <HashRouter>
      <StoreProvider>
        <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1F2022] font-sans selection:bg-[#637666] selection:text-[#FAF8F5]">
          {/* Global Demo Notice Banner */}
          <DemoBadge variant="banner" />

          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* Sticky Header with Logo & Dropdowns */}
          <Header />

          {/* Main Routing Views */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Comprehensive Footer */}
          <Footer />

          {/* Global Interactive Overlays */}
          <CartDrawer />
          <SearchModal />
          <MobileNav />
          <QuickViewModal />
          <AuthModal />
          <NotificationToast />
        </div>
      </StoreProvider>
    </HashRouter>
  );
}

export default App;
