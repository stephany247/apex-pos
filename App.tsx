import React, { useState } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import Sidebar from "./components/Sidebar";
import POSView from "./components/POS/POSView";
import InventoryView from "./components/Inventory/InventoryView";
import ReportsView from "./components/Reports/ReportsView";
import SalesHistoryView from "./components/History/SalesHistoryView";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import { ViewState } from "./types";
import { Menu, Search } from "lucide-react";
import { log } from "console";

// Wrapper component to use the hook inside the provider
const AppContent: React.FC = () => {
  const { currentUser } = useStore();
  const [currentView, setCurrentView] = useState<ViewState>("pos");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");

  if (!currentUser) {
    if (authView === "login") {
      return <LoginPage onNavigateToSignup={() => setAuthView("signup")} />;
    } else {
      return <SignupPage onNavigateToLogin={() => setAuthView("login")} />;
    }
  }

  const renderView = () => {
    switch (currentView) {
      case "pos":
        return <POSView />;
      case "inventory":
        return <InventoryView />;
      case "reports":
        return <ReportsView />;
      case "history":
        return <SalesHistoryView />;
      case "settings":
        return (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <div className="text-center bg-white p-12 rounded-3xl shadow-sm">
              <h2 className="text-3xl font-bold mb-4 text-zinc-800">
                Settings
              </h2>
              <p>Configuration panel.</p>
            </div>
          </div>
        );
      default:
        return <POSView />;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case "pos":
        return "Point of Sale";
      case "inventory":
        return "Inventory";
      case "reports":
        return "Analytics";
      case "history":
        return "Sales History";
      default:
        return "Dashboard";
    }
  };
console.log("user", currentUser);

  return (
    <div className="flex lg:h-screen bg-[#FDF6E9] overflow-hidden">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 flex flex-col h-full relative lg:ml-[280px] overflow-hidden transition-all duration-300">
        {/* Global Header */}
        <header className="px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-full"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar - Decorative to match style */}
            <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-zinc-200/50 shadow-sm flex-1 max-w-lg">
              <Search className="text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400"
              />
              <div className="text-xs text-zinc-400 border-l border-zinc-200 pl-3 hidden lg:block whitespace-nowrap">
                In:{" "}
                <span className="text-zinc-800 font-medium">All Modules</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-zinc-900 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  {currentUser.role}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FAE29F] border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-lg font-bold text-[#D97706]">
                {currentUser?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
          {/* Title Section (Dynamic) */}
          <div className="flex justify-between items-end mb-4 flex-shrink-0">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
                {getViewTitle()}
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Welcome back, get ready for a busy day.
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">{renderView()}</div>
        </div>
      </main>
    </div>
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
