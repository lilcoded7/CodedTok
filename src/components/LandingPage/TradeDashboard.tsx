"use client";
import SharedSidebar from "./SharedSidebar";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Bitcoin,
  CreditCard,
  DollarSign,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Minus,
  Moon,
  Plus,
  Settings,
  Sun,
  TrendingUp,
  User,
  X,
  Bell,
  ChevronDown,
  Search,
  TrendingDown,
  Zap,
  Shield,
  LineChart,
  Activity,
  BarChart,
  PieChart,
  Gift,
} from "lucide-react";

// Types
interface Trade {
  id: number;
  asset: string;
  entryPrice: number;
  currentPrice: number;
  profitLoss: number;
  status: "profitable" | "neutral" | "losing";
  side: "long" | "short";
  size: number;
  leverage: number;
}

interface SummaryCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: "positive" | "negative";
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isBullish: boolean;
}

const TradeDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [chartInterval, setChartInterval] = useState("60");
  const [activeChartPair, setActiveChartPair] = useState("BTCUSDT");
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [showChartTools, setShowChartTools] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Initialize component (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Trading pairs
  const tradingPairs = [
    {
      symbol: "BTCUSDT",
      name: "Bitcoin",
      icon: "₿",
      price: 43120.5,
      change: 2.4,
    },
    {
      symbol: "ETHUSDT",
      name: "Ethereum",
      icon: "Ξ",
      price: 2235.25,
      change: -0.7,
    },
    { symbol: "SOLUSDT", name: "Solana", icon: "◎", price: 102.3, change: 3.9 },
    { symbol: "XRPUSDT", name: "Ripple", icon: "X", price: 0.59, change: -4.8 },
    { symbol: "ADAUSDT", name: "Cardano", icon: "A", price: 0.51, change: 6.3 },
  ];

  // Chart intervals mapping
  const chartIntervals = [
    { value: "1", label: "1 Minute" },
    { value: "5", label: "5 Minutes" },
    { value: "15", label: "15 Minutes" },
    { value: "60", label: "1 Hour" },
    { value: "120", label: "2 Hours" },
    { value: "180", label: "3 Hours" },
    { value: "240", label: "4 Hours" },
    { value: "D", label: "1 Day" },
    { value: "W", label: "1 Week" },
    { value: "M", label: "1 Month" },
  ];

  // Summary Cards Data
  const summaryCards: SummaryCard[] = [
    {
      title: "Account Balance",
      value: "$245,680.50",
      icon: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />,
      change: "+2.4%",
      changeType: "positive",
    },
    {
      title: "Total Investments",
      value: "$180,250.00",
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      change: "+5.1%",
      changeType: "positive",
    },
    {
      title: "Active Positions",
      value: "8",
      icon: <LineChart className="w-5 h-5 sm:w-6 sm:h-6" />,
      change: "+2",
      changeType: "positive",
    },
    {
      title: "24h Volume",
      value: "$4.2M",
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      change: "+18.3%",
      changeType: "positive",
    },
    {
      title: "Risk Score",
      value: "Low",
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      change: "-2.1%",
      changeType: "negative",
    },
  ];

  // Trade Data
  const trades: Trade[] = [
    {
      id: 1,
      asset: "BTC/USDT",
      entryPrice: 42850,
      currentPrice: 43120,
      profitLoss: 2.1,
      status: "profitable",
      side: "long",
      size: 0.05,
      leverage: 5,
    },
    {
      id: 2,
      asset: "ETH/USDT",
      entryPrice: 2250,
      currentPrice: 2235,
      profitLoss: -0.7,
      status: "neutral",
      side: "short",
      size: 1.2,
      leverage: 3,
    },
    {
      id: 3,
      asset: "SOL/USDT",
      entryPrice: 98.5,
      currentPrice: 102.3,
      profitLoss: 3.9,
      status: "profitable",
      side: "long",
      size: 25,
      leverage: 10,
    },
    {
      id: 4,
      asset: "XRP/USDT",
      entryPrice: 0.62,
      currentPrice: 0.59,
      profitLoss: -4.8,
      status: "losing",
      side: "long",
      size: 1000,
      leverage: 5,
    },
    {
      id: 5,
      asset: "ADA/USDT",
      entryPrice: 0.48,
      currentPrice: 0.51,
      profitLoss: 6.3,
      status: "profitable",
      side: "short",
      size: 5000,
      leverage: 3,
    },
  ];

  // Navigation Items - UPDATED to include Deposit, Withdrawal, Promo
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "trading",
      label: "Trading",
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "futures",
      label: "Futures",
      icon: <LineChart className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "deposit",
      label: "Deposit",
      icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "withdrawal",
      label: "Withdrawal",
      icon: <Minus className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "promo",
      label: "Promo",
      icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "earn",
      label: "Earn",
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
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

  const userProfile = {
    name: "Alex Morgan",
    level: "VIP 3",
  };

  // Initialize TradingView Widget with proper configuration
  useEffect(() => {
    if (!isMounted) return;

    setChartLoading(true);

    const loadTradingView = () => {
      // Check if TradingView widget script is already loaded
      const existingScript = document.querySelector(
        'script[src*="tradingview.com"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Clear container
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = "";
      }

      // Create widget container
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "tradingview-widget-container";
      widgetContainer.style.width = "100%";
      widgetContainer.style.height = "100%";
      widgetContainer.innerHTML = `
        <div class="tradingview-widget-container__widget" style="height:100%; width:100%"></div>
      `;

      if (chartContainerRef.current) {
        chartContainerRef.current.appendChild(widgetContainer);
      }

      // Create script element
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.async = true;

      // Configuration for TradingView widget
      const widgetConfig = {
        autosize: true,
        symbol: `BINANCE:${activeChartPair}`,
        interval: chartInterval,
        timezone: "Etc/UTC",
        theme: darkMode ? "dark" : "light",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_side_toolbar: false,
        save_image: false,
        details: true,
        container_id: "tradingview_widget",
      };

      script.text = JSON.stringify(widgetConfig);

      // Append script to widget container
      widgetContainer.appendChild(script);

      // Set loading to false
      setTimeout(() => setChartLoading(false), 1500);
    };

    // Load with delay to prevent conflicts
    const timer = setTimeout(loadTradingView, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup function
      const existingWidget = document.querySelector(
        ".tradingview-widget-container"
      );
      if (existingWidget) {
        existingWidget.remove();
      }
    };
  }, [activeChartPair, chartInterval, darkMode, isMounted]);

  // Generate stable candlestick data (no random values)
  useEffect(() => {
    if (!isMounted) return;

    const generateCandlestickData = () => {
      const basePrice =
        activeChartPair === "BTCUSDT"
          ? 43120
          : activeChartPair === "ETHUSDT"
          ? 2235
          : activeChartPair === "SOLUSDT"
          ? 102
          : 0.5;

      const data: CandleData[] = [];
      let currentPrice = basePrice;

      // Use deterministic algorithm based on symbol and interval
      const seed = activeChartPair.charCodeAt(0) + chartInterval.charCodeAt(0);

      for (let i = 0; i < 20; i++) {
        // Deterministic "random" using seed
        const pseudoRandom = Math.sin(seed + i * 0.1) * 10000;
        const normalized = pseudoRandom - Math.floor(pseudoRandom);

        const change = (normalized - 0.5) * basePrice * 0.02;
        currentPrice += change;

        const open = currentPrice - change;
        const close = currentPrice;
        const high = Math.max(open, close) + Math.abs(change) * 0.5;
        const low = Math.min(open, close) - Math.abs(change) * 0.5;
        const isBullish = close > open;

        data.push({
          time: `${i * 2}:00`,
          open,
          high,
          low,
          close,
          volume: 1000 + Math.abs(change) * 100,
          isBullish,
        });
      }

      setCandleData(data);
    };

    generateCandlestickData();
  }, [activeChartPair, chartInterval, isMounted]);

  // Handle fullscreen toggle
  useEffect(() => {
    if (!isMounted) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsChartFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMounted]);

  // Render fallback chart when TradingView fails
  const renderFallbackChart = () => {
    if (!isMounted || candleData.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center animate-pulse">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Loading chart data...
            </p>
          </div>
        </div>
      );
    }

    const maxPrice = Math.max(...candleData.map((d) => d.high));
    const minPrice = Math.min(...candleData.map((d) => d.low));
    const range = maxPrice - minPrice;
    const padding = 40;

    return (
      <div className="relative w-full h-full">
        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border-t border-r border-gray-200 dark:border-gray-700"
            />
          ))}
        </div>

        {/* Candlesticks */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
          {candleData.slice(0, 15).map((candle, index) => {
            const x = padding + index * 48;
            const yHigh = padding + ((maxPrice - candle.high) / range) * 320;
            const yLow = padding + ((maxPrice - candle.low) / range) * 320;
            const yOpen = padding + ((maxPrice - candle.open) / range) * 320;
            const yClose = padding + ((maxPrice - candle.close) / range) * 320;
            const candleWidth = 24;

            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke={candle.isBullish ? "#2ECC71" : "#E74C3C"}
                  strokeWidth="1.5"
                />

                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={Math.min(yOpen, yClose)}
                  width={candleWidth}
                  height={Math.max(2, Math.abs(yClose - yOpen))}
                  fill={candle.isBullish ? "#2ECC71" : "#E74C3C"}
                />
              </g>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-4">
          <span>${maxPrice.toFixed(2)}</span>
          <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
          <span>${minPrice.toFixed(2)}</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-gray-400 px-4 pb-2">
          <span>9:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>18:00</span>
        </div>

        {/* Chart status */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/80 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Live Market Data</span>
          </div>
        </div>
      </div>
    );
  };

  // If not mounted yet, show loading skeleton
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"
              ></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
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

      <div className="flex">
        <SharedSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navItems={navItems}
          userProfile={userProfile}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showThemeToggleAndLogout={true}
        />

        {/* Main Content */}
        <main className="flex-1 w-full pt-16 lg:pt-0">
          <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Advanced Trading Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Real-time charts & professional trading tools
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

          <div className="p-3 sm:p-4 md:p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {summaryCards.map((card, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-[#2ECC71]/30 cursor-pointer transition-all"
                >
                  <div className="absolute top-3 right-3 text-[#2ECC71]">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                      {card.title}
                    </p>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {card.value}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        card.changeType === "positive"
                          ? "bg-green-50 dark:bg-green-900/30 text-[#2ECC71]"
                          : "bg-red-50 dark:bg-red-900/30 text-red-500"
                      }`}
                    >
                      {card.changeType === "positive" ? "↗" : "↘"} {card.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Trading Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Trading Pairs */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Markets
                  </h3>
                </div>
                <div className="space-y-2">
                  {tradingPairs.map((pair) => (
                    <button
                      key={pair.symbol}
                      onClick={() => setActiveChartPair(pair.symbol)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        activeChartPair === pair.symbol
                          ? "bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 border border-[#2ECC71]/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                          <span className="text-white font-bold">
                            {pair.icon}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {pair.symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {pair.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ${pair.price.toLocaleString()}
                        </div>
                        <div
                          className={`text-xs ${
                            pair.change >= 0 ? "text-[#2ECC71]" : "text-red-500"
                          }`}
                        >
                          {pair.change >= 0 ? "+" : ""}
                          {pair.change}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Area */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      {tradingPairs.find(
                        (p) => p.symbol === activeChartPair
                      ) && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                          <span className="text-white font-bold">
                            {
                              tradingPairs.find(
                                (p) => p.symbol === activeChartPair
                              )?.icon
                            }
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {activeChartPair}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {
                            tradingPairs.find(
                              (p) => p.symbol === activeChartPair
                            )?.name
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        $
                        {tradingPairs
                          .find((p) => p.symbol === activeChartPair)
                          ?.price.toLocaleString()}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          (tradingPairs.find(
                            (p) => p.symbol === activeChartPair
                          )?.change || 0) >= 0
                            ? "text-[#2ECC71]"
                            : "text-red-500"
                        }`}
                      >
                        {(tradingPairs.find((p) => p.symbol === activeChartPair)
                          ?.change || 0) >= 0
                          ? "+"
                          : ""}
                        {
                          tradingPairs.find((p) => p.symbol === activeChartPair)
                            ?.change
                        }
                        % (24h)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={chartInterval}
                      onChange={(e) => setChartInterval(e.target.value)}
                      className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                    >
                      {chartIntervals.map((interval) => (
                        <option key={interval.value} value={interval.value}>
                          {interval.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setIsChartFullscreen(true)}
                      className="px-3 py-2 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] hover:opacity-90 text-white rounded-lg text-sm"
                    >
                      Fullscreen
                    </button>
                  </div>
                </div>

                {/* Chart Container */}
                <div
                  ref={chartContainerRef}
                  className="h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative"
                >
                  {chartLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center animate-pulse">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading TradingView chart...
                        </p>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                          Advanced charting powered by TradingView
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      {renderFallbackChart()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Trade & Positions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {/* Quick Trade Panel */}
              <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Quick Trade
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                      Amount (USDT)
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-3 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#2ECC71]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 rounded-lg bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white text-sm font-semibold hover:opacity-90">
                      Buy/Long
                    </button>
                    <button className="py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:border-red-500 hover:text-red-500">
                      Sell/Short
                    </button>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Est. Profit
                      </span>
                      <span className="text-base font-bold text-[#2ECC71]">
                        +$240.50
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Risk: Medium</span>
                      <span>Margin: $1,250</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Positions */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Active Positions
                  </h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white rounded-lg text-sm">
                    + New Position
                  </button>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-3">
                  {trades.map((trade) => (
                    <div
                      key={trade.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              trade.side === "long"
                                ? "bg-gradient-to-br from-[#0A5C36] to-[#2ECC71]"
                                : "bg-gradient-to-br from-red-600 to-orange-500"
                            }`}
                          >
                            <Bitcoin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white block">
                              {trade.asset}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                trade.side === "long"
                                  ? "text-[#2ECC71]"
                                  : "text-red-500"
                              }`}
                            >
                              {trade.side === "long" ? "Long" : "Short"}{" "}
                              {trade.leverage}x
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-bold ${
                            trade.profitLoss >= 0
                              ? "text-[#2ECC71]"
                              : "text-red-500"
                          }`}
                        >
                          {trade.profitLoss >= 0 ? "+" : ""}
                          {trade.profitLoss}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            Entry
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            ${trade.entryPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            Current
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            ${trade.currentPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#2ECC71] hover:text-[#2ECC71]">
                          Close
                        </button>
                        <button className="flex-1 py-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300">
                          TP/SL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          Asset
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          Side
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          Size
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          Entry
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          Current
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          P&L
                        </th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 text-xs">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade) => (
                        <tr
                          key={trade.id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  trade.side === "long"
                                    ? "bg-gradient-to-br from-[#0A5C36] to-[#2ECC71]"
                                    : "bg-gradient-to-br from-red-600 to-orange-500"
                                }`}
                              >
                                <Bitcoin className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {trade.asset}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                trade.side === "long"
                                  ? "bg-green-50 dark:bg-green-900/30 text-[#2ECC71]"
                                  : "bg-red-50 dark:bg-red-900/30 text-red-500"
                              }`}
                            >
                              {trade.side === "long" ? "Long" : "Short"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">
                              {trade.size}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">
                              ${trade.entryPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900 dark:text-white">
                              ${trade.currentPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-bold ${
                                trade.profitLoss >= 0
                                  ? "text-[#2ECC71]"
                                  : "text-red-500"
                              }`}
                            >
                              {trade.profitLoss >= 0 ? "+" : ""}
                              {trade.profitLoss}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#2ECC71] hover:text-[#2ECC71]">
                                Close
                              </button>
                              <button className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
                                TP/SL
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TradeDashboard;
