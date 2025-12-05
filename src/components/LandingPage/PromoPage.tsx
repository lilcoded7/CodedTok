'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Home, Settings, HelpCircle, LogOut,
  Menu, X, Bell, Users, TrendingUp,
  DollarSign, Target, Globe, Calendar,
  Video, Image, FileText, MapPin,
  ChevronDown, ChevronUp, Filter,
  Share2, Eye, EyeOff, BarChart,
  CreditCard, Clock, CheckCircle,
  AlertCircle, Upload, Trash2,
  Play, Pause, Maximize2, Volume2,
  MessageSquare, Heart, Send,
  Facebook, Instagram, Youtube,
  Twitter, Linkedin, TikTok,
  Plus, Minus, Search, ArrowRight,
  Sparkles, Crown, Award, Zap,
  Users as UsersIcon, Target as TargetIcon,
  Globe as GlobeIcon, CreditCard as CreditCardIcon,
  BarChart as BarChartIcon, Sliders, User,
  ExternalLink, Download, ShoppingBag,
  Mail, Phone, ThumbsUp, Star,
  ChevronLeft, ChevronRight, Grid,
  LayoutGrid, Columns, Rows, Maximize,
  MoreHorizontal, Bookmark, Eye as EyeIcon,
  Link, Globe as Globe2
} from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
  population: number;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface CTAButton {
  id: string;
  label: string;
  text: string;
  color: string;
  icon: React.ReactNode;
}

const PromoPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [step, setStep] = useState(1);
  
  // Campaign Content
  const [campaignName, setCampaignName] = useState('');
  const [promoTitle, setPromoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedFile | null>(null);
  const [selectedCTA, setSelectedCTA] = useState<string>(''); // Empty = no CTA
  const [ctaUrl, setCtaUrl] = useState('');
  const [showCTAForm, setShowCTAForm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string>(''); // ID of selected media
  
  // Audience Targeting
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'UK', 'CA']);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(45);
  const [isDraggingMinAge, setIsDraggingMinAge] = useState(false);
  const [isDraggingMaxAge, setIsDraggingMaxAge] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Crypto & Blockchain', 'Technology', 'Investment']);
  
  // Pricing & Budget
  const [promoPrice, setPromoPrice] = useState(100);
  const [isDraggingPrice, setIsDraggingPrice] = useState(false);
  const [estimatedAudience, setEstimatedAudience] = useState({ min: 1000, max: 3000 });
  
  // Schedule
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const priceSliderRef = useRef<HTMLDivElement>(null);
  const ageSliderRef = useRef<HTMLDivElement>(null);

  // CTA Buttons
  const ctaButtons: CTAButton[] = [
    { 
      id: 'none', 
      label: 'No Button', 
      text: '', 
      color: 'from-gray-500 to-gray-700',
      icon: <X className="w-4 h-4" />
    },
    { 
      id: 'subscribe', 
      label: 'Subscribe', 
      text: 'Subscribe Now', 
      color: 'from-[#0A5C36] to-[#2ECC71]',
      icon: <Mail className="w-4 h-4" />
    },
    { 
      id: 'apply', 
      label: 'Apply Now', 
      text: 'Apply Now', 
      color: 'from-blue-500 to-blue-700',
      icon: <FileText className="w-4 h-4" />
    },
    { 
      id: 'learn', 
      label: 'Learn More', 
      text: 'Learn More', 
      color: 'from-purple-500 to-purple-700',
      icon: <ExternalLink className="w-4 h-4" />
    },
    { 
      id: 'buy', 
      label: 'Buy Now', 
      text: 'Buy Now', 
      color: 'from-orange-500 to-orange-700',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    { 
      id: 'contact', 
      label: 'Contact Us', 
      text: 'Contact Us', 
      color: 'from-pink-500 to-pink-700',
      icon: <Phone className="w-4 h-4" />
    },
    { 
      id: 'download', 
      label: 'Download', 
      text: 'Download', 
      color: 'from-indigo-500 to-indigo-700',
      icon: <Download className="w-4 h-4" />
    },
    { 
      id: 'website', 
      label: 'Visit Website', 
      text: 'Visit Website', 
      color: 'from-teal-500 to-teal-700',
      icon: <Globe2 className="w-4 h-4" />
    }
  ];

  // Countries with population data
  const countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸', population: 331000000 },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', population: 67000000 },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', population: 38000000 },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', population: 25600000 },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', population: 83000000 },
    { code: 'FR', name: 'France', flag: '🇫🇷', population: 67000000 },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', population: 125000000 },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', population: 5700000 },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', population: 9900000 },
    { code: 'IN', name: 'India', flag: '🇮🇳', population: 1400000000 },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', population: 213000000 },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', population: 126000000 },
  ];

  // Interests
  const interests = [
    'Crypto & Blockchain', 'Stock Trading', 'Real Estate', 'Gold Investment',
    'Oil & Energy', 'Technology', 'E-commerce', 'Luxury Goods',
    'Travel', 'Health & Wellness', 'Fitness', 'Education',
    'Entertainment', 'Gaming', 'Fashion', 'Finance'
  ];

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'create', label: 'Create Campaign', icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'campaigns', label: 'My Campaigns', icon: <BarChart className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'audience', label: 'Audience', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'budget', label: 'Budget & Billing', icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'support', label: 'Support', icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  // Handle CTA selection
  const handleCTASelection = (ctaId: string) => {
    setSelectedCTA(ctaId);
    if (ctaId === 'none') {
      setShowCTAForm(false);
      setCtaUrl('');
    } else {
      setShowCTAForm(true);
      // Set default URL based on CTA type
      if (ctaUrl === '') {
        if (ctaId === 'website') setCtaUrl('https://prestigewealth.com');
        else if (ctaId === 'contact') setCtaUrl('https://prestigewealth.com/contact');
        else if (ctaId === 'subscribe') setCtaUrl('https://prestigewealth.com/subscribe');
        else setCtaUrl('https://prestigewealth.com');
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: UploadedFile[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/') && uploadedImages.length < 10) {
          const id = Math.random().toString(36).substr(2, 9);
          const preview = URL.createObjectURL(file);
          newImages.push({ id, file, preview, type: 'image' });
        }
      });
      setUploadedImages(prev => [...prev, ...newImages]);
      if (newImages.length > 0 && !selectedMedia) {
        setSelectedMedia(newImages[0].id);
      }
    }
  };

  // Handle video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo.preview);
      }
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      const newVideo = { id, file, preview, type: 'video' };
      setUploadedVideo(newVideo);
      setSelectedMedia(newVideo.id);
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) URL.revokeObjectURL(image.preview);
      const newImages = prev.filter(img => img.id !== id);
      if (selectedMedia === id && newImages.length > 0) {
        setSelectedMedia(newImages[0].id);
      } else if (selectedMedia === id && uploadedVideo) {
        setSelectedMedia(uploadedVideo.id);
      } else if (selectedMedia === id) {
        setSelectedMedia('');
      }
      return newImages;
    });
  };

  // Remove video
  const removeVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo.preview);
      setUploadedVideo(null);
      if (selectedMedia === uploadedVideo.id && uploadedImages.length > 0) {
        setSelectedMedia(uploadedImages[0].id);
      } else {
        setSelectedMedia('');
      }
    }
  };

  // Calculate audience based on price and targeting
  const calculateAudience = useCallback(() => {
    let baseMin = 1000;
    let baseMax = 3000;
    
    // Price multiplier: higher price = more audience
    const priceMultiplier = promoPrice / 100; // $100 = 1x multiplier
    
    // Country multiplier based on selected countries' population
    let countryMultiplier = 0;
    selectedCountries.forEach(code => {
      const country = countries.find(c => c.code === code);
      if (country) {
        countryMultiplier += country.population / 100000000; // Scale down
      }
    });
    
    // Age range multiplier
    const ageRange = maxAge - minAge;
    const ageMultiplier = ageRange / 30; // 30 years = 1x multiplier
    
    // Calculate final audience
    const min = Math.round(baseMin * priceMultiplier * (1 + countryMultiplier * 0.3) * (1 + ageMultiplier * 0.2));
    const max = Math.round(baseMax * priceMultiplier * (1 + countryMultiplier * 0.5) * (1 + ageMultiplier * 0.3));
    
    setEstimatedAudience({ min, max });
  }, [promoPrice, selectedCountries, minAge, maxAge]);

  // Update audience when dependencies change
  useEffect(() => {
    calculateAudience();
  }, [calculateAudience]);

  // Handle price slider
  const handlePriceSliderMouseDown = () => {
    setIsDraggingPrice(true);
  };

  // Handle age slider thumb down
  const handleAgeThumbMouseDown = (type: 'min' | 'max') => {
    if (type === 'min') setIsDraggingMinAge(true);
    else setIsDraggingMaxAge(true);
    
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  // Handle mouse move for sliders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingPrice && !isDraggingMinAge && !isDraggingMaxAge) return;
      
      if (isDraggingPrice && priceSliderRef.current) {
        const slider = priceSliderRef.current;
        const rect = slider.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const percentage = x / rect.width;
        const price = Math.max(10, Math.min(1000, Math.round(10 + percentage * 990)));
        setPromoPrice(price);
      }
      
      if ((isDraggingMinAge || isDraggingMaxAge) && ageSliderRef.current) {
        const slider = ageSliderRef.current;
        const rect = slider.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const percentage = x / rect.width;
        const age = Math.round(13 + percentage * (65 - 13));
        
        if (isDraggingMinAge) {
          const newMinAge = Math.min(age, maxAge - 1);
          setMinAge(Math.max(13, newMinAge));
        } else if (isDraggingMaxAge) {
          const newMaxAge = Math.max(age, minAge + 1);
          setMaxAge(Math.min(65, newMaxAge));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingPrice(false);
      setIsDraggingMinAge(false);
      setIsDraggingMaxAge(false);
      
      // Restore cursor and selection
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDraggingPrice, isDraggingMinAge, isDraggingMaxAge, minAge, maxAge]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (uploadedImages.length === 0 && !uploadedVideo) {
      alert('Please upload at least one image or video');
      return;
    }

    if (!campaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    const campaignData = {
      campaignName,
      promoTitle,
      description,
      imagesCount: uploadedImages.length,
      hasVideo: !!uploadedVideo,
      ctaButton: selectedCTA,
      ctaUrl: selectedCTA && selectedCTA !== 'none' ? ctaUrl : null,
      countries: selectedCountries,
      ageRange: { min: minAge, max: maxAge },
      interests: selectedInterests,
      promoPrice,
      estimatedAudience,
      schedule: scheduleDate && scheduleTime ? `${scheduleDate} ${scheduleTime}` : 'Immediate',
    };

    alert(`🎉 Campaign Published Successfully!\n\n• Campaign: ${campaignName}\n• Budget: $${promoPrice}\n• Estimated Reach: ${formatNumber(estimatedAudience.min)} - ${formatNumber(estimatedAudience.max)} people\n• Target Countries: ${selectedCountries.length}\n• Age Range: ${minAge}-${maxAge}`);
    
    // Reset form
    setStep(1);
    setUploadedImages([]);
    setUploadedVideo(null);
    setDescription('');
    setPromoTitle('');
    setCampaignName('');
    setSelectedMedia('');
    setSelectedCTA('');
    setCtaUrl('');
    setShowCTAForm(false);
    setSelectedCountries(['US', 'UK', 'CA']);
    setMinAge(18);
    setMaxAge(45);
    setSelectedInterests(['Crypto & Blockchain', 'Technology', 'Investment']);
    setPromoPrice(100);
  };

  // Get selected media object
  const getSelectedMedia = () => {
    if (!selectedMedia) return null;
    
    if (uploadedVideo && selectedMedia === uploadedVideo.id) {
      return uploadedVideo;
    }
    
    return uploadedImages.find(img => img.id === selectedMedia) || null;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${isMobileMenuOpen 
            ? 'bg-[#013220]' 
            : 'bg-gradient-to-br from-[#0A5C36] to-[#2ECC71]'
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
              Prestige<span className="text-[#2ECC71]">Promo</span>
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
                    Prestige<span className="text-[#2ECC71]">Promo</span>
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
                      <Users className="w-6 h-6 text-[#2ECC71]" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alex Morgan</h3>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white text-xs font-medium">
                    Premium
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
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg ${activeTab === item.id
                    ? 'bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 border-l-3 border-[#2ECC71]'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`${activeTab === item.id ? 'text-[#2ECC71]' : 'text-gray-600 dark:text-gray-300'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm font-medium ${activeTab === item.id 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      <div className="flex pt-16 lg:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Prestige<span className="text-[#2ECC71]">Promo</span>
              </span>
            </div>
          </div>
          
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-[#2ECC71]/30 bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <Users className="w-7 h-7 text-[#2ECC71]" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Alex Morgan</h3>
                <span className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white text-xs font-medium mt-1">
                  Premium
                </span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                  ? 'bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 border-l-3 border-[#2ECC71]'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className={`${activeTab === item.id ? 'text-[#2ECC71]' : 'text-gray-600 dark:text-gray-300'}`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-medium ${activeTab === item.id 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Campaign Budget Summary */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Campaign Budget</span>
                <DollarSign className="w-4 h-4 text-[#2ECC71]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">$5,000</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Available for promotions</p>
              <button className="w-full mt-3 py-2 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white rounded-lg text-sm font-medium hover:opacity-90">
                Add Funds
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Campaign</h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Professional promotions with precise audience targeting</p>
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
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber
                      ? 'bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {stepNumber}
                    </div>
                    <span className="text-xs mt-2 text-gray-600 dark:text-gray-300">
                      {stepNumber === 1 && 'Content'}
                      {stepNumber === 2 && 'Audience'}
                      {stepNumber === 3 && 'Budget'}
                      {stepNumber === 4 && 'Review'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                  {/* Step 1: Content */}
                  {step === 1 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Content</h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Upload media and create your campaign post</p>
                        </div>
                        <Video className="w-6 h-6 text-[#2ECC71]" />
                      </div>

                      {/* Campaign Name */}
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Campaign Name
                        </label>
                        <input
                          type="text"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          placeholder="Enter campaign name (internal use)"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#2ECC71]"
                        />
                      </div>

                      {/* Media Upload */}
                      <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                          Upload Media
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div 
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#2ECC71] transition-colors cursor-pointer"
                            onClick={() => imageInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={imageInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              multiple
                              className="hidden"
                            />
                            <Image className="w-8 h-8 text-[#2ECC71] mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900 dark:text-white">Upload Images</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Multiple images supported</p>
                            <p className="text-xs text-gray-500 mt-1">{uploadedImages.length} images uploaded</p>
                          </div>
                          
                          <div 
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-[#2ECC71] transition-colors cursor-pointer"
                            onClick={() => videoInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              ref={videoInputRef}
                              onChange={handleVideoUpload}
                              accept="video/*"
                              className="hidden"
                            />
                            <Video className="w-8 h-8 text-[#2ECC71] mx-auto mb-3" />
                            <h3 className="font-medium text-gray-900 dark:text-white">Upload Video</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Optional video content</p>
                            <p className="text-xs text-gray-500 mt-1">{uploadedVideo ? '1 video uploaded' : 'No video'}</p>
                          </div>
                        </div>

                        {/* Uploaded Media Preview */}
                        {(uploadedImages.length > 0 || uploadedVideo) && (
                          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">Uploaded Media</h4>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {uploadedImages.length} images • {uploadedVideo ? '1 video' : '0 videos'}
                              </div>
                            </div>
                            
                            {/* Media Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {uploadedVideo && (
                                <div className="relative">
                                  <div className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedMedia === uploadedVideo.id ? 'border-[#2ECC71]' : 'border-transparent'}`}>
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                      <Video className="w-6 h-6 text-gray-400" />
                                    </div>
                                  </div>
                                  <button
                                    onClick={removeVideo}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                                    Video
                                  </div>
                                </div>
                              )}
                              
                              {uploadedImages.map((image) => (
                                <div key={image.id} className="relative">
                                  <div 
                                    className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedMedia === image.id ? 'border-[#2ECC71]' : 'border-transparent'}`}
                                    onClick={() => setSelectedMedia(image.id)}
                                  >
                                    <img
                                      src={image.preview}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    onClick={() => removeImage(image.id)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Post Title
                          </label>
                          <input
                            type="text"
                            value={promoTitle}
                            onChange={(e) => setPromoTitle(e.target.value)}
                            placeholder="Enter catchy title for your post"
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#2ECC71]"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Post Description
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write your post description here... Use emojis and hashtags for better engagement"
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#2ECC71]"
                          />
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {description.length}/2200 characters
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {description.split(/\s+/).filter(word => word).length} words
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button Selection - Optional */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-gray-700 dark:text-gray-300 font-medium">
                            Call-to-Action Button (Optional)
                          </label>
                          <span className="text-xs text-gray-500">Leave empty if no button needed</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {ctaButtons.map((cta) => (
                            <button
                              key={cta.id}
                              onClick={() => handleCTASelection(cta.id)}
                              className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-lg border ${selectedCTA === cta.id
                                ? `bg-gradient-to-r ${cta.color} text-white border-transparent`
                                : 'border-gray-300 dark:border-gray-600 hover:border-[#2ECC71]'
                              }`}
                            >
                              {cta.icon}
                              <span className="font-medium text-sm">{cta.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* CTA URL Form - Only show if CTA is selected and not 'none' */}
                        {showCTAForm && selectedCTA && selectedCTA !== 'none' && (
                          <div className="mt-4 p-4 border border-[#2ECC71]/30 rounded-lg bg-gradient-to-r from-[#0A5C36]/5 to-[#2ECC71]/5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Set Destination URL
                              </h4>
                              <Link className="w-5 h-5 text-[#2ECC71]" />
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  Where should users be redirected?
                                </label>
                                <input
                                  type="url"
                                  value={ctaUrl}
                                  onChange={(e) => setCtaUrl(e.target.value)}
                                  placeholder="https://example.com/your-landing-page"
                                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#2ECC71]"
                                />
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Users will be redirected to this URL when they click the "{ctaButtons.find(b => b.id === selectedCTA)?.label}" button
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Audience */}
                  {step === 2 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Target Audience</h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Select who sees your campaign</p>
                        </div>
                        <Target className="w-6 h-6 text-[#2ECC71]" />
                      </div>

                      {/* Countries Selection */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Select Countries</h3>
                          <Globe className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              onClick={() => {
                                setSelectedCountries(prev =>
                                  prev.includes(country.code)
                                    ? prev.filter(code => code !== country.code)
                                    : [...prev, country.code]
                                );
                              }}
                              className={`flex items-center space-x-2 px-3 py-3 rounded-lg border ${selectedCountries.includes(country.code)
                                ? 'bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 border-[#2ECC71]'
                                : 'border-gray-300 dark:border-gray-600 hover:border-[#2ECC71]'
                              }`}
                            >
                              <span className="text-xl">{country.flag}</span>
                              <div className="text-left">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{country.name}</div>
                                <div className="text-xs text-gray-500">{formatNumber(country.population)}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Age Range Slider - Draggable */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Age Range</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Drag the handles to select target age group</p>
                          </div>
                          <div className="text-xl font-bold text-[#2ECC71]">{minAge} - {maxAge} years</div>
                        </div>
                        
                        {/* Age Slider - Draggable */}
                        <div ref={ageSliderRef} className="relative pt-8">
                          {/* Slider Track */}
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                            {/* Selected Range */}
                            <div 
                              className="absolute h-2 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] rounded-full"
                              style={{ 
                                left: `${((minAge - 13) / (65 - 13)) * 100}%`,
                                width: `${((maxAge - minAge) / (65 - 13)) * 100}%`
                              }}
                            />
                            
                            {/* Min Age Thumb - Draggable */}
                            <div 
                              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-800 border-2 border-[#2ECC71] rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10"
                              style={{ left: `${((minAge - 13) / (65 - 13)) * 100}%` }}
                              onMouseDown={() => handleAgeThumbMouseDown('min')}
                              onTouchStart={() => handleAgeThumbMouseDown('min')}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2ECC71] text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                                {minAge}
                              </div>
                            </div>
                            
                            {/* Max Age Thumb - Draggable */}
                            <div 
                              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-800 border-2 border-[#2ECC71] rounded-full shadow-lg cursor-grab active:cursor-grabbing z-10"
                              style={{ left: `${((maxAge - 13) / (65 - 13)) * 100}%` }}
                              onMouseDown={() => handleAgeThumbMouseDown('max')}
                              onTouchStart={() => handleAgeThumbMouseDown('max')}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2ECC71] text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                                {maxAge}
                              </div>
                            </div>
                          </div>
                          
                          {/* Age Markers */}
                          <div className="flex justify-between mt-10 text-sm text-gray-600 dark:text-gray-400">
                            <span>13</span>
                            <span>25</span>
                            <span>35</span>
                            <span>45</span>
                            <span>55</span>
                            <span>65+</span>
                          </div>
                        </div>

                        {/* Quick Age Buttons */}
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Age Ranges:</h4>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'Teens', min: 13, max: 17 },
                              { label: 'Young Adults', min: 18, max: 24 },
                              { label: 'Adults', min: 25, max: 34 },
                              { label: 'Middle Age', min: 35, max: 44 },
                              { label: 'Older Adults', min: 45, max: 54 },
                              { label: 'Seniors', min: 55, max: 65 }
                            ].map((range) => (
                              <button
                                key={range.label}
                                onClick={() => {
                                  setMinAge(range.min);
                                  setMaxAge(range.max);
                                }}
                                className={`px-3 py-2 rounded-lg ${minAge === range.min && maxAge === range.max
                                  ? 'bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                {range.label} ({range.min}-{range.max})
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Interests */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Target Interests</h3>
                          <Filter className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest) => (
                            <button
                              key={interest}
                              onClick={() => {
                                setSelectedInterests(prev =>
                                  prev.includes(interest)
                                    ? prev.filter(item => item !== interest)
                                    : [...prev, interest]
                                );
                              }}
                              className={`px-3 py-2 rounded-lg border text-sm ${selectedInterests.includes(interest)
                                ? 'bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white border-transparent'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#2ECC71]'
                              }`}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Budget */}
                  {step === 3 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Budget</h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Set your budget and see estimated reach</p>
                        </div>
                        <DollarSign className="w-6 h-6 text-[#2ECC71]" />
                      </div>

                      {/* Budget Slider */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Campaign Budget</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Drag to set your budget (Minimum: $10)</p>
                          </div>
                          <div className="text-2xl lg:text-3xl font-bold text-[#2ECC71]">${promoPrice}</div>
                        </div>
                        
                        {/* Price Slider */}
                        <div className="relative">
                          <div 
                            ref={priceSliderRef}
                            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                            onMouseDown={handlePriceSliderMouseDown}
                          >
                            <div 
                              className="absolute h-3 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] rounded-full"
                              style={{ width: `${((promoPrice - 10) / (1000 - 10)) * 100}%` }}
                            />
                            
                            {/* Price Thumb - Draggable */}
                            <div 
                              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 border-3 border-[#2ECC71] rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                              style={{ left: `${((promoPrice - 10) / (1000 - 10)) * 100}%` }}
                              onMouseDown={handlePriceSliderMouseDown}
                            >
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#2ECC71] text-white font-bold px-2 py-1 rounded whitespace-nowrap">
                                ${promoPrice}
                              </div>
                            </div>
                          </div>
                          
                          {/* Price Markers */}
                          <div className="flex justify-between mt-12 text-sm text-gray-600 dark:text-gray-400">
                            <span>$10</span>
                            <span>$250</span>
                            <span>$500</span>
                            <span>$750</span>
                            <span>$1000</span>
                          </div>
                        </div>

                        {/* Audience Estimation */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-[#0A5C36]/10 to-[#2ECC71]/10 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">Estimated Reach</span>
                            <Users className="w-5 h-5 text-[#2ECC71]" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                              {formatNumber(estimatedAudience.min)} - {formatNumber(estimatedAudience.max)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              people will see your campaign
                            </p>
                          </div>
                        </div>

                        {/* Quick Budget Buttons */}
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Budget:</h4>
                          <div className="flex flex-wrap gap-2">
                            {[10, 50, 100, 250, 500, 1000].map((price) => (
                              <button
                                key={price}
                                onClick={() => setPromoPrice(price)}
                                className={`px-3 py-2 rounded-lg ${promoPrice === price
                                  ? 'bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                ${price}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Schedule (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Start Date</label>
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#2ECC71]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Start Time</label>
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#2ECC71]"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Leave empty to start campaign immediately after approval
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review & Publish</h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Review your campaign before publishing</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-[#2ECC71]" />
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Campaign</span>
                            <button onClick={() => setStep(1)} className="text-[#2ECC71] text-sm hover:underline">
                              Edit
                            </button>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">{campaignName || 'Untitled'}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Budget & Reach</span>
                            <button onClick={() => setStep(3)} className="text-[#2ECC71] text-sm hover:underline">
                              Edit
                            </button>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${promoPrice} → {formatNumber(estimatedAudience.min)}-{formatNumber(estimatedAudience.max)} people
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Audience</span>
                            <button onClick={() => setStep(2)} className="text-[#2ECC71] text-sm hover:underline">
                              Edit
                            </button>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedCountries.length} countries • Age {minAge}-{maxAge}
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">CTA Button</span>
                            <button onClick={() => setStep(1)} className="text-[#2ECC71] text-sm hover:underline">
                              Edit
                            </button>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedCTA && selectedCTA !== 'none' ? ctaButtons.find(b => b.id === selectedCTA)?.label : 'No CTA Button'}
                          </p>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="terms"
                            className="mt-1"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                            I confirm that my campaign complies with all platform policies and local regulations. I understand that approval may take up to 24 hours.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    {step > 1 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="px-4 sm:px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base"
                      >
                        Back
                      </button>
                    )}
                    {step < 4 ? (
                      <button
                        onClick={() => setStep(step + 1)}
                        className="ml-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white rounded-lg font-medium hover:opacity-90 flex items-center space-x-2 text-sm sm:text-base"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="ml-auto px-4 sm:px-8 py-3 bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] text-white rounded-lg font-medium hover:opacity-90 flex items-center space-x-2 text-sm sm:text-base"
                      >
                        <span>Publish Campaign</span>
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column - Campaign Preview */}
                <div className="space-y-6">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Campaign Post Preview</h3>
                    <EyeIcon className="w-6 h-6 text-[#2ECC71]" />
                  </div>

                  {/* Campaign Post Preview */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">PrestigeWealth Campaign</div>
                            <div className="text-sm text-gray-500">Sponsored • Just now</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Media Display */}
                    <div className="relative">
                      {selectedMedia ? (
                        getSelectedMedia()?.type === 'video' ? (
                          <div className="aspect-video bg-black">
                            <video
                              src={getSelectedMedia()?.preview}
                              className="w-full h-full object-contain"
                              controls
                              autoPlay
                            />
                            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                              <Video className="w-4 h-4 inline mr-1" /> Video
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-100 dark:bg-gray-900">
                            <img
                              src={getSelectedMedia()?.preview}
                              alt="Selected media"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )
                      ) : (
                        <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <div className="text-center">
                            <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">No media selected</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Media Thumbnails Grid */}
                    {(uploadedImages.length > 0 || uploadedVideo) && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Select Media ({uploadedImages.length + (uploadedVideo ? 1 : 0)} items)
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {/* Video Thumbnail */}
                          {uploadedVideo && (
                            <button
                              onClick={() => setSelectedMedia(uploadedVideo.id)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedMedia === uploadedVideo.id ? 'border-[#2ECC71]' : 'border-gray-300 dark:border-gray-700'}`}
                            >
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                                <Video className="w-6 h-6 text-gray-500" />
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                  Video
                                </div>
                              </div>
                            </button>
                          )}
                          
                          {/* Image Thumbnails */}
                          {uploadedImages.map((image) => (
                            <button
                              key={image.id}
                              onClick={() => setSelectedMedia(image.id)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedMedia === image.id ? 'border-[#2ECC71]' : 'border-gray-300 dark:border-gray-700'}`}
                            >
                              <img
                                src={image.preview}
                                alt="Thumbnail"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="p-4">
                      {/* Campaign Title */}
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {promoTitle || 'Your Campaign Title'}
                        </h3>
                        
                        {/* Description */}
                        {description && (
                          <p className="mt-2 text-gray-700 dark:text-gray-300">
                            {description.length > 150 ? `${description.substring(0, 150)}...` : description}
                          </p>
                        )}
                      </div>

                      {/* Hashtags */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="text-blue-500 dark:text-blue-400 text-sm">#investment</span>
                          <span className="text-blue-500 dark:text-blue-400 text-sm">#wealth</span>
                          <span className="text-blue-500 dark:text-blue-400 text-sm">#success</span>
                          <span className="text-blue-500 dark:text-blue-400 text-sm">#finance</span>
                        </div>
                      </div>

                      {/* CTA Button - Only show if selected and not 'none' */}
                      {selectedCTA && selectedCTA !== 'none' && (
                        <div className="mb-4">
                          <button className={`w-full py-3 rounded-lg bg-gradient-to-r ${ctaButtons.find(b => b.id === selectedCTA)?.color} text-white font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity`}>
                            {ctaButtons.find(b => b.id === selectedCTA)?.icon}
                            <span>{ctaButtons.find(b => b.id === selectedCTA)?.text}</span>
                          </button>
                          {ctaUrl && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                              Redirects to: {ctaUrl.replace('https://', '').substring(0, 30)}...
                            </p>
                          )}
                        </div>
                      )}

                      {/* Campaign Info */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Budget: ${promoPrice}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Reach: {formatNumber(estimatedAudience.min)}-{formatNumber(estimatedAudience.max)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] rounded-xl lg:rounded-2xl p-6 text-white">
                    <h3 className="font-bold mb-4">Campaign Performance</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm opacity-90">Estimated Reach</span>
                          <span className="font-bold text-lg">
                            {formatNumber(estimatedAudience.min)} - {formatNumber(estimatedAudience.max)}
                          </span>
                        </div>
                        <div className="text-xs opacity-80">Based on ${promoPrice} budget</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="text-xs opacity-90">Countries</div>
                          <div className="font-bold text-lg">{selectedCountries.length}</div>
                        </div>
                        
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="text-xs opacity-90">Age Range</div>
                          <div className="font-bold text-lg">{minAge}-{maxAge}</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/20">
                        <div className="flex justify-between items-center">
                          <span className="text-sm opacity-90">Cost per 1,000 views</span>
                          <span className="font-bold">${((promoPrice / estimatedAudience.max) * 1000).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <CheckCircle className="w-4 h-4" />
                        <span>Real-time analytics included</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <CheckCircle className="w-4 h-4" />
                        <span>Optimized delivery across platforms</span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">💡 Campaign Tips</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <DollarSign className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Budget Tip:</span> ${promoPrice} will reach approximately {formatNumber(estimatedAudience.min)} to {formatNumber(estimatedAudience.max)} targeted users.
                        </p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Audience Tip:</span> Age {minAge}-{maxAge} in {selectedCountries.length} countries ensures precise targeting.
                        </p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Image className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Media Tip:</span> Click on thumbnails to preview different media items.
                        </p>
                      </div>
                    </div>
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

// Add missing icon components
const Sun = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Moon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export default PromoPage;