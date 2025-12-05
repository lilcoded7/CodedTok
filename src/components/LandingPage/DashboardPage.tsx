'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, DollarSign, Target, Users,
  BarChart, Wallet, ChevronRight, Clock,
  CheckCircle, AlertCircle, Eye, EyeOff,
  MoreVertical, Filter, Download, Search,
  Calendar, ArrowUpRight, ArrowDownRight,
  Plus, TrendingDown, TrendingUp as TrendingUpIcon,
  Shield, Zap, Award, Crown, Building,
  Bitcoin, Droplets, Car, Package,
  MessageSquare, Star, TrendingUp as TrendingUpIcon2,
  Activity, CreditCard, Settings, Home,
  PieChart, LineChart, Calendar as CalendarIcon,
  Bell, User, ChevronDown, ExternalLink,
  FileText, ShoppingBag, History, RefreshCw,
  Menu, X, ChevronLeft
} from 'lucide-react';

// Types
interface Investment {
  id: number;
  name: string;
  type: 'crypto' | 'gold' | 'oil' | 'realEstate' | 'luxury' | 'stocks';
  amount: number;
  currentValue: number;
  roi: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
  duration: string;
}

interface Campaign {
  id: number;
  title: string;
  category: string;
  views: number;
  revenue: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

interface Trade {
  id: number;
  asset: string;
  type: 'buy' | 'sell';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  profitLoss: number;
  status: 'open' | 'closed';
  openedAt: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showSidebar, setShowSidebar] = useState(false);

  // User stats
  const userStats = {
    currentBalance: 12458.50,
    totalInvestments: 24500.00,
    totalCampaigns: 8,
    activeTrades: 12,
    monthlyEarnings: 2850.75,
    totalEarnings: 15800.25
  };

  // Active Investments
  const investments: Investment[] = [
    {
      id: 1,
      name: 'Bitcoin Mining Pool',
      type: 'crypto',
      amount: 5000,
      currentValue: 6250,
      roi: 25,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      duration: '6 months'
    },
    {
      id: 2,
      name: 'Gold Bullion Reserve',
      type: 'gold',
      amount: 8000,
      currentValue: 9200,
      roi: 15,
      status: 'active',
      startDate: '2024-02-10',
      endDate: '2024-08-10',
      duration: '6 months'
    },
    {
      id: 3,
      name: 'Oil Futures Contract',
      type: 'oil',
      amount: 10000,
      currentValue: 11800,
      roi: 18,
      status: 'active',
      startDate: '2024-03-05',
      endDate: '2024-09-05',
      duration: '6 months'
    },
    {
      id: 4,
      name: 'Luxury Real Estate',
      type: 'realEstate',
      amount: 1500,
      currentValue: 1725,
      roi: 15,
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2025-01-20',
      duration: '12 months'
    }
  ];

  // Campaigns
  const campaigns: Campaign[] = [
    {
      id: 1,
      title: 'Crypto Mining Guide 2024',
      category: 'crypto',
      views: 245800,
      revenue: 1250.50,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Gold Investment Secrets',
      category: 'gold',
      views: 189500,
      revenue: 980.75,
      status: 'active',
      createdAt: '2024-02-10'
    },
    {
      id: 3,
      title: 'Oil Trading Strategies',
      category: 'oil',
      views: 312450,
      revenue: 2150.25,
      status: 'paused',
      createdAt: '2024-03-05'
    },
    {
      id: 4,
      title: 'Real Estate Masterclass',
      category: 'realEstate',
      revenue: 1567.80,
      views: 156780,
      status: 'completed',
      createdAt: '2024-01-20'
    }
  ];

  // Open Trades
  const trades: Trade[] = [
    {
      id: 1,
      asset: 'BTC/USDT',
      type: 'buy',
      amount: 0.5,
      entryPrice: 42000,
      currentPrice: 45200,
      profitLoss: 1600,
      status: 'open',
      openedAt: '2024-04-10'
    },
    {
      id: 2,
      asset: 'ETH/USDT',
      type: 'buy',
      amount: 3.2,
      entryPrice: 2800,
      currentPrice: 3150,
      profitLoss: 1120,
      status: 'open',
      openedAt: '2024-04-08'
    },
    {
      id: 3,
      asset: 'XAU/USD',
      type: 'buy',
      amount: 50,
      entryPrice: 2050,
      currentPrice: 2180,
      profitLoss: 6500,
      status: 'open',
      openedAt: '2024-04-05'
    },
    {
      id: 4,
      asset: 'CL/F',
      type: 'sell',
      amount: 100,
      entryPrice: 82.5,
      currentPrice: 79.8,
      profitLoss: 270,
      status: 'open',
      openedAt: '2024-04-03'
    }
  ];

