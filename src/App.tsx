
import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { CartDrawer } from './components/overlays/CartDrawer';
import { SearchModal } from './components/overlays/SearchModal';
import { MobileNav } from './components/overlays/MobileNav';
import { QuickViewModal } from './components/overlays/QuickViewModal';
import { AuthModal } from './components/overlays/AuthModal';
import { NotificationToast } from './components/overlays/NotificationToast';

import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';

const AdminPage = lazy(() =>
    import('./pages/AdminPage').then(({ AdminPage: page }) => ({ default: page }))
);

export function App() {
    return (
        <HashRouter>
            <AuthProvider>
              <CatalogProvider>
                <StoreProvider>
                <div className="flex min-h-screen flex-col bg-white font-sans text-[#202020] selection:bg-[#637666] selection:text-white">
                    <AnnouncementBar />

                    <Header />

                    <main className="flex-1">
                        <Routes>
                            <Route
                                path="/"
                                element={<HomePage />}
                            />

                            <Route
                                path="/category/:slug"
                                element={<CategoryPage />}
                            />

                            <Route
                                path="/product/:slug"
                                element={<ProductDetailPage />}
                            />

                            <Route
                                path="/wishlist"
                                element={<WishlistPage />}
                            />

                            <Route
                                path="/checkout"
                                element={<CheckoutPage />}
                            />

                            <Route
                                path="/admin"
                                element={
                                    <Suspense fallback={<p role="status" className="mx-auto w-full max-w-7xl px-4 py-16 text-center text-sm text-[#77736E]">Loading administrator dashboard…</p>}>
                                        <AdminPage />
                                    </Suspense>
                                }
                            />

                            <Route
                                path="/account"
                                element={<AccountPage />}
                            />

                            <Route
                                path="/about"
                                element={<AboutPage />}
                            />

                            <Route
                                path="/contact"
                                element={<ContactPage />}
                            />

                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </main>

                    <Footer />

                    <CartDrawer />
                    <SearchModal />
                    <MobileNav />
                    <QuickViewModal />
                    <AuthModal />
                    <NotificationToast />
                </div>
                </StoreProvider>
              </CatalogProvider>
            </AuthProvider>
        </HashRouter>
    );
}

export default App;
