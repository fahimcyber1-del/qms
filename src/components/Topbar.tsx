import React from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  Search,
  Globe,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

interface TopbarProps {
  title: string;
  avatarUrl: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowNotif: (msg: string, title: string, type: string) => void;
  onNavigate: (page: string) => void;
  onToggleSidebar: () => void;
}

export function Topbar({ title, avatarUrl, isDarkMode, onToggleDarkMode, onShowNotif, onNavigate, onToggleSidebar }: TopbarProps) {
  return (
    <div id="topbar" className="h-[56px] bg-bg-1 border-b border-border-main flex items-center px-4 md:px-6 gap-3 md:gap-4 flex-shrink-0 sticky top-0 z-40">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-text-2 hover:bg-bg-2 hover:text-text-1 transition-all rounded-lg"
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <div className="flex-1 truncate">
        <h1 className="font-semibold text-base text-text-1 truncate" id="page-title">
          {title}
        </h1>
      </div>
      
      {/* Status Pills */}
      <div className="hidden xl:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-2 rounded-full text-text-2 text-[11px] font-medium">
          <Globe className="w-3 h-3 text-accent" />
          ISO 9001:2015
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-bg-2 rounded-full text-text-2 text-[11px] font-medium">
          <ShieldCheck className="w-3 h-3 text-green-main" />
          BSCI Active
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center bg-bg-2 rounded-lg px-3 py-1.5 gap-2 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all border border-transparent">
          <Search className="w-4 h-4 text-text-3" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-text-1 placeholder-text-3 w-36"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={onToggleDarkMode}
          className="p-2 text-text-3 hover:bg-bg-2 hover:text-text-1 transition-all rounded-lg"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {/* Notifications */}
        <button 
          className="p-2 text-text-3 hover:bg-bg-2 hover:text-text-1 transition-all relative rounded-lg" 
          aria-label="Notifications"
          onClick={() => onShowNotif('3 CAPA deadlines approaching this week', 'CAPA Alert', 'amber')}
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-main rounded-full border-2 border-bg-1"></span>
        </button>
        
        <div className="h-6 w-px bg-border-main mx-1" />
        
        {/* User Avatar */}
        <button 
          className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-bg-2 transition-all rounded-lg" 
          aria-label="User Profile"
          onClick={() => onNavigate('profile')}
        >
          <div className="w-8 h-8 bg-accent/10 rounded-full overflow-hidden flex items-center justify-center">
            {avatarUrl && avatarUrl.trim() !== '' ? (
              <img src={avatarUrl} alt="User Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-accent" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-text-1 leading-none">John Doe</p>
            <p className="text-[10px] text-text-3 leading-none mt-1">Admin</p>
          </div>
        </button>
      </div>
    </div>
  );
}
