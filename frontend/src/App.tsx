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
import LimitSimulatorPage from "./pages/Bank-Dashboard/simulator";
import SettingsPage from "./pages/Merchant-Dashboard/settings";
import HelpPage from "./pages/Merchant-Dashboard/help";
import BankDashboardPage from "./pages/Bank-Dashboard/overview";

import BankDashboardLayout from "./pages/Bank-Dashboard/layout";
import MerchantDetailPage from "./pages/Bank-Dashboard/merchant-detail";
import EarlyWarningPage from "./pages/Bank-Dashboard/early-warning-system";

import PayBabaDashboardLayout from "./pages/PayBaba-Dashboard/layout";
import MonetizationDashboardPage from "./pages/PayBaba-Dashboard/monetization";
import AIOpsDashboardPage from "./pages/PayBaba-Dashboard/ai-ops";
import { ProtectedRoute } from "./components/ProtectedRoute";
import CreateTransactionPage from "./pages/Merchant-Dashboard/create-transaction";
import LoanApplicationsPage from "./pages/Bank-Dashboard/loans";
import CreateLoanApplicationPage from "./pages/Bank-Dashboard/create-loan";
import BankLimitSimulatorPage from "./pages/Bank-Dashboard/limit-simulator";

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

            <Route path="/merchant/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout children={<DashboardPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/credit" element={
              <ProtectedRoute>
                <DashboardLayout children={<CreditReadinessPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/create-transaction" element={
              <ProtectedRoute>
                <DashboardLayout children={<CreateTransactionPage/>}/>
              </ProtectedRoute>
            } />
            
            <Route path="/merchant/dashboard/transactions" element={
              <ProtectedRoute>
                <DashboardLayout children={<TransactionsPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/analytics" element={
              <ProtectedRoute>
                <DashboardLayout children={<SmartLoanPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout children={<SettingsPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/help" element={
              <ProtectedRoute>
                <DashboardLayout children={<HelpPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/team" element={
              <ProtectedRoute>
                <DashboardLayout children={<TeamPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/merchant/dashboard/notifications" element={
              <ProtectedRoute>
                <DashboardLayout children={<NotificationsPage/>}/>
              </ProtectedRoute>
            } />

            {/* Bank Dashboard */}

            <Route path="/bank/dashboard" element={
              <ProtectedRoute>
                <BankDashboardLayout children={<BankDashboardPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/bank/dashboard/create-loan" element={
              <ProtectedRoute>
                <BankDashboardLayout children={<CreateLoanApplicationPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/bank/dashboard/loans" element={
              <ProtectedRoute>
                <BankDashboardLayout children={<LoanApplicationsPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/bank/dashboard/simulation" element={
              <ProtectedRoute>
                <BankDashboardLayout children={<BankLimitSimulatorPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/bank/dashboard/merchant/:id" element={
              <ProtectedRoute>
                <BankDashboardLayout children={<MerchantDetailPage/>}/>
              </ProtectedRoute>
            }/>

            <Route path="/bank/dashboard/warning-system" element={
              <ProtectedRoute>
                <BankDashboardLayout children={<EarlyWarningPage/>}/>
              </ProtectedRoute>
            } />

            {/* PayBaba Admin Dashboard */}

            <Route path="/paybaba/dashboard" element={
              <ProtectedRoute>
                <PayBabaDashboardLayout children={<MonetizationDashboardPage/>}/>
              </ProtectedRoute>
            } />

            <Route path="/paybaba/dashboard/ai" element={
              <ProtectedRoute>
                <PayBabaDashboardLayout children={<AIOpsDashboardPage/>}/>
              </ProtectedRoute>
            } />

          </Routes>

        )}

      </AnimatePresence>

      <Toaster position="top-center" />

    </BrowserRouter>

  );
}

export default App;
