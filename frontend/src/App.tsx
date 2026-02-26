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
import DashboardPage from "./pages/Dashboard/page";
import DashboardLayout from "./components/dashboard/layout";

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

            <Route path="/auth/login" element={<LoginPage/>} />
            <Route path="/auth/register" element={<RegisterPage/>} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage/>} />

            <Route path="/merchant/dashboard" element={<DashboardLayout children={<DashboardPage/>}/>} />

          </Routes>

        )}

      </AnimatePresence>

      <Toaster position="top-center" />

    </BrowserRouter>

  );
}

export default App;
