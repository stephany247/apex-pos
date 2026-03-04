import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./context/StoreContext";
import Sidebar from "./components/Sidebar";
import POSView from "./components/POS/POSView";
import InventoryView from "./components/Inventory/InventoryView";
import ReportsView from "./components/Reports/ReportsView";
import SalesHistoryView from "./components/History/SalesHistoryView";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import LandingPage from "./components/LandingPage";
import { Menu, Search } from "lucide-react";

// DASHBOARD LAYOUT

const DashboardLayout: React.FC = () => {
  const { currentUser } = useStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const getViewTitle = () => {
    if (location.pathname.includes("inventory")) return "Inventory";
    if (location.pathname.includes("reports")) return "Analytics";
    if (location.pathname.includes("history")) return "Sales History";
    return "Point of Sale";
  };

  return (
    <div className="flex lg:h-screen bg-[#FDF6E9] overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <main className="flex-1 flex flex-col h-full relative lg:ml-[280px] overflow-hidden transition-all duration-300">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-full"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-zinc-200/50 shadow-sm flex-1 max-w-lg">
              <Search className="text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-zinc-900">
                {currentUser?.name}
              </p>
              <p className="text-xs text-zinc-500 uppercase">
                {currentUser?.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FAE29F] flex items-center justify-center font-bold text-[#D97706]">
              {currentUser?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
              {getViewTitle()}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Welcome back, get ready for a busy day.
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <Routes>
              <Route index element={<Navigate to="pos" replace />} />
              <Route path="pos" element={<POSView />} />
              <Route path="inventory" element={<InventoryView />} />
              <Route path="reports" element={<ReportsView />} />
              <Route path="history" element={<SalesHistoryView />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

// Routing

const AppContent: React.FC = () => {
  const { currentUser, isAuthLoading } = useStore();
  if (isAuthLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDF6E9]">
        <h1 className="text-5xl font-bold tracking-tight text-[#111111] animate-pulse">
          apex<span className="text-zinc-400 rounded-full">.</span>
        </h1>
      </div>
    );
  }
  return (
    <Routes>
      {/* Root */}
      <Route
        path="/"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <SignupPage />
        }
      />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          currentUser ? <DashboardLayout /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
