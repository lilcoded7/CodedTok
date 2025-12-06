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
} from "lucide-react";

interface CampaignAccount {
  id: string;
  username: string;
  name: string | null;
  profile: string | null;
  bio: string;
  verified: boolean;
  country: string;
  is_public: boolean;
  is_business_account: boolean;
  account_level: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

interface SharedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: { account: CampaignAccount } | null;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  {
    id: "mining",
    label: "Crypto Mining",
    icon: <Bitcoin className="w-5 h-5" />,
  },
  { id: "gold", label: "Gold Bars", icon: <Gem className="w-5 h-5" /> },
  { id: "oil", label: "Oil Barrels", icon: <Droplets className="w-5 h-5" /> },
  { id: "crypto", label: "Crypto Assets", icon: <Coins className="w-5 h-5" /> },
  {
    id: "mystery",
    label: "Mystery Box",
    icon: <Package className="w-5 h-5" />,
  },
  { id: "referrals", label: "Referrals", icon: <Users className="w-5 h-5" /> },
  {
    id: "subscription",
    label: "Subscription",
    icon: <Crown className="w-5 h-5" />,
  },
];

const SharedSidebar = ({
  isOpen,
  onClose,
  user,
  activeTab,
  setActiveTab,
}: SharedSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-y-0 left-0 w-72 bg-white border-r border-gray-200 shadow-xl p-6 flex flex-col text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Menu</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center space-x-4 mb-8">
            <img
              src={
                user.account.profile ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop"
              }
              alt={user.account.username}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-lg">
                {user.account.name || user.account.username}
              </h3>
              <p className="text-sm text-gray-500">@{user.account.username}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-7 h-7 text-gray-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Guest User</h3>
              <p className="text-sm text-gray-500">Not logged in</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-[#2ECC71] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Support</span>
          </button>
          {user && (
            <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 mt-2">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedSidebar;
