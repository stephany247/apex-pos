import React from "react";
import {
  ShoppingCart,
  History,
  BarChart3,
  LogOut,
  Package,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const generalItems = [
    { path: "pos", label: "Point of Sale", icon: <ShoppingCart size={20} /> },
    { path: "inventory", label: "Inventory", icon: <Package size={20} /> },
    { path: "history", label: "Sales History", icon: <History size={20} /> },
    { path: "reports", label: "Analytics", icon: <BarChart3 size={20} /> },
  ];

  const handleNav = (path: string) => {
    navigate(`/dashboard/${path}`);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname.includes(path);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[280px] bg-[#111111] text-zinc-100 transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col rounded-r-3xl lg:rounded-none
        `}
      >
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            apex<span className="text-zinc-500">.</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
          <div>
            <h3 className="px-4 text-xs text-zinc-600 uppercase tracking-wider mb-2">
              General
            </h3>

            <nav className="space-y-1">
              {generalItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                    ${
                      isActive(item.path)
                        ? "text-white bg-white/10 font-semibold"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                    }
                  `}
                >
                  <div
                    className={
                      isActive(item.path)
                        ? "text-[#FDE047]"
                        : "text-current group-hover:text-white"
                    }
                  >
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;