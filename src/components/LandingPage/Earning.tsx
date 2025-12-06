"use client";

import React, { useState, useEffect, useRef } from "react";
import SharedSidebar from "./SharedSidebar";
import {
  DollarSign,
  Bitcoin,
  Gem,
  Droplets,
  TrendingUp,
  Gift,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Percent,
  Award,
  Shield,
  Play,
  Pause,
  Sparkles,
  Coins,
  BarChart3,
  Crown,
  Diamond,
  Activity,
  CheckCircle,
  Star,
  Target,
  Wallet,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Package,
  Car,
  Truck,
  ShoppingBag,
  Smartphone,
  Briefcase,
  Building,
  Plane,
  Plus,
  Minus,
  Search,
  Moon,
  Sun,
} from "lucide-react";

interface InvestmentCard {
  id: number;
  title: string;
  subtitle: string;
  type: "mining" | "gold" | "oil" | "crypto" | "mystery";
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  price: string;
  change: string;
  dailyEarnings: string;
  duration: string;
  minInvestment: string;
  profit: string;
  roi: string;
  image: string;
}

const EarningsDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("mining");
  const [investmentAmounts, setInvestmentAmounts] = useState<{
    [key: number]: string;
  }>({});
  const [currentUser, setCurrentUser] = useState<{ account: any } | null>(null);

  const userProfile = {
    name: "Alex Morgan",
    level: "VIP 3",
  };

  // Navigation Items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "mining",
      label: "Crypto Mining",
      icon: <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "gold",
      label: "Gold Bars",
      icon: <Gem className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "oil",
      label: "Oil Barrels",
      icon: <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "crypto",
      label: "Crypto Assets",
      icon: <Coins className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "mystery",
      label: "Mystery Box",
      icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "referrals",
      label: "Referrals",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <Crown className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "support",
      label: "Support",
      icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  // Investment Cards Data
  const investmentCards: { [key: string]: InvestmentCard[] } = {
    mining: [
      {
        id: 1,
        title: "Bitcoin Mining",
        subtitle: "High-performance ASIC mining",
        type: "mining",
        icon: <Bitcoin className="w-8 h-8" />,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-500/10",
        price: "$43,120",
        change: "+2.4%",
        dailyEarnings: "0.5-2.5%",
        duration: "30-365 Days",
        minInvestment: "$100",
        profit: "Up to 182%",
        roi: "12-25%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 2,
        title: "Ethereum Staking",
        subtitle: "Ethereum 2.0 validator nodes",
        type: "mining",
        icon: <Activity className="w-8 h-8" />,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-500/10",
        price: "$2,235",
        change: "-0.7%",
        dailyEarnings: "0.8-3.2%",
        duration: "30-180 Days",
        minInvestment: "$50",
        profit: "Up to 144%",
        roi: "15-30%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 3,
        title: "Solana Mining",
        subtitle: "High-speed blockchain mining",
        type: "mining",
        icon: <Zap className="w-8 h-8" />,
        iconColor: "text-pink-500",
        iconBg: "bg-pink-500/10",
        price: "$102.30",
        change: "+3.9%",
        dailyEarnings: "1.2-4.5%",
        duration: "15-90 Days",
        minInvestment: "$25",
        profit: "Up to 108%",
        roi: "18-35%",
        image: "/api/placeholder/600/300",
      },
    ],
    gold: [
      {
        id: 4,
        title: "24K Gold Bar",
        subtitle: "99.99% pure gold investment",
        type: "gold",
        icon: <Gem className="w-8 h-8" />,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-500/10",
        price: "$1,980",
        change: "+1.2%",
        dailyEarnings: "0.3-1.2%",
        duration: "180 Days",
        minInvestment: "$2,000",
        profit: "8-15%",
        roi: "12-25%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 5,
        title: "Gold Bullion",
        subtitle: "Swiss minted bullion",
        type: "gold",
        icon: <Award className="w-8 h-8" />,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-500/10",
        price: "$6,500",
        change: "+0.8%",
        dailyEarnings: "0.4-1.5%",
        duration: "365 Days",
        minInvestment: "$20,000",
        profit: "12-20%",
        roi: "18-35%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 6,
        title: "Digital Gold",
        subtitle: "Tokenized gold investment",
        type: "gold",
        icon: <Coins className="w-8 h-8" />,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        price: "$500",
        change: "+2.1%",
        dailyEarnings: "0.6-2.0%",
        duration: "90 Days",
        minInvestment: "$500",
        profit: "6-12%",
        roi: "10-20%",
        image: "/api/placeholder/600/300",
      },
    ],
    oil: [
      {
        id: 7,
        title: "Brent Crude Oil",
        subtitle: "Premium light sweet crude",
        type: "oil",
        icon: <Droplets className="w-8 h-8" />,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        price: "$85.40",
        change: "+3.2%",
        dailyEarnings: "0.5-2.0%",
        duration: "120 Days",
        minInvestment: "$5,000",
        profit: "15-25%",
        roi: "22-40%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 8,
        title: "WTI Oil Barrel",
        subtitle: "West Texas Intermediate",
        type: "oil",
        icon: <Zap className="w-8 h-8" />,
        iconColor: "text-cyan-500",
        iconBg: "bg-cyan-500/10",
        price: "$82.10",
        change: "+2.8%",
        dailyEarnings: "0.6-2.5%",
        duration: "180 Days",
        minInvestment: "$10,000",
        profit: "18-30%",
        roi: "25-45%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 9,
        title: "OPEC Crude",
        subtitle: "Middle East crude blend",
        type: "oil",
        icon: <Building className="w-8 h-8" />,
        iconColor: "text-green-500",
        iconBg: "bg-green-500/10",
        price: "$88.50",
        change: "+4.1%",
        dailyEarnings: "0.7-3.0%",
        duration: "240 Days",
        minInvestment: "$25,000",
        profit: "20-35%",
        roi: "30-50%",
        image: "/api/placeholder/600/300",
      },
    ],
    crypto: [
      {
        id: 10,
        title: "Bitcoin Investment",
        subtitle: "Direct BTC holding",
        type: "crypto",
        icon: <Bitcoin className="w-8 h-8" />,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-500/10",
        price: "$43,120",
        change: "+2.4%",
        dailyEarnings: "0.5-1.2%",
        duration: "30-90 Days",
        minInvestment: "$100",
        profit: "Up to 108%",
        roi: "15-25%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 11,
        title: "Ethereum Investment",
        subtitle: "ETH direct investment",
        type: "crypto",
        icon: <Activity className="w-8 h-8" />,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-500/10",
        price: "$2,235",
        change: "-0.7%",
        dailyEarnings: "0.8-2.0%",
        duration: "30-180 Days",
        minInvestment: "$50",
        profit: "Up to 144%",
        roi: "18-30%",
        image: "/api/placeholder/600/300",
      },
      {
        id: 12,
        title: "Solana Investment",
        subtitle: "SOL growth investment",
        type: "crypto",
        icon: <Zap className="w-8 h-8" />,
        iconColor: "text-pink-500",
        iconBg: "bg-pink-500/10",
        price: "$102.30",
        change: "+3.9%",
        dailyEarnings: "1.2-3.5%",
        duration: "15-60 Days",
        minInvestment: "$25",
        profit: "Up to 105%",
        roi: "20-35%",
        image: "/api/placeholder/600/300",
      },
    ],
    mystery: [
      {
        id: 13,
        title: "Luxury Car Mystery",
        subtitle: "Chance to win luxury vehicles",
        type: "mystery",
        icon: <Car className="w-8 h-8" />,
        iconColor: "text-red-500",
        iconBg: "bg-red-500/10",
        price: "Variable",
        change: "High Risk",
        dailyEarnings: "Varies",
        duration: "Instant",
        minInvestment: "$500",
        profit: "500-5000%",
        roi: "High Risk",
        image: "/api/placeholder/600/300",
      },
      {
        id: 14,
        title: "Shipping Container",
        subtitle: "Container of valuable goods",
        type: "mystery",
        icon: <Truck className="w-8 h-8" />,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        price: "$250,000",
        change: "Medium Risk",
        dailyEarnings: "Varies",
        duration: "Instant",
        minInvestment: "$1,000",
        profit: "1000-10000%",
        roi: "High Risk",
        image: "/api/placeholder/600/300",
      },
      {
        id: 15,
        title: "Gold Treasure",
        subtitle: "Mystery gold package",
        type: "mystery",
        icon: <Gem className="w-8 h-8" />,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-500/10",
        price: "$100,000",
        change: "Low Risk",
        dailyEarnings: "Varies",
        duration: "Instant",
        minInvestment: "$200",
        profit: "200-2000%",
        roi: "Medium Risk",
        image: "/api/placeholder/600/300",
      },
    ],
  };

  // Get current investment cards
  const currentCards = investmentCards[activeTab] || [];

  // Handle investment
  const handleInvest = (cardId: number) => {
    const amount = investmentAmounts[cardId];
    const card = currentCards.find((c) => c.id === cardId);

    if (!amount) {
      alert("Please enter an investment amount");
      return;
    }

    if (card) {
      alert(
        `Invested $${amount} in ${card.title}! Daily earnings: ${card.dailyEarnings}`
      );
    }
  };

  // Handle investment amount change
  const handleAmountChange = (cardId: number, value: string) => {
    setInvestmentAmounts((prev) => ({
      ...prev,
      [cardId]: value,
    }));
  };

  // Stats Data
  const stats = [
    {
      label: "Total Earnings",
      value: "$245,680",
      change: "+12.4%",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Active Investments",
      value: "18",
      change: "+3",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: "Total ROI",
      value: "24.8%",
      change: "+2.1%",
      icon: <Percent className="w-5 h-5" />,
    },
    {
      label: "Referral Earnings",
      value: "$12,450",
      change: "+8.2%",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  // Get category title
  const getCategoryTitle = (type: string) => {
    switch (type) {
      case "mining":
        return "Crypto Mining Investments";
      case "gold":
        return "Gold Bars Investment";
      case "oil":
        return "Oil Barrels Investment";
      case "crypto":
        return "Crypto Assets Investment";
      case "mystery":
        return "Mystery Box Investments";
      default:
        return "Investments";
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.account) {
          setCurrentUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isMobileMenuOpen
              ? "bg-[#013220]"
              : "bg-gradient-to-br from-[#0A5C36] to-[#2ECC71]"
          }`}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Prestige<span className="text-[#2ECC71]">Wealth</span>
            </span>
          </div>
        </div>

        <button className="relative">
          <div className="w-2 h-2 rounded-full bg-[#2ECC71] absolute -top-0.5 -right-0.5"></div>
          <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
        </button>
      </header>

      <div className="flex pt-16 lg:pt-0">
        <SharedSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 w-full">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Earnings Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Multiple investment opportunities with guaranteed returns
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-600" />
                  )}
                </button>
                <button className="relative">
                  <div className="w-2 h-2 rounded-full bg-[#2ECC71] absolute -top-0.5 -right-0.5"></div>
                  <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-[#2ECC71]">
                      {stat.icon}
                    </div>
                    <span className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-[#2ECC71] px-2 py-1 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Investment Type Tabs */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {Object.keys(investmentCards).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === type
                        ? "bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#2ECC71]"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Cards List */}
            {currentCards.length > 0 && (
              <div className="mb-8">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {getCategoryTitle(activeTab)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentCards.length} investment options available
                  </p>
                </div>

                {/* Investment Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-16 h-16 rounded-xl ${card.iconBg} flex items-center justify-center`}
                          >
                            <div className={card.iconColor}>{card.icon}</div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {card.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {card.subtitle}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-base font-bold text-gray-900 dark:text-white">
                                {card.price}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  card.change.includes("+") ||
                                  card.change === "Low Risk"
                                    ? "bg-green-100 dark:bg-green-900/30 text-[#2ECC71]"
                                    : card.change.includes("-") ||
                                      card.change === "High Risk"
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                                }`}
                              >
                                {card.change}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investment Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <DollarSign className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Daily Earnings
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {card.dailyEarnings}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Duration
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {card.duration}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="w-3 h-3 text-purple-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Total Profit
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {card.profit}
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Percent className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              ROI
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {card.roi}
                          </p>
                        </div>
                      </div>

                      {/* Investment Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                            Investment Amount (Min: {card.minInvestment})
                          </label>
                          <input
                            type="number"
                            value={investmentAmounts[card.id] || ""}
                            onChange={(e) =>
                              handleAmountChange(card.id, e.target.value)
                            }
                            placeholder={`Enter amount starting from ${card.minInvestment}`}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#2ECC71]"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleInvest(card.id)}
                            className="flex-1 py-2 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 text-sm"
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>Invest Now</span>
                          </button>
                          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-[#2ECC71] hover:text-[#2ECC71] text-sm">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Investment Categories Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                All Investment Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(investmentCards).map(([type, cards]) => (
                  <div
                    key={type}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${cards[0].iconBg} flex items-center justify-center`}
                      >
                        <div className={cards[0].iconColor}>
                          {React.cloneElement(
                            cards[0].icon as React.ReactElement,
                            { className: "w-5 h-5" }
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {cards.length} options
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab(type)}
                      className="w-full py-2 text-sm bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      View Investments
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media & Disclaimer */}
            <div className="space-y-6">
              {/* Social Media */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-500" />
                  Platform Videos & Social Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      platform: "TikTok",
                      icon: "🎵",
                      color: "from-pink-500 to-red-500",
                      handle: "@PrestigeWealth",
                    },
                    {
                      platform: "Instagram",
                      icon: "📸",
                      color: "from-purple-600 to-pink-600",
                      handle: "@Prestige_Wealth",
                    },
                    {
                      platform: "YouTube",
                      icon: "▶️",
                      color: "from-red-600 to-red-700",
                      handle: "/PrestigeWealth",
                    },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className={`p-4 bg-gradient-to-r ${social.color} rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg">
                              {social.icon}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {social.platform}
                            </p>
                            <p className="text-white/80 text-sm">
                              {social.handle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Investment Disclaimer
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      All investments carry risk. Past performance is not
                      indicative of future results. Please invest only what you
                      can afford to lose. Cryptocurrency investments are
                      particularly volatile. Gold and oil investments are
                      subject to market conditions. Always conduct your own
                      research before investing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EarningsDashboard;
