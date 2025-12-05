"use client";

import React from "react";
import {
  Home,
  Bitcoin,
  Gem,
  Droplets,
  Coins,
  Package,
  Users,
  Crown,
  HelpCircle,
  Settings,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  TrendingUp,
  LineChart,
  Plus,
  Minus,
  Gift,
  CreditCard,
  DollarSign,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface UserProfile {
  name: string;
  level: string;
}

interface SharedSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navItems: NavItem[];
  userProfile: UserProfile;
  darkMode: boolean;
  setDarkMode?: (darkMode: boolean) => void;
  showThemeToggleAndLogout?: boolean;
}

const SharedSidebar: React.FC<SharedSidebarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
  navItems,
  userProfile,
  darkMode,
  setDarkMode,
  showThemeToggleAndLogout = false,
}) => {
  return (
    <>
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Prestige<span className="text-[#2ECC71]">Wealth</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-[#2ECC71]/30 bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] p-0.5">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-[#2ECC71]" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userProfile.name}
                  </h3>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white text-xs font-medium">
                    {userProfile.level}
                  </span>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1 h-[calc(100vh-200px)] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 border-l-3 border-[#2ECC71]"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div
                    className={`${
                      activeTab === item.id
                        ? "text-[#2ECC71]"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      activeTab === item.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Prestige<span className="text-[#2ECC71]">Wealth</span>
            </span>
          </div>
        </div>

        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#2ECC71]/30 bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] p-0.5">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <User className="w-7 h-7 text-[#2ECC71]" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {userProfile.name}
              </h3>
              <span className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white text-xs font-medium mt-1">
                {userProfile.level}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 border-l-3 border-[#2ECC71]"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div
                className={`${
                  activeTab === item.id
                    ? "text-[#2ECC71]"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  activeTab === item.id
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SharedSidebar;
