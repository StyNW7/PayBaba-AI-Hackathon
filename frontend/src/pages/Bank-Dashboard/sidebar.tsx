'use client';

import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  LogOut, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';

export default function Sidebar() {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    navigate("/")
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Portfolio', href: '/bank/dashboard', active: true },
    { icon: TrendingUp, label: 'Merchant Detail', href: '/bank/dashboard/merchant/:id' },
    { icon: Wallet, label: 'Early Warning System', href: '/bank/dashboard/warning-system' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 lg:hidden group ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? 
          <X size={22} className="text-[#1F2937] group-hover:text-[#F15A22] transition-colors" /> : 
          <Menu size={22} className="text-[#1F2937] group-hover:text-[#F15A22] transition-colors" />
        }
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white/90 backdrop-blur-xl border-r border-[#E5E7EB]/60 w-72 z-40 transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0 shadow-2xl lg:shadow-none`}
      >
        {/* Logo Section with Gradient */}
        <div className="p-6 border-b border-[#E5E7EB]/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <img src='/Images/logo-only.png'/>
            </div>
            <div>
                <span className="text-2xl font-bold text-[#2DAEAA] block leading-tight">
                Pay<span className="text-[#F15A22]">Baba</span>
                </span>
                <span className="text-[#6B7280] text-xs">Bank Dashboard</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#F15A22]/10 to-[#2DAEAA]/10 text-[#F15A22]' 
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#F15A22]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-[#F15A22]' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight size={16} className="absolute right-4 text-[#F15A22]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E5E7EB]/60 bg-white/90 backdrop-blur-xl">
          {/* Help Button */}
          <a
            href="/bank/dashboard/help"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B7280] hover:text-[#2DAEAA] hover:bg-[#E0F7F6] transition-all duration-200 mb-2"
          >
            <HelpCircle size={20} />
            <span className="font-medium">Help & Support</span>
          </a>
          
          {/* Logout Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] transition-all duration-200 group" onClick={handleLogout}>
            <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}