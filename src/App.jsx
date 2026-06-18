import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';

import Landing from './pages/Landing';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SecurityPage from './pages/SecurityPage';
import ApiDocsPage from './pages/ApiDocsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardHome from './pages/DashboardHome';
import ForeclosuresPage from './pages/ForeclosuresPage';
import ForeclosureDetailPage from './pages/ForeclosureDetailPage';
import AlertsPage from './pages/AlertsPage';
import SavedSearchesPage from './pages/SavedSearchesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import RequireAuth from '@/components/RequireAuth';
import RequireAuthOrGuest from '@/components/RequireAuthOrGuest';
import RequireEntitlement from '@/components/RequireEntitlement';
import AuthCallbackHandler from '@/components/AuthCallbackHandler';
import FeedbackThankYou from '@/components/FeedbackThankYou';

function AppRoutes() {
  return (
    <>
      <AuthCallbackHandler />
      <FeedbackThankYou />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/api" element={<ApiDocsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={<DashboardHome />}
        />
        <Route
          path="/dashboard/foreclosures"
          element={
            <RequireAuthOrGuest>
              <RequireEntitlement>
                <ForeclosuresPage />
              </RequireEntitlement>
            </RequireAuthOrGuest>
          }
        />
        <Route
          path="/dashboard/foreclosures/:id"
          element={
            <RequireAuthOrGuest>
              <RequireEntitlement>
                <ForeclosureDetailPage />
              </RequireEntitlement>
            </RequireAuthOrGuest>
          }
        />
        <Route
          path="/dashboard/alerts"
          element={
            <RequireAuth>
              <RequireEntitlement>
                <AlertsPage />
              </RequireEntitlement>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/saved"
          element={
            <RequireAuth>
              <RequireEntitlement>
                <SavedSearchesPage />
              </RequireEntitlement>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/billing"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireAuthOrGuest>
              <RequireEntitlement>
                <AnalyticsPage />
              </RequireEntitlement>
            </RequireAuthOrGuest>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />

        {/* Legacy redirects */}
        <Route
          path="/dashboard/list"
          element={
            <RequireAuthOrGuest>
              <RequireEntitlement>
                <ForeclosuresPage />
              </RequireEntitlement>
            </RequireAuthOrGuest>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AppRoutes />
        </Router>
        <Analytics />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