  // Investment type icons
  const investmentIcons = {
    crypto: <Bitcoin className="w-6 h-6" />,
    gold: <Award className="w-6 h-6" />,
    oil: <Droplets className="w-6 h-6" />,
    realEstate: <Building className="w-6 h-6" />,
    luxury: <Crown className="w-6 h-6" />,
    stocks: <TrendingUpIcon2 className="w-6 h-6" />
  };

  // Investment type colors - Updated for white theme
  const investmentColors = {
    crypto: 'text-orange-500 bg-orange-50',
    gold: 'text-yellow-600 bg-yellow-50',
    oil: 'text-blue-500 bg-blue-50',
    realEstate: 'text-purple-500 bg-purple-50',
    luxury: 'text-pink-500 bg-pink-50',
    stocks: 'text-green-600 bg-green-50'
  };

  // Status colors - Updated for white theme
  const statusColors = {
    active: 'text-green-600 bg-green-50',
    completed: 'text-blue-600 bg-blue-50',
    pending: 'text-yellow-600 bg-yellow-50',
    paused: 'text-gray-500 bg-gray-100'
  };

  // Trade type colors - Updated for white theme
  const tradeTypeColors = {
    buy: 'text-green-600 bg-green-50',
    sell: 'text-red-500 bg-red-50'
  };

  // Calculate total values
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInitialInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProfit = totalInvestmentValue - totalInitialInvestment;
  const totalProfitPercentage = totalInitialInvestment > 0 ? (totalProfit / totalInitialInvestment) * 100 : 0;

  const totalTradesProfit = trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  const totalCampaignRevenue = campaigns.reduce((sum, camp) => sum + camp.revenue, 0);

