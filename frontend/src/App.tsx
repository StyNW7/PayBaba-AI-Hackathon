// Default Import

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

// Layout

import Layout from "@/layouts/root-layout";

// Utility Pages / Components

import ScrollToTop from "./utility/ScrollToTop";
import CustomCursor from "./utility/CustomCursor";
import ScrollToTopFunction from "./utility/ScrollToTopFunction";
import NotFoundPage from "./pages/Utility/NotFound404";
import LoadingScreen from "./pages/Utility/LoadingScreen";

// Pages

import LandingPage from "@/pages/Landing/page";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import ForgotPasswordPage from "./pages/Auth/Forgot-Password";
import DashboardPage from "./pages/Merchant-Dashboard/page";
import DashboardLayout from "./components/dashboard/layout";
import CreditReadinessPage from "./pages/Merchant-Dashboard/credit-readiness";
import TeamPage from "./pages/Merchant-Dashboard/team-page";
import NotificationsPage from "./pages/Merchant-Dashboard/notifications";
import TransactionsPage from "./pages/Merchant-Dashboard/transaction";
import SmartLoanPage from "./pages/Merchant-Dashboard/time-loan";
import LimitSimulatorPage from "./pages/Merchant-Dashboard/simulator";
import SettingsPage from "./pages/Merchant-Dashboard/settings";
import HelpPage from "./pages/Merchant-Dashboard/help";
import BankDashboardPage from "./pages/Bank-Dashboard/overview";

import BankDashboardLayout from "./pages/Bank-Dashboard/layout";
import MerchantDetailPage from "./pages/Bank-Dashboard/merchant-detail";
import EarlyWarningPage from "./pages/Bank-Dashboard/early-warning-system";

function App() {

  const [loading, setLoading] = useState(true);

  return (

    // Providers, Router, Scroll to Top Function and Button, and Custom Cursor

    <BrowserRouter>
      <ScrollToTopFunction />
      <ScrollToTop />
      <CustomCursor />

      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}

      <AnimatePresence mode="wait">

        {!loading && (

          <Routes>

            <Route path="/" element={<Layout />}>
              
                <Route index element={<LandingPage/>} />

                <Route path="*" element={<NotFoundPage />} />

            </Route>

            {/* Auth Page */}

            <Route path="/auth/login" element={<LoginPage/>} />
            <Route path="/auth/register" element={<RegisterPage/>} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage/>} />

            {/* Merchant Dashboard */}

            <Route path="/merchant/dashboard" element={<DashboardLayout children={<DashboardPage/>}/>} />
            <Route path="/merchant/dashboard/credit" element={<DashboardLayout children={<CreditReadinessPage/>}/>} />
            <Route path="/merchant/dashboard/transactions" element={<DashboardLayout children={<TransactionsPage/>}/>} />

            <Route path="/merchant/dashboard/analytics" element={<DashboardLayout children={<SmartLoanPage/>}/>} />
            <Route path="/merchant/dashboard/simulator" element={<DashboardLayout children={<LimitSimulatorPage/>}/>} />

            <Route path="/merchant/dashboard/settings" element={<DashboardLayout children={<SettingsPage/>}/>} />
            <Route path="/merchant/dashboard/help" element={<DashboardLayout children={<HelpPage/>}/>} />

            <Route path="/merchant/dashboard/team" element={<DashboardLayout children={<TeamPage/>}/>} />
            <Route path="/merchant/dashboard/notifications" element={<DashboardLayout children={<NotificationsPage/>}/>} />

            {/* Bank Dashboard */}

            <Route path="/bank/dashboard" element={<BankDashboardLayout children={<BankDashboardPage/>}/>} />

            {/* Ini harus disesuaikan lagi */}
            <Route path="/bank/dashboard/merchant/:id" element={<BankDashboardLayout children={<MerchantDetailPage/>}/>} />

            <Route path="/bank/dashboard/warning-system" element={<BankDashboardLayout children={<EarlyWarningPage/>}/>} />

          </Routes>

        )}

      </AnimatePresence>

      <Toaster position="top-center" />

    </BrowserRouter>

  );
}

export default App;
