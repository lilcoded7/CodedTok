"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
  ChevronDown,
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
  ChevronUp,
  Hash,
  Tag,
  Filter,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SharedSidebar from "./SharedSidebar";
import api from "../axios/axiosInsatance";

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
  is_liked: boolean;
  is_saved: boolean;
}

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    profile: string | null;
    verified: boolean;
  };
  text: string;
  likes: number;
  created_at: string;
  replies_count: number;
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
  tags: string[];
  comments_preview: Comment[];
}

interface CampaignFeedResponse {
  success: boolean;
  page: number;
  session_id: string;
  has_more: boolean;
  campaigns: Campaign[];
}

interface CampaignsByAccount {
  [accountId: string]: Campaign[];
}

const HomePage = () => {
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<{ [key: string]: number }>(
    {}
  );
  const [showProfile, setShowProfile] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<CampaignAccount | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsByAccount, setCampaignsByAccount] =
    useState<CampaignsByAccount>({});
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    account: CampaignAccount;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [likedCampaigns, setLikedCampaigns] = useState<Set<string>>(new Set());
  const [savedCampaigns, setSavedCampaigns] = useState<Set<string>>(new Set());
  const [viewingProfilePost, setViewingProfilePost] = useState(false);
  const [profilePostIndex, setProfilePostIndex] = useState(0);
  const [showHeartEffect, setShowHeartEffect] = useState<string | null>(null);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Gesture tracking refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const touchStartTime = useRef(0);
  const isTap = useRef(false);
  const isVerticalSwipe = useRef(false);
  
  // Double tap tracking refs
  const lastTapTime = useRef(0);
  const lastTapCampaignId = useRef<string | null>(null);
  const tapCount = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get<CampaignFeedResponse>(
        "/api/v2/feed/for-you/"
      );
      setCampaigns(response.campaigns);

      const byAccount: CampaignsByAccount = {};
      response.campaigns.forEach((campaign) => {
        const accountId = campaign.account.id;
        if (!byAccount[accountId]) {
          byAccount[accountId] = [];
        }
        byAccount[accountId].push(campaign);
      });
      setCampaignsByAccount(byAccount);

      const liked = new Set<string>();
      const saved = new Set<string>();
      response.campaigns.forEach((campaign) => {
        if (campaign.stats.is_liked) {
          liked.add(campaign.id);
        }
        if (campaign.stats.is_saved) {
          saved.add(campaign.id);
        }
      });
      setLikedCampaigns(liked);
      setSavedCampaigns(saved);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPlay = (campaignId: string) => {
    const video = videoRefs.current[campaignId];
    if (video) {
      video
        .play()
        .then(() => {
          setIsPlaying((prev) => ({ ...prev, [campaignId]: true }));
        })
        .catch((error) => {
          console.log("Auto-play failed:", error);
          setIsPlaying((prev) => ({ ...prev, [campaignId]: false }));
        });
    }
  };

  const pauseVideo = (campaignId: string) => {
    const video = videoRefs.current[campaignId];
    if (video) {
      video.pause();
      setIsPlaying((prev) => ({ ...prev, [campaignId]: false }));
    }
  };

  const pauseAllVideos = (exceptCampaignId?: string) => {
    Object.keys(videoRefs.current).forEach((campaignId) => {
      if (campaignId !== exceptCampaignId) {
        pauseVideo(campaignId);
      }
    });
  };

  const handleVideoClick = (campaign: Campaign) => {
    const video = videoRefs.current[campaign.id];
    if (!video) return;

    if (isPlaying[campaign.id]) {
      pauseVideo(campaign.id);
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

  const handleProfileVideoClick = (campaignId: string) => {
    const video = videoRefs.current[campaignId];
    if (!video) return;

    if (isPlaying[campaignId]) {
      pauseVideo(campaignId);
    } else {
      pauseAllVideos(campaignId);
      video
        .play()
        .then(() => {
          setIsPlaying((prev) => ({ ...prev, [campaignId]: true }));
        })
        .catch(console.log);
    }
  };

  // Enhanced touch handlers with proper tap vs swipe distinction
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isTap.current = true;
    isVerticalSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    
    // Calculate movement
    const diffX = Math.abs(touchStartX.current - touchEndX.current);
    const diffY = Math.abs(touchStartY.current - touchEndY.current);
    
    // If movement is significant, it's not a tap
    if (diffX > 10 || diffY > 10) {
      isTap.current = false;
      
      // Determine if it's primarily a vertical swipe
      if (diffY > diffX && diffY > 30) {
        isVerticalSwipe.current = true;
      }
    }
  };

  const handleTouchEnd = (campaignId?: string) => {
    const touchDuration = Date.now() - touchStartTime.current;
    const diffX = Math.abs(touchStartX.current - touchEndX.current);
    const diffY = Math.abs(touchStartY.current - touchEndY.current);
    
    // Handle double tap
    if (campaignId) {
      const currentTime = Date.now();
      const doubleTapDelay = 300; // 300ms for double tap
      
      if (
        lastTapCampaignId.current === campaignId &&
        currentTime - lastTapTime.current < doubleTapDelay
      ) {
        // Double tap detected
        tapCount.current++;
        if (tapCount.current === 2) {
          handleLike(campaigns.find(c => c.id === campaignId)!);
          setShowHeartEffect(campaignId);
          
          // Reset double tap tracking
          tapCount.current = 0;
          lastTapTime.current = 0;
          lastTapCampaignId.current = null;
          
          if (tapTimeoutRef.current) {
            clearTimeout(tapTimeoutRef.current);
          }
          return; // Don't process as single tap
        }
      } else {
        // First tap or new campaign
        tapCount.current = 1;
        lastTapTime.current = currentTime;
        lastTapCampaignId.current = campaignId;
        
        // Set timeout to reset tap count
        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
        }
        tapTimeoutRef.current = setTimeout(() => {
          tapCount.current = 0;
        }, doubleTapDelay);
      }
    }

    // Handle single tap (play/pause)
    if (isTap.current && touchDuration < 200 && diffX < 10 && diffY < 10) {
      if (campaignId) {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
          handleVideoClick(campaign);
        }
      }
      return;
    }

    // Handle vertical swipe (navigation)
    if (isVerticalSwipe.current && diffY > 50) {
      const container = containerRef.current;
      if (!container || isSwiping) return;

      const direction = touchStartY.current > touchEndY.current ? 1 : -1;
      const videoHeight = window.innerHeight;
      const currentScroll = container.scrollTop;
      const newIndex = currentIndex + direction;

      if (newIndex >= 0 && newIndex < campaigns.length) {
        setIsSwiping(true);

        // Pause current video before scrolling
        const currentCampaign = campaigns[currentIndex];
        if (currentCampaign) {
          pauseVideo(currentCampaign.id);
        }

        container.scrollTo({
          top: currentScroll + videoHeight * direction,
          behavior: "smooth",
        });

        setCurrentIndex(newIndex);

        // Auto-play the new video after a short delay
        setTimeout(() => {
          const newCampaign = campaigns[newIndex];
          if (newCampaign) {
            const media = getDisplayMedia(newCampaign);
            if (media.type === "video") {
              handleAutoPlay(newCampaign.id);
            }
          }
          setIsSwiping(false);
        }, 300);
      }
    }

    // Reset gesture tracking
    touchStartX.current = 0;
    touchEndX.current = 0;
    touchStartY.current = 0;
    touchEndY.current = 0;
    isTap.current = false;
    isVerticalSwipe.current = false;
  };

  const handleLike = (campaign: Campaign) => {
    setLikedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaign.id)) {
        newSet.delete(campaign.id);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((c) =>
            c.id === campaign.id
              ? {
                  ...c,
                  stats: {
                    ...c.stats,
                    likes: c.stats.likes - 1,
                    is_liked: false,
                  },
                }
              : c
          )
        );
      } else {
        newSet.add(campaign.id);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((c) =>
            c.id === campaign.id
              ? {
                  ...c,
                  stats: {
                    ...c.stats,
                    likes: c.stats.likes + 1,
                    is_liked: true,
                  },
                }
              : c
          )
        );
      }
      return newSet;
    });
  };

  const handleSave = (campaignId: string) => {
    setSavedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  stats: {
                    ...c.stats,
                    saves: c.stats.saves - 1,
                    is_saved: false,
                  },
                }
              : c
          )
        );
      } else {
        newSet.add(campaignId);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((c) =>
            c.id === campaignId
              ? {
                  ...c,
                  stats: {
                    ...c.stats,
                    saves: c.stats.saves + 1,
                    is_saved: true,
                  },
                }
              : c
          )
        );
      }
      return newSet;
    });
  };

  const handlePostClick = (accountId: string, campaignId: string) => {
    const accountCampaigns = campaignsByAccount[accountId] || [];
    const index = accountCampaigns.findIndex((c) => c.id === campaignId);
    if (index !== -1) {
      setProfilePostIndex(index);
      setViewingProfilePost(true);
      pauseAllVideos();
    }
  };

  const handleProfileTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        setShowProfile(false);
        setSelectedAccount(null);
        setViewingProfilePost(false);
      }
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

        // Pause current video before scrolling
        const currentCampaign = campaigns[currentIndex];
        if (currentCampaign) {
          pauseVideo(currentCampaign.id);
        }

        container.scrollTo({
          top: currentScroll + videoHeight * direction,
          behavior: "smooth",
        });

        setCurrentIndex(newIndex);

        // Auto-play the new video after a short delay
        setTimeout(() => {
          const newCampaign = campaigns[newIndex];
          if (newCampaign) {
            const media = getDisplayMedia(newCampaign);
            if (media.type === "video") {
              handleAutoPlay(newCampaign.id);
            }
          }
          setIsSwiping(false);
        }, 300);
      }
    },
    [currentIndex, campaigns, isSwiping]
  );

  const setupIntersectionObserver = useCallback(() => {
    if (!containerRef.current || observerRef.current) return;

    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const campaignId = entry.target.getAttribute("data-campaign-id");
        if (!campaignId) return;

        if (entry.isIntersecting) {
          // When video becomes visible, play it and pause all others
          pauseAllVideos(campaignId);
          const campaign = campaigns.find(c => c.id === campaignId);
          if (campaign) {
            const media = getDisplayMedia(campaign);
            if (media.type === "video") {
              handleAutoPlay(campaignId);
            }
          }
        } else {
          // When video goes out of view, pause it
          pauseVideo(campaignId);
        }
      });
    }, options);

    const videoContainers =
      containerRef.current.querySelectorAll("[data-campaign-id]");
    videoContainers.forEach((container) => {
      observerRef.current?.observe(container);
    });
  }, [campaigns]);

  useEffect(() => {
    fetchCampaigns();
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.account) {
          setCurrentUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && campaigns.length > 0) {
      setupIntersectionObserver();
      // Auto-play the first video if it exists and is a video
      if (campaigns[0]) {
        const media = getDisplayMedia(campaigns[0]);
        if (media.type === "video") {
          setTimeout(() => {
            handleAutoPlay(campaigns[0].id);
          }, 500);
        }
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, campaigns, setupIntersectionObserver]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    if (showProfile || viewingProfilePost) {
      pauseAllVideos();
    }
  }, [showProfile, viewingProfilePost]);

  useEffect(() => {
    if (showHeartEffect) {
      const timer = setTimeout(() => {
        setShowHeartEffect(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showHeartEffect]);

  // Handle scroll events for manual scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isSwiping) return;

      const videoHeight = window.innerHeight;
      const scrollTop = container.scrollTop;
      const newIndex = Math.round(scrollTop / videoHeight);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < campaigns.length) {
        // Pause current video
        const currentCampaign = campaigns[currentIndex];
        if (currentCampaign) {
          pauseVideo(currentCampaign.id);
        }

        setCurrentIndex(newIndex);

        // Auto-play the new video
        const newCampaign = campaigns[newIndex];
        if (newCampaign) {
          const media = getDisplayMedia(newCampaign);
          if (media.type === "video") {
            handleAutoPlay(newCampaign.id);
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, campaigns, isSwiping]);

  const getDisplayMedia = (
    campaign: Campaign
  ): { url: string | null; type: "video" | "image" | "none" } => {
    const currentGalleryIndex = galleryIndex[campaign.id] || 0;

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

    if (campaign.video) {
      return { url: campaign.video, type: "video" };
    }

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

  const CommentsView = ({
    campaign,
    onClose,
  }: {
    campaign: Campaign;
    onClose: () => void;
  }) => {
    const [comments, setComments] = useState<Comment[]>(
      campaign.comments_preview || []
    );

    const handleSendComment = () => {
      if (commentText.trim()) {
        const newComment: Comment = {
          id: `temp_${Date.now()}`,
          user: {
            id: "current_user",
            username: "You",
            profile: null,
            verified: false,
          },
          text: commentText,
          likes: 0,
          created_at: new Date().toISOString(),
          replies_count: 0,
        };
        setComments([newComment, ...comments]);
        setCommentText("");
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold text-gray-900">Comments</h2>
              <p className="text-xs text-gray-500">
                {formatNumber(campaign.stats.comments)} comments
              </p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">No comments yet</h3>
              <p className="text-gray-500 text-center max-w-xs">
                Be the first to comment on this post.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={
                      comment.user.profile ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop"
                    }
                    alt={comment.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{comment.user.username}</span>
                      {comment.user.verified && (
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-800">{comment.text}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                        {comment.likes > 0
                          ? `${formatNumber(comment.likes)} likes`
                          : "Like"}
                      </button>
                      {comment.replies_count > 0 && (
                        <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                          {comment.replies_count} replies
                        </button>
                      )}
                      <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendComment();
                }
              }}
            />
            <button
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              className={`px-4 py-3 rounded-full font-medium transition-colors ${
                commentText.trim()
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProfileView = ({
    account,
    onClose,
  }: {
    account: CampaignAccount;
    onClose: () => void;
  }) => {
    const [activeTab, setActiveTab] = useState("posts");
    const userCampaigns = useMemo(
      () => campaignsByAccount[account.id] || [],
      [campaignsByAccount, account.id]
    );

    return (
      <div
        ref={profileContainerRef}
        className="fixed inset-0 z-50 bg-white overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleProfileTouchEnd}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold text-gray-900">{account.username}</h2>
              <p className="text-xs text-gray-500">@{account.username}</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-700" />
            </button>
          </div>

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
                    className="w-20 h-20 rounded-full border-4 border-green-500"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {account.name || account.username}
                    </h1>
                    {account.verified && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Verified Account
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {account.bio && (
                  <p className="text-gray-700 mb-4">{account.bio}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
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

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {account.posts_count || 0}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(account.followers_count || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatNumber(account.following_count || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mb-6">
              <button className="flex-1 bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition-colors">
                Follow
              </button>
              <button className="flex-1 bg-gray-100 text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Message
              </button>
              <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-4 text-center transition-colors ${
                activeTab === "posts"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">POSTS</span>
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={`flex-1 py-4 text-center transition-colors ${
                activeTab === "reels"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Video className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">VIDEOS</span>
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`flex-1 py-4 text-center transition-colors ${
                activeTab === "tagged"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Tag className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">TAGGED</span>
            </button>
          </div>
        </div>

        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1 p-1">
            {userCampaigns.map((campaign) => {
              const media = getDisplayMedia(campaign);
              return (
                <button
                  key={campaign.id}
                  onClick={() => handlePostClick(account.id, campaign.id)}
                  className="aspect-square bg-gray-50 relative overflow-hidden group hover:opacity-90 transition-opacity"
                >
                  {media.url ? (
                    media.type === "video" ? (
                      <div className="relative w-full h-full">
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                          <Video className="w-3 h-3" />
                          <span>{formatNumber(campaign.stats.views || 0)}</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={media.url}
                        alt={campaign.post_name}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                </button>
              );
            })}
          </div>
        )}

        {userCampaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">No Posts Yet</h3>
            <p className="text-gray-500 text-center max-w-xs">
              When {account.username} shares posts, they'll appear here.
            </p>
          </div>
        )}
      </div>
    );
  };

  const ProfilePostView = ({
    account,
    campaigns,
    initialIndex,
    onClose,
  }: {
    account: CampaignAccount;
    campaigns: Campaign[];
    initialIndex: number;
    onClose: () => void;
  }) => {
    const [currentPostIndex, setCurrentPostIndex] = useState(initialIndex);
    const currentCampaign = campaigns[currentPostIndex];

    const handleNextPost = () => {
      if (currentPostIndex < campaigns.length - 1) {
        pauseAllVideos();
        setCurrentPostIndex(currentPostIndex + 1);
        
        // Auto-play the new video if it exists
        setTimeout(() => {
          const newCampaign = campaigns[currentPostIndex + 1];
          if (newCampaign) {
            const media = getDisplayMedia(newCampaign);
            if (media.type === "video") {
              handleAutoPlay(newCampaign.id);
            }
          }
        }, 100);
      }
    };

    const handlePrevPost = () => {
      if (currentPostIndex > 0) {
        pauseAllVideos();
        setCurrentPostIndex(currentPostIndex - 1);
        
        // Auto-play the new video if it exists
        setTimeout(() => {
          const newCampaign = campaigns[currentPostIndex - 1];
          if (newCampaign) {
            const media = getDisplayMedia(newCampaign);
            if (media.type === "video") {
              handleAutoPlay(newCampaign.id);
            }
          }
        }, 100);
      }
    };

    const media = getDisplayMedia(currentCampaign);

    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-white to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                <img
                  src={
                    account.profile ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop"
                  }
                  alt={account.username}
                  className="w-8 h-8 rounded-full border-2 border-green-500"
                />
                <span className="font-bold text-gray-900">{account.username}</span>
                {account.verified && (
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                )}
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-700">
          {currentPostIndex + 1} / {campaigns.length}
        </div>

        <div className="relative w-full h-full">
          {media.url ? (
            media.type === "video" ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current[currentCampaign.id] = el;
                }}
                src={media.url}
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={() => handleProfileVideoClick(currentCampaign.id)}
              />
            ) : (
              <img
                src={media.url}
                alt={currentCampaign.post_name}
                className="w-full h-full object-contain"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No media available</p>
              </div>
            </div>
          )}

          {campaigns.length > 1 && (
            <>
              {currentPostIndex > 0 && (
                <button
                  onClick={handlePrevPost}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}
              {currentPostIndex < campaigns.length - 1 && (
                <button
                  onClick={handleNextPost}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            {currentCampaign.post_name}
          </h3>
          {currentCampaign.post_description && (
            <p className="text-gray-700 mb-4">
              {currentCampaign.post_description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(currentCampaign)}
                className="flex items-center space-x-2"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    likedCampaigns.has(currentCampaign.id)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-700 hover:text-red-500"
                  }`}
                />
                <span className="text-gray-700">
                  {formatNumber(currentCampaign.stats.likes)}
                </span>
              </button>
              <button
                onClick={() => setShowComments(currentCampaign.id)}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
                <span className="text-gray-700">
                  {formatNumber(currentCampaign.stats.comments)}
                </span>
              </button>
              <button
                onClick={() => handleSave(currentCampaign.id)}
                className="flex items-center space-x-2"
              >
                <Bookmark
                  className={`w-6 h-6 transition-colors ${
                    savedCampaigns.has(currentCampaign.id)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-700 hover:text-yellow-500"
                  }`}
                />
                <span className="text-gray-700">
                  {formatNumber(currentCampaign.stats.saves)}
                </span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(currentCampaign.stats.views)} views
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (viewingProfilePost && selectedAccount) {
    const userCampaigns = campaignsByAccount[selectedAccount.id] || [];
    return (
      <ProfilePostView
        account={selectedAccount}
        campaigns={userCampaigns}
        initialIndex={profilePostIndex}
        onClose={() => {
          setViewingProfilePost(false);
          setSelectedAccount(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSidebar(true)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 hover:bg-gray-200 transition-colors"
            >
              {currentUser && currentUser.account.profile ? (
                <img
                  src={currentUser.account.profile}
                  alt={currentUser.account.username}
                  className="w-full h-full object-cover"
                />
              ) : currentUser ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-lg font-bold text-gray-900">
                Prestige<span className="text-green-600">Wealth</span>
              </span>
            </div>

            <button className="relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <div className="w-2 h-2 rounded-full bg-green-500 absolute -top-0.5 -right-0.5"></div>
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main
        ref={containerRef}
        className="pt-16 h-screen overflow-y-auto snap-y snap-mandatory"
      >
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                No campaigns found
              </h3>
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
            const isLiked = likedCampaigns.has(campaign.id);
            const isSaved = savedCampaigns.has(campaign.id);

            return (
              <div
                key={campaign.id}
                data-campaign-id={campaign.id}
                className="h-screen w-full snap-start relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(campaign.id)}
              >
                <div className="relative w-full h-full bg-white">
                  {displayMedia.url ? (
                    displayMedia.type === "video" ? (
                      <>
                        <video
                          ref={(el) => {
                            if (el) videoRefs.current[campaign.id] = el;
                          }}
                          className="w-full h-full object-cover"
                          loop
                          muted={isMuted}
                          playsInline
                        >
                          <source src={displayMedia.url} type="video/mp4" />
                        </video>
                        
                        {/* Double-tap heart animation */}
                        {showHeartEffect === campaign.id && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="animate-ping">
                              <Heart className="w-32 h-32 text-red-500 fill-red-500 opacity-70" />
                            </div>
                          </div>
                        )}
                      </>
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
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No media available</p>
                      </div>
                    </div>
                  )}

                  {/* Video play/pause overlay */}
                  {displayMedia.type === "video" && (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => handleVideoClick(campaign)}
                    >
                      {!isPlaying[campaign.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-10 h-10 text-green-600 ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {hasGallery && (
                    <div className="absolute bottom-32 right-4 flex flex-col items-center space-y-6">
                      {campaign.campaign_gallery.map((item, idx) => (
                        <button
                          key={item.id}
                          onClick={() =>
                            handleGalleryItemClick(campaign.id, idx)
                          }
                          className={`flex flex-col items-center transition-opacity ${
                            currentGalleryIndex === idx
                              ? "opacity-100"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center mb-1 overflow-hidden border border-gray-200">
                            {item.video ? (
                              <div className="relative w-full h-full">
                                <Video className="w-6 h-6 text-green-600 absolute inset-0 m-auto" />
                                <div className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
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
                                <div className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                                  <ImageIcon className="w-3 h-3 inline" />
                                </div>
                              </div>
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-600">#{idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="absolute bottom-32 right-4 flex flex-col items-center space-y-6">
                    <button
                      onClick={() => {
                        setSelectedAccount(campaign.account);
                        pauseAllVideos();
                        setShowProfile(true);
                      }}
                      className="flex flex-col items-center group"
                    >
                      <div className="relative">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-14 h-14 rounded-full border-2 border-white group-hover:border-green-500 transition-colors"
                        />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleLike(campaign)}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-1 border border-gray-200">
                        <Heart
                          className={`w-7 h-7 transition-colors ${
                            isLiked ? "text-red-500 fill-red-500" : "text-gray-700 hover:text-red-500"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-gray-700">
                        {formatNumber(campaign.stats.likes)}
                      </span>
                    </button>

                    <button
                      onClick={() => setShowComments(campaign.id)}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-1 border border-gray-200">
                        <MessageCircle className="w-7 h-7 text-gray-700 hover:text-green-600 transition-colors" />
                      </div>
                      <span className="text-xs text-gray-700">
                        {formatNumber(campaign.stats.comments)}
                      </span>
                    </button>

                    <button
                      onClick={() => handleSave(campaign.id)}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-1 border border-gray-200">
                        <Bookmark
                          className={`w-7 h-7 transition-colors ${
                            isSaved
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-700 hover:text-yellow-500"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-gray-700">
                        {formatNumber(campaign.stats.saves)}
                      </span>
                    </button>

                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-1 border border-gray-200">
                        <Share2 className="w-7 h-7 text-gray-700 hover:text-green-600 transition-colors" />
                      </div>
                      <span className="text-xs text-gray-700">
                        {formatNumber(campaign.stats.shares)}
                      </span>
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-20 text-gray-900">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-bold text-lg">{creator.name}</span>
                      {creator.verified && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                      <button className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                        Follow
                      </button>
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      {campaign.post_name}
                    </h3>

                    {campaign.post_description && (
                      <p className="text-gray-700 mb-2 line-clamp-2">
                        {campaign.post_description}
                      </p>
                    )}

                    {campaign.tags && campaign.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {campaign.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {campaign.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                            +{campaign.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatNumber(campaign.stats.views)} views</span>
                      <span>•</span>
                      <span>
                        ${parseFloat(campaign.budget).toLocaleString()} budget
                      </span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">Sponsored</span>
                    </div>
                  </div>

                  {displayMedia.type === "video" && (
                    <div className="absolute top-20 right-4">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-gray-200 hover:bg-white transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-gray-700" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </div>
                  )}

                  {index === 0 && campaigns.length > 1 && (
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-600 text-xs mb-1">
                          Swipe up
                        </span>
                        <ChevronDown className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {showProfile && selectedAccount && (
        <ProfileView
          account={selectedAccount}
          onClose={() => {
            setShowProfile(false);
            setSelectedAccount(null);
          }}
        />
      )}

      {showSidebar && (
        <SharedSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          user={currentUser}
        />
      )}

      {showComments && (
        <CommentsView
          campaign={campaigns.find((c) => c.id === showComments)!}
          onClose={() => setShowComments(null)}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center space-y-1 text-green-600">
            <Home className="w-6 h-6" />
            <span className="text-xs">For You</span>
          </button>

          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-green-600 transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </button>

          <button className="relative -top-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </button>

          <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-green-600 transition-colors">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs">Trending</span>
          </button>

          <button
            onClick={() => {
              const currentCampaign = campaigns[currentIndex];
              if (currentCampaign) {
                setSelectedAccount(currentCampaign.account);
                pauseAllVideos();
                setShowProfile(true);
              }
            }}
            className="flex flex-col items-center space-y-1 text-gray-400 hover:text-green-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;