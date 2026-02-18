import React from 'react';
import { ShoppingCart, History, BarChart3, LogOut, Package } from 'lucide-react';
import { ViewState } from '../types';
import { useStore } from '../context/StoreContext';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isMobileOpen, setIsMobileOpen }) => {
  const { logout } = useStore();
  
  const generalItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'pos', label: 'Point of Sale', icon: <ShoppingCart size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'history', label: 'Sales History', icon: <History size={20} /> },
    { id: 'reports', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ];

  const handleNav = (view: ViewState) => {
    setView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[280px] bg-[#111111] text-zinc-100 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col rounded-r-3xl lg:rounded-none
      `}>
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2 tracking-tight">
            apex<span className="text-zinc-500">.</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
          <div>
            <h3 className="px-4 text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">General</h3>
            <nav className="space-y-1">
              {generalItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                    ${currentView === item.id 
                        ? 'text-white bg-white/10 font-semibold' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                    `}
                >
                    <div className={`${currentView === item.id ? 'text-[#FDE047]' : 'text-current group-hover:text-white transition-colors'}`}>
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
                onClick={logout}
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