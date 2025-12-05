"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Home,
  Menu,
  X,
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Play,
  Video,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  User,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronDown, // Added this import
  Grid,
  BookOpen,
  Users,
  Target,
  Globe,
  Award,
  BarChart,
  Settings,
  LogOut,
  Camera,
  MapPin,
  Link,
  MoreHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../axios/axiosInsatance";

// ==================== TYPES ====================
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
}

interface CampaignGalleryItem {
  id: string;
  image: string | null;
  video: string | null;
}

interface CampaignStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  saves: number;
}

interface Campaign {
  id: string;
  account: CampaignAccount;
  image: string | null;
  video: string | null;
  name: string;
  post_name: string;
  post_description: string;
  budget: string;
  published_at: string;
  campaign_gallery: CampaignGalleryItem[];
  stats: CampaignStats;
}

interface CampaignFeedResponse {
  success: boolean;
  page: number;
  session_id: string;
  has_more: boolean;
  campaigns: Campaign[];
}

// ==================== MAIN COMPONENT ====================
const HomePage = () => {
  const router = useRouter();

  // ==================== STATE ====================
  const [darkMode, setDarkMode] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<{ [key: string]: number }>(
    {}
  );
  const [showProfile, setShowProfile] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<CampaignAccount | null>(null);

  // Data State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});

  // ==================== REFS ====================
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // ==================== API FUNCTIONS ====================
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get<CampaignFeedResponse>(
        "/api/v2/feed/for-you/"
      );
      setCampaigns(response.campaigns);

      // Auto play first video on load
      setTimeout(() => {
        if (response.campaigns[0]) {
          handleAutoPlay(response.campaigns[0].id);
        }
      }, 300);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== VIDEO HANDLING ====================
  const handleAutoPlay = (campaignId: string) => {
    const video = videoRefs.current[campaignId];
    if (video) {
      video
        .play()
        .then(() => {
          setIsPlaying((prev) => ({ ...prev, [campaignId]: true }));
        })
        .catch(console.log);
    }
  };

  const pauseAllVideos = (exceptCampaignId?: string) => {
    Object.keys(videoRefs.current).forEach((campaignId) => {
      if (campaignId !== exceptCampaignId) {
        const video = videoRefs.current[campaignId];
        if (video) {
          video.pause();
          setIsPlaying((prev) => ({ ...prev, [campaignId]: false }));
        }
      }
    });
  };

  const handleVideoClick = (campaign: Campaign) => {
    const video = videoRefs.current[campaign.id];
    if (!video) return;

    if (isPlaying[campaign.id]) {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [campaign.id]: false }));
    } else {
      pauseAllVideos(campaign.id);
      video
        .play()
        .then(() => {
          setIsPlaying((prev) => ({ ...prev, [campaign.id]: true }));
        })
        .catch(console.log);
    }
  };

  const handleGalleryItemClick = (campaignId: string, index: number) => {
    setGalleryIndex((prev) => ({ ...prev, [campaignId]: index }));
    pauseAllVideos();
  };

  // ==================== SWIPE HANDLING ====================
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (isSwiping) return;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const threshold = 50;

    // Horizontal swipe (right to left = show profile)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      setIsSwiping(true);

      if (diffX > 0) {
        // Swipe right to left - show profile
        const currentCampaign = campaigns[currentIndex];
        if (currentCampaign) {
          setSelectedAccount(currentCampaign.account);
          setShowProfile(true);
        }
      }

      setTimeout(() => setIsSwiping(false), 300);
    }

    // Vertical swipe (navigate between videos)
    else if (Math.abs(diffY) > threshold) {
      setIsSwiping(true);
      const container = containerRef.current;
      if (!container) return;

      const currentScroll = container.scrollTop;
      const videoHeight = window.innerHeight;
      const direction = diffY > 0 ? 1 : -1;
      const newIndex = currentIndex + direction;

      if (newIndex >= 0 && newIndex < campaigns.length) {
        container.scrollTo({
          top: currentScroll + videoHeight * direction,
          behavior: "smooth",
        });

        setCurrentIndex(newIndex);

        // Auto play new video
        const newCampaign = campaigns[newIndex];
        if (newCampaign) {
          pauseAllVideos(newCampaign.id);
          handleAutoPlay(newCampaign.id);
        }
      }

      setTimeout(() => setIsSwiping(false), 300);
    }
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container || isSwiping) return;

      const deltaY = e.deltaY;
      const currentScroll = container.scrollTop;
      const videoHeight = window.innerHeight;
      const direction = deltaY > 0 ? 1 : -1;
      const newIndex = currentIndex + direction;

      if (
        Math.abs(deltaY) > 40 &&
        newIndex >= 0 &&
        newIndex < campaigns.length
      ) {
        setIsSwiping(true);

        container.scrollTo({
          top: currentScroll + videoHeight * direction,
          behavior: "smooth",
        });

        setCurrentIndex(newIndex);

        // Auto play new video
        const newCampaign = campaigns[newIndex];
        if (newCampaign) {
          pauseAllVideos(newCampaign.id);
          handleAutoPlay(newCampaign.id);
        }

        setTimeout(() => setIsSwiping(false), 300);
      }
    },
    [currentIndex, campaigns, isSwiping]
  );

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // ==================== HELPER FUNCTIONS ====================
  const getDisplayMedia = (
    campaign: Campaign
  ): { url: string | null; type: "video" | "image" | "none" } => {
    const currentGalleryIndex = galleryIndex[campaign.id] || 0;

    // If user selected a gallery item
    if (
      campaign.campaign_gallery.length > 0 &&
      galleryIndex[campaign.id] !== undefined
    ) {
      const galleryItem = campaign.campaign_gallery[currentGalleryIndex];
      if (galleryItem.video) {
        return { url: galleryItem.video, type: "video" };
      }
      if (galleryItem.image) {
        return { url: galleryItem.image, type: "image" };
      }
    }

    // Default campaign video
    if (campaign.video) {
      return { url: campaign.video, type: "video" };
    }

    // Campaign image
    if (campaign.image) {
      return { url: campaign.image, type: "image" };
    }

    return { url: null, type: "none" };
  };

  const getCreatorInfo = (campaign: Campaign) => {
    return {
      name: campaign.account.name || campaign.account.username,
      avatar:
        campaign.account.profile ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
      username: campaign.account.username,
      verified: campaign.account.verified,
      bio: campaign.account.bio,
    };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // ==================== PROFILE COMPONENT ====================
  const ProfileView = ({
    account,
    onClose,
  }: {
    account: CampaignAccount;
    onClose: () => void;
  }) => {
    const [activeTab, setActiveTab] = useState("posts");

    // Mock data for profile
    const profileStats = {
      posts: campaigns.filter((c) => c.account.id === account.id).length,
      followers: Math.floor(Math.random() * 1000) + 100,
      following: Math.floor(Math.random() * 500) + 50,
    };

    const userCampaigns = campaigns.filter((c) => c.account.id === account.id);

    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Profile Header */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-lg border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold">{account.username}</h2>
              <p className="text-xs text-gray-400">@{account.username}</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-4 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={
                      account.profile ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop"
                    }
                    alt={account.username}
                    className="w-20 h-20 rounded-full border-2 border-[#2ECC71]"
                  />
                  <div>
                    <h1 className="text-2xl font-bold">
                      {account.name || account.username}
                    </h1>
                    {account.verified && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          Verified Account
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {account.bio && (
                  <p className="text-gray-300 mb-4">{account.bio}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  {account.country && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{account.country}</span>
                    </div>
                  )}
                  {account.is_business_account && (
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>Business</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {profileStats.posts}
                    </div>
                    <div className="text-sm text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatNumber(profileStats.followers)}
                    </div>
                    <div className="text-sm text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatNumber(profileStats.following)}
                    </div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button className="flex-1 bg-[#2ECC71] text-white py-2.5 rounded-lg font-medium hover:opacity-90">
                Follow
              </button>
              <button className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700">
                Message
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700">
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-4 text-center ${
                activeTab === "posts"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              <Grid className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">POSTS</span>
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={`flex-1 py-4 text-center ${
                activeTab === "reels"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              <Video className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">VIDEOS</span>
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`flex-1 py-4 text-center ${
                activeTab === "tagged"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              <BookOpen className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">TAGGED</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-1 p-1">
          {userCampaigns.map((campaign) => {
            const media = getDisplayMedia(campaign);
            return (
              <div
                key={campaign.id}
                className="aspect-square bg-gray-900 relative overflow-hidden group"
              >
                {media.url ? (
                  media.type === "video" ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={campaign.post_name}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">
                        {formatNumber(campaign.stats.likes)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">
                        {formatNumber(campaign.stats.comments)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {userCampaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
            <p className="text-gray-400 text-center max-w-xs">
              When {account.username} shares posts, they'll appear here.
            </p>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSearch(true)}
              className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            <span className="text-xl font-bold">
              Wealth<span className="text-[#2ECC71]">Tok</span>
            </span>

            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A5C36] to-[#2ECC71] flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main
        ref={containerRef}
        className="pt-16 h-screen overflow-y-auto snap-y snap-mandatory"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ECC71]"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
              <p className="text-gray-400">
                Try refreshing or check back later
              </p>
            </div>
          </div>
        ) : (
          campaigns.map((campaign, index) => {
            const creator = getCreatorInfo(campaign);
            const displayMedia = getDisplayMedia(campaign);
            const currentGalleryIndex = galleryIndex[campaign.id] || 0;
            const hasGallery = campaign.campaign_gallery.length > 0;

            return (
              <div
                key={campaign.id}
                className="h-screen w-full snap-start relative"
              >
                {/* Media Container */}
                <div className="relative w-full h-full bg-black">
                  {/* Video/Image Display */}
                  {displayMedia.url ? (
                    displayMedia.type === "video" ? (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[campaign.id] = el;
                        }}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        autoPlay
                        onClick={() => handleVideoClick(campaign)}
                      >
                        <source src={displayMedia.url} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={displayMedia.url}
                          alt={campaign.post_name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No media available</p>
                      </div>
                    </div>
                  )}

                  {/* Play/Pause Overlay */}
                  {displayMedia.type === "video" && !isPlaying[campaign.id] && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Gallery Items Bar */}
                  {hasGallery && (
                    <div className="absolute bottom-32 right-4 flex flex-col items-center space-y-6">
                      {campaign.campaign_gallery.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() =>
                            handleGalleryItemClick(campaign.id, idx)
                          }
                          className={`flex flex-col items-center ${
                            currentGalleryIndex === idx
                              ? "opacity-100"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center mb-1 overflow-hidden">
                            {item.video ? (
                              <div className="relative w-full h-full">
                                <Video className="w-6 h-6 text-white absolute inset-0 m-auto" />
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                  <Video className="w-3 h-3 inline" />
                                </div>
                              </div>
                            ) : item.image ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={item.image}
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                  <ImageIcon className="w-3 h-3 inline" />
                                </div>
                              </div>
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-white">#{idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Side Action Buttons */}
                  <div className="absolute bottom-32 right-4 flex flex-col items-center space-y-6">
                    {/* Profile Avatar - Click to open profile */}
                    <button
                      onClick={() => {
                        setSelectedAccount(campaign.account);
                        setShowProfile(true);
                      }}
                      className="flex flex-col items-center group"
                    >
                      <div className="relative">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-14 h-14 rounded-full border-2 border-white group-hover:border-[#2ECC71] transition-colors"
                        />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#2ECC71] flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </button>

                    {/* Like Button */}
                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-1">
                        <Heart className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs text-white">
                        {formatNumber(campaign.stats.likes)}
                      </span>
                    </button>

                    {/* Comment Button */}
                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-1">
                        <MessageCircle className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs text-white">
                        {formatNumber(campaign.stats.comments)}
                      </span>
                    </button>

                    {/* Save Button */}
                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-1">
                        <Bookmark className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs text-white">
                        {formatNumber(campaign.stats.saves)}
                      </span>
                    </button>

                    {/* Share Button */}
                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-1">
                        <Share2 className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs text-white">
                        {formatNumber(campaign.stats.shares)}
                      </span>
                    </button>
                  </div>

                  {/* Campaign Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-20 text-white">
                    {/* Creator Info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-bold text-lg">{creator.name}</span>
                      {creator.verified && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                      <button className="px-3 py-1 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100">
                        Follow
                      </button>
                    </div>

                    {/* Campaign Title */}
                    <h3 className="font-bold text-lg mb-2">
                      {campaign.post_name}
                    </h3>

                    {/* Description */}
                    {campaign.post_description && (
                      <p className="text-gray-200 mb-2 line-clamp-2">
                        {campaign.post_description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <span>{formatNumber(campaign.stats.views)} views</span>
                      <span>•</span>
                      <span>
                        ${parseFloat(campaign.budget).toLocaleString()} budget
                      </span>
                      <span>•</span>
                      <span className="text-[#2ECC71]">Sponsored</span>
                    </div>
                  </div>

                  {/* Volume Control */}
                  {displayMedia.type === "video" && (
                    <div className="absolute top-20 right-4">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Swipe Indicator */}
                  {index === 0 && campaigns.length > 1 && (
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
                      <div className="flex flex-col items-center">
                        <span className="text-white text-xs mb-1">
                          Swipe up
                        </span>
                        <ChevronDown className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Profile View */}
      {showProfile && selectedAccount && (
        <ProfileView
          account={selectedAccount}
          onClose={() => {
            setShowProfile(false);
            setSelectedAccount(null);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-gray-800">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center space-y-1 text-white">
            <Home className="w-6 h-6" />
            <span className="text-xs">For You</span>
          </button>

          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>

          <button className="relative -top-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0A5C36] to-[#2ECC71] flex items-center justify-center shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </button>

          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">Trending</span>
          </button>

          <button
            onClick={() => {
              const currentCampaign = campaigns[currentIndex];
              if (currentCampaign) {
                setSelectedAccount(currentCampaign.account);
                setShowProfile(true);
              }
            }}
            className="flex flex-col items-center space-y-1 text-gray-400"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      <style jsx>{`
        .snap-y {
          scroll-snap-type: y mandatory;
        }

        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