  // Sidebar menu items
  const sidebarMenuItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'investments', label: 'Investments', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Target className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'help', label: 'Help & Support', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center hover:opacity-90 shadow-sm"
              >
                <Home className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Alex!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">AM</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
                    <p className="text-xs text-gray-500">Premium Investor</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for Mobile */}
      {showSidebar && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowSidebar(false)}
          />
          <div className="fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl md:hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    Wealth<span className="text-[#2ECC71]">Tok</span>
                  </span>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-[#2ECC71]/30 bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <User className="w-6 h-6 text-[#2ECC71]" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Alex Morgan</h3>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white text-xs font-medium">
                    Premium Investor
                  </span>
                  <div className="mt-1 text-xs text-gray-500">
                    Balance: <span className="text-[#2ECC71] font-semibold">$12,458.50</span>
                  </div>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1 h-[calc(100vh-200px)] overflow-y-auto">
              {sidebarMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setShowSidebar(false);
                    // In a real app, you would navigate to the page
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="text-[#2ECC71]">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-red-500 hover:text-red-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back to Home</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}

      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Today
              </button>
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Week
              </button>
              <button className="px-3 py-1.5 text-sm bg-[#2ECC71] text-white rounded-lg hover:bg-[#27ae60]">
                Month
              </button>
              <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Year
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Balance */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Wallet className="w-6 h-6 text-blue-500" />
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Current Balance</h3>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {showBalance ? `$${userStats.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '•••••••'}
                </span>
                <span className="text-green-600 text-sm flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2.4%
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">Total available funds</p>
            </div>

            {/* Total Investments */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-50">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-green-600 text-sm flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +15.8%
                </span>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Investments</h3>
              <div className="text-2xl font-bold text-gray-900">
                ${totalInvestmentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-gray-500 text-sm mt-2">
                ${totalInitialInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} invested
              </p>
            </div>

            {/* Total Earnings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-50">
                  <DollarSign className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="text-green-600 text-sm flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +24.7%
                </span>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Total Earnings</h3>
              <div className="text-2xl font-bold text-gray-900">
                ${(totalProfit + totalTradesProfit + totalCampaignRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-gray-500 text-sm mt-2">From investments, trades & campaigns</p>
            </div>

            {/* Active Trades */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-50">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-green-600 text-sm flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.2%
                </span>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">Active Trades</h3>
              <div className="text-2xl font-bold text-gray-900">{trades.length}</div>
              <p className="text-gray-500 text-sm mt-2">
                ${totalTradesProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} P&L
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Investments */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Investments</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white rounded-lg hover:opacity-90 flex items-center shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Investment
              </button>
            </div>

            <div className="space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${investmentColors[investment.type]}`}>
                        {investmentIcons[investment.type]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{investment.name}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-600">
                            Invested: ${investment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[investment.status]}`}>
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${investment.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-sm ${investment.roi >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {investment.roi >= 0 ? '+' : ''}{investment.roi}% ROI
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Started: {investment.startDate}
                      </span>
                      <span>Duration: {investment.duration}</span>
                    </div>
                    <button className="text-[#2ECC71] hover:text-[#0A5C36] text-sm flex items-center">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Investment Summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Total Investment Performance</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {investments.length} active investments
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${totalProfitPercentage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {totalProfitPercentage >= 0 ? '+' : ''}{totalProfitPercentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    ${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} profit
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-600">Campaigns</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userStats.totalCampaigns}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-green-50">
                      <TrendingUpIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-600">Monthly Earnings</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    ${userStats.monthlyEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Shield className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-gray-600">Risk Level</span>
                  </div>
                  <span className="font-semibold text-gray-900">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-yellow-50">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <span className="text-gray-600">Success Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">94.7%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Plus className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">Start New Campaign</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Download className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-700">Download Reports</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <RefreshCw className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-gray-700">Refresh Data</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Campaigns Table */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Campaigns</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Campaign</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Views</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Revenue</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{campaign.title}</div>
                        <div className="text-sm text-gray-500">{campaign.createdAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${investmentColors[campaign.category as keyof typeof investmentColors] || 'bg-gray-100 text-gray-500'}`}>
                          {campaign.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-gray-400" />
                          {campaign.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        ${campaign.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[campaign.status]}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>Showing {campaigns.length} of {campaigns.length} campaigns</span>
              <button className="text-[#2ECC71] hover:text-[#0A5C36] flex items-center">
                View All Campaigns
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Open Trades Table */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Open Trades</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Asset</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Current Price</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{trade.asset}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${tradeTypeColors[trade.type]}`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{trade.amount}</td>
                      <td className="py-3 px-4 text-gray-700">
                        ${trade.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`font-semibold ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          ${Math.abs(trade.profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-sm ml-1">
                            ({((trade.profitLoss / (trade.entryPrice * trade.amount)) * 100).toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Total Trades P&L</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {trades.length} open trades
                  </p>
                </div>
                <div className={`text-xl font-bold ${totalTradesProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {totalTradesProfit >= 0 ? '+' : '-'}${Math.abs(totalTradesProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Investment added', details: 'Bitcoin Mining Pool', amount: '+$5,000', time: '2 hours ago', type: 'investment' },
              { action: 'Trade executed', details: 'BTC/USDT Buy Order', amount: '+$1,600', time: '4 hours ago', type: 'trade' },
              { action: 'Campaign revenue', details: 'Crypto Mining Guide', amount: '+$245.50', time: '1 day ago', type: 'revenue' },
              { action: 'Withdrawal', details: 'To Bank Account', amount: '-$2,000', time: '2 days ago', type: 'withdrawal' },
              { action: 'Investment matured', details: 'Gold Bullion Reserve', amount: '+$1,200', time: '3 days ago', type: 'investment' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'investment' ? 'bg-blue-50 text-blue-500' :
                    activity.type === 'trade' ? 'bg-green-50 text-green-500' :
                    activity.type === 'revenue' ? 'bg-yellow-50 text-yellow-500' :
                    'bg-red-50 text-red-500'
                  }`}>
                    {activity.type === 'investment' ? <TrendingUp className="w-5 h-5" /> :
                     activity.type === 'trade' ? <Activity className="w-5 h-5" /> :
                     activity.type === 'revenue' ? <DollarSign className="w-5 h-5" /> :
                     <Download className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.action}</h4>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {activity.amount}
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center space-y-1 text-[#2ECC71]">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <BarChart className="w-6 h-6" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="relative -top-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] flex items-center justify-center shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <DollarSign className="w-6 h-6" />
            <span className="text-xs">Earnings</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardPage;