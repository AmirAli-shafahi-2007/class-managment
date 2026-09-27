import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  LogIn,
  Settings,
  ChevronDown,
  Power,
  Crown,
  Clock,
  AlertCircle,
  User,
  Sparkles,
  Menu,
} from "lucide-react";
import NotificationBell from "../NotificationBell";
import subscriptionService from "../../services/subscriptionService";
import { disconnectSocket } from "../../services/socket";

export default function Topbar({ collapsed, onMobileMenuToggle, isMobile }) {
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatarColor, setAvatarColor] = useState("from-blue-500 to-purple-600");
  const [subscription, setSubscription] = useState(null);
  const [remainingDays, setRemainingDays] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    loadSubscription();
  }, []);

  const loadUserData = () => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserName(parsed.name || "کاربر");
        setUserRole(parsed.role || "مدیر");
        setLoggedIn(true);
        const colors = [
          "from-blue-500 to-purple-600",
          "from-green-500 to-teal-600",
          "from-orange-500 to-red-600",
          "from-pink-500 to-rose-600",
          "from-indigo-500 to-blue-600",
          "from-purple-500 to-pink-600",
        ];
        const index = (parsed.name || "user").charCodeAt(0) % colors.length;
        setAvatarColor(colors[index]);
      } catch {
        setLoggedIn(false);
      }
    }
  };

  const loadSubscription = async () => {
    try {
      const res = await subscriptionService.getInfo();
      if (res.success && res.data) {
        setSubscription(res.data);
        setRemainingDays(res.data.remainingDays || 0);
      }
    } catch (err) {
      console.error("خطا در دریافت اشتراک:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    disconnectSocket();
    setLoggedIn(false);
    navigate("/login");
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const getTotalDays = () => {
    if (!subscription) return 365;
    if (subscription.totalDays) return subscription.totalDays;
    if (subscription.remainingDays > 31) return 365;
    return 30;
  };

  const totalDays = getTotalDays();
  const usedPercent =
    totalDays > 0
      ? Math.min(100, Math.round(((totalDays - remainingDays) / totalDays) * 100))
      : 0;

  const getStatusColor = (percent) => {
    if (percent < 25) return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/20", icon: "text-emerald-400" };
    if (percent < 50) return { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/20", icon: "text-green-400" };
    if (percent < 70) return { bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/20", icon: "text-yellow-400" };
    if (percent < 85) return { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/20", icon: "text-orange-400" };
    return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20", icon: "text-red-400" };
  };

  const statusColor = getStatusColor(usedPercent);

  const getSubscriptionBadge = () => {
    if (!subscription) return null;
    const isActive = subscription.isActive;
    const plan = subscription.plan;

    if (!isActive) return { text: "منقضی شده", bg: "bg-red-500/15", textColor: "text-red-400", border: "border-red-500/20", icon: <AlertCircle size={13} className="text-red-400" />, pulse: false };
    if (plan === "free") return { text: "رایگان", bg: "bg-gray-500/10", textColor: "text-gray-400", border: "border-gray-500/15", icon: null, pulse: false };
    return { text: `${remainingDays} روز`, bg: statusColor.bg, textColor: statusColor.text, border: statusColor.border, icon: <Clock size={13} className={statusColor.icon} />, pulse: remainingDays <= 7 };
  };

  const subBadge = getSubscriptionBadge();

  return (
    <header
      className="topbar h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 fixed top-0 z-50 transition-all duration-300"
      style={{ left: 0, right: isMobile ? 0 : collapsed ? "5rem" : "16rem" }}
      dir="rtl"
    >
      <style>{`
        .topbar {
          background: linear-gradient(135deg, rgba(15,23,42,0.98), rgba(10,15,26,0.98));
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .hamburger-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
          border-radius: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          flex-shrink: 0;
        }
        
        .hamburger-btn:hover {
          background: rgba(139,92,246,0.15);
          border-color: rgba(139,92,246,0.3);
        }
        
        .hamburger-btn:active {
          transform: scale(0.95);
          background: rgba(139,92,246,0.25);
        }
        
        .logo-glow {
          box-shadow: 0 0 20px rgba(139,92,246,0.3);
          transition: all 0.3s ease;
        }
        
        .logo-glow:hover {
          box-shadow: 0 0 30px rgba(139,92,246,0.5);
          transform: scale(1.02);
        }
        
        .subscription-badge {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .subscription-badge:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        
        .glass-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
          border-radius: 12px;
        }
        
        .glass-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        
        .user-menu {
          background: linear-gradient(180deg, rgba(15,23,42,0.98), rgba(10,15,26,0.98));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 35px -10px rgba(0,0,0,0.4);
        }
        
        .avatar {
          box-shadow: 0 4px 12px rgba(139,92,246,0.3);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .avatar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        
        .avatar:hover::before {
          left: 100%;
        }
        
        .avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(139,92,246,0.4);
        }
        
        .menu-item {
          transition: all 0.2s ease;
          position: relative;
        }
        
        .menu-item:hover {
          background: rgba(139,92,246,0.15);
          transform: translateX(-4px);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-down {
          animation: slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes pulse-badge {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse-badge {
          animation: pulse-badge 1.5s ease-in-out infinite;
        }
        
        .online-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>

      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 🔥 دکمه همبرگر - فقط توی موبایل و تبلت */}
        {isMobile && (
          <button 
            onClick={onMobileMenuToggle}
            className="hamburger-btn"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center logo-glow">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900 hidden sm:block"></div>
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-bold text-sm sm:text-base tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              پنل مدیریت
            </span>
            <p className="text-[9px] sm:text-[10px] text-gray-500 -mt-0.5">سیستم جامع آموزشی</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Subscription Badge - فقط دسکتاپ */}
        {loggedIn && subBadge && (
          <Link
            to="/pricing"
            className={`hidden lg:flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl subscription-badge border transition-all duration-300 ${subBadge.bg} ${subBadge.textColor} ${subBadge.border} ${subBadge.pulse ? "animate-pulse-badge" : ""}`}
          >
            {subBadge.icon}
            <span className="text-[10px] sm:text-xs font-semibold tracking-tight">{subBadge.text}</span>
            {subscription?.plan !== "free" && subscription?.isActive && (
              <Crown size={11} className={statusColor.icon} />
            )}
          </Link>
        )}

        {/* Notification Bell */}
        <NotificationBell />

        {/* Online Status - فقط دسکتاپ */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl glass-btn">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green-400 online-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </div>
          <span className="text-green-400 text-[10px] sm:text-xs font-medium">آنلاین</span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 sm:gap-3 group focus:outline-none"
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-xs sm:text-sm avatar`}
            >
              {getInitial(userName)}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-white font-semibold text-xs sm:text-sm leading-tight">{userName}</p>
              <p className="text-gray-500 text-[10px] sm:text-[11px] flex items-center gap-1">
                <User size={10} />
                {userRole}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-500 transition-all duration-300 ${showUserMenu ? "rotate-180 text-purple-400" : "group-hover:text-gray-300"}`}
            />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="user-menu absolute left-0 mt-3 w-56 sm:w-64 rounded-2xl overflow-hidden z-50 animate-slide-down">
                {/* User Info Header */}
                <div className="p-3 sm:p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {getInitial(userName)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{userName}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                        <User size={10} />
                        {userRole}
                      </p>
                      {subscription?.isActive && subscription?.plan !== "free" && (
                        <p className="text-[10px] text-purple-400 mt-1 flex items-center gap-1">
                          <Crown size={10} />
                          اشتراک فعال
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/settings");
                    }}
                    className="menu-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-sm"
                  >
                    <Settings size={16} />
                    <span>تنظیمات حساب</span>
                  </button>
                  
                  <Link
                    to="/pricing"
                    onClick={() => setShowUserMenu(false)}
                    className="menu-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-sm"
                  >
                    <Crown size={16} />
                    <span>اشتراک و تعرفه‌ها</span>
                    {subscription?.isActive && subscription?.plan !== "free" && (
                      <span className="mr-auto text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        فعال
                      </span>
                    )}
                  </Link>
                </div>
                
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4"></div>
                
                {/* Logout */}
                <div className="p-2">
                  {loggedIn ? (
                    <button
                      onClick={logout}
                      className="menu-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm"
                    >
                      <Power size={16} />
                      <span>خروج از حساب</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="menu-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all duration-200 text-sm"
                    >
                      <LogIn size={16} />
                      <span>ورود به حساب</span>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Logout Button */}
        {loggedIn && isMobile && (
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
          >
            <LogOut size={18} className="text-red-400" />
          </button>
        )}
      </div>
    </header>
  );
}