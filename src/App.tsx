import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { RootLayout } from './components/layout/RootLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProductPage } from './pages/ProductPage';
import { SearchPage } from './pages/SearchPage';
import { CustomProductsPage } from './pages/CustomProductsPage';
import { CoupleWebsitesPage } from './pages/CoupleWebsitesPage';
import { BotPanelsPageWrapper } from './pages/BotPanelsPageWrapper';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FaqPage } from './pages/FaqPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { PolicyPage } from './pages/PolicyPage';
import { ComparePage } from './pages/ComparePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Commerce Pages
import { CartPage } from './pages/CartPage';
import { CheckoutPageWrapper } from './pages/CheckoutPageWrapper';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

// Customer & Admin
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { EditPageStudio } from './pages/EditPageStudio';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Layout wrapper for all customer & public storefront pages */}
            <Route element={<RootLayout />}>
              
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* Catalog & Filtered Departments */}
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/men" element={<ShopPage categoryOverride="men" />} />
              <Route path="/shop/women" element={<ShopPage categoryOverride="women" />} />
              <Route path="/shop/unisex" element={<ShopPage categoryOverride="unisex" />} />
              <Route path="/shop/couples" element={<ShopPage categoryOverride="couples" />} />
              <Route path="/shop/custom" element={<ShopPage categoryOverride="custom" />} />
              <Route path="/shop/digital" element={<ShopPage categoryOverride="digital" />} />

              {/* Special Collections */}
              <Route path="/deals" element={<ShopPage filterOverride="deals" />} />
              <Route path="/best-sellers" element={<ShopPage filterOverride="best-sellers" />} />
              <Route path="/new-arrivals" element={<ShopPage filterOverride="new-arrivals" />} />

              {/* Categories & Slugs */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryDetailPage />} />

              {/* Product Detail */}
              <Route path="/product/:slug" element={<ProductPage />} />

              {/* Search & Compare */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/compare" element={<ComparePage />} />

              {/* Custom Atelier & Commission Builder */}
              <Route path="/custom-products" element={<CustomProductsPage />} />
              <Route path="/custom-products/:slug" element={<CustomProductsPage />} />

              {/* Couple Websites Builder & Live Sanctuaries */}
              <Route path="/couple-websites" element={<CoupleWebsitesPage />} />
              <Route path="/couple-websites/:slug" element={<CoupleWebsitesPage />} />

              {/* Bot Panels & Automation Cloud */}
              <Route path="/bot-panels" element={<BotPanelsPageWrapper />} />
              <Route path="/bot-panels/:slug" element={<BotPanelsPageWrapper />} />

              {/* Company & Support Pages */}
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />

              {/* Policies */}
              <Route path="/privacy-policy" element={<PolicyPage policy="privacy" />} />
              <Route path="/terms" element={<PolicyPage policy="terms" />} />
              <Route path="/refund-policy" element={<PolicyPage policy="refund" />} />
              <Route path="/shipping-policy" element={<PolicyPage policy="shipping" />} />
              <Route path="/custom-orders-policy" element={<PolicyPage policy="custom-order" />} />
              <Route path="/cookie-policy" element={<PolicyPage policy="cookie" />} />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Commerce Flow */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPageWrapper />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />

              {/* Customer Account Routes (Protected) */}
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/profile" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/orders/:id" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/wishlist" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/reviews" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/custom-orders" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/custom-orders/:id" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/couple-websites" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/couple-websites/:id" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/support" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/notifications" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/settings" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/account/invoices" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

              {/* Admin Portal & Visual Page Editor (Protected by Supabase Auth + RBAC) */}
              <Route path="/edit-page" element={<AdminRoute><EditPageStudio /></AdminRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/hax-portal" element={<AdminRoute><AdminPage /></AdminRoute>} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
