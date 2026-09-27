import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  ChevronLeft,
  LayoutDashboard,
  Building2,
  CheckSquare,
  ClipboardList,
  FileText,
  BarChart3,
  Clock,
  DollarSign,
  CalendarDays,
  BookOpen,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Crown } from "lucide-react";

const menuItems = [
  { path: "/pricing", icon: <Crown size={20} color="gold"/>, label: "اشتراک" },
  { path: "/", icon: <LayoutDashboard size={20} />, label: "داشبورد" },
  { path: "/companies", icon: <Building2 size={20} />, label: "مؤسسات" },
  { path: "/contract", icon: <FileText size={20} />, label: "قراردادها" },
  { path: "/classes", icon: <BookOpen size={20} />, label: "الگوهای کلاس" },
  { path: "/calendar", icon: <CalendarDays size={20} />, label: "تقویم کلاس‌ها" },
  { path: "/todo", icon: <CheckSquare size={20} />, label: "تسک‌ها" },
  // { path: "/availableTime", icon: <Clock size={20} />, label: "زمان‌های من" },
  // { path: "/dailyLogs", icon: <ClipboardList size={20} />, label: "گزارش روزانه" },
  { path: "/finance", icon: <DollarSign size={20} />, label: "امور مالی" },
  { path: "/invoices", icon: <FileText size={20} />, label: "صورتحساب‌ها" },
  { path: "/reports", icon: <BarChart3 size={20} />, label: "گزارشات" },
  { path: "/settings", icon: <Settings size={20} />, label: "تنظیمات" },
];
export default function Sidebar({ collapsed, onToggle }) {

  const { pathname } = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes rotateStar {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulseRing {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(139, 92, 246, 0);
          }
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes shine {
          0% {
            left: -100%;
          }
          20% {
            left: 120%;
          }
          100% {
            left: 120%;
          }
        }

        @keyframes borderGlow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes subtlePulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.05);
          }
          50% {
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.1), 0 0 35px rgba(236, 72, 153, 0.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .sidebar-container {
          background: linear-gradient(180deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(12, 18, 34, 0.96) 30%,
            rgba(8, 12, 24, 0.97) 70%,
            rgba(6, 10, 20, 0.98) 100%
          );
          backdrop-filter: blur(60px) saturate(180%);
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 
            -8px 0 32px rgba(0, 0, 0, 0.4),
            -2px 0 8px rgba(139, 92, 246, 0.03),
            inset -1px 0 0 rgba(255, 255, 255, 0.02);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-x: hidden;
          position: fixed;
          right: 0;
          top: 0;
          height: 100vh;
          z-index: 40;
          display: flex;
          flex-direction: column;
          animation: subtlePulse 4s ease-in-out infinite;
        }

        /* ذرات شناور داخل سایدبار */
        .sidebar-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.01) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .sidebar-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        /* لوگو با انیمیشن */
        .logo-section {
          position: relative;
          z-index: 2;
        }

        .logo-wrapper {
          animation: floatLogo 3s ease-in-out infinite;
          position: relative;
        }
        
        .logo-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #6d28d9, #7c3aed, #a78bfa);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 
            0 8px 32px rgba(139, 92, 246, 0.3),
            0 2px 8px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #8b5cf6);
          border-radius: 22px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
          filter: blur(8px);
        }
        
        .logo-icon:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 
            0 12px 40px rgba(139, 92, 246, 0.4),
            0 4px 16px rgba(236, 72, 153, 0.2);
        }
        
        .logo-icon:hover::before {
          opacity: 0.8;
        }
        
        .logo-icon::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 30%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.1) 70%,
            transparent 100%
          );
          transform: rotate(45deg);
          animation: shine 4s infinite;
        }

        .logo-icon-inner {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .logo-glow-orb {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
          top: 8px;
          right: 10px;
          pointer-events: none;
          animation: particleFloat 3s ease-in-out infinite;
        }
        
        .sparkle-star {
          position: absolute;
          top: -10px;
          right: -10px;
          animation: rotateStar 6s linear infinite;
          filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.6));
        }
        
        .pulse-ring {
          position: absolute;
          top: -6px;
          right: -6px;
          left: -6px;
          bottom: -6px;
          border-radius: 26px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          animation: pulseRing 3s infinite;
          pointer-events: none;
        }
        
        .gradient-text-main {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #f9a8d4);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .subtitle-badge {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.15);
          border-radius: 8px;
          padding: 4px 10px;
          backdrop-filter: blur(10px);
        }
        
        .sidebar-item {
          animation: slideInRight 0.5s ease-out forwards;
          opacity: 0;
          position: relative;
        }

        .sidebar-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 10%;
          width: 80%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-item:hover::after {
          opacity: 1;
        }
        
        .sidebar-item:nth-child(1) { animation-delay: 0.02s; }
        .sidebar-item:nth-child(2) { animation-delay: 0.06s; }
        .sidebar-item:nth-child(3) { animation-delay: 0.10s; }
        .sidebar-item:nth-child(4) { animation-delay: 0.14s; }
        .sidebar-item:nth-child(5) { animation-delay: 0.18s; }
        .sidebar-item:nth-child(6) { animation-delay: 0.22s; }
        .sidebar-item:nth-child(7) { animation-delay: 0.26s; }
        .sidebar-item:nth-child(8) { animation-delay: 0.30s; }
        .sidebar-item:nth-child(9) { animation-delay: 0.34s; }
        .sidebar-item:nth-child(10) { animation-delay: 0.38s; }
        .sidebar-item:nth-child(11) { animation-delay: 0.42s; }
        .sidebar-item:nth-child(12) { animation-delay: 0.46s; }
        
        .nav-link {
          position: relative;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 14px;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0) 0%, 
            rgba(139, 92, 246, 0.08) 50%, 
            rgba(236, 72, 153, 0) 100%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 14px;
        }

        .nav-link:hover::before {
          opacity: 1;
        }

        .nav-link.active::before {
          opacity: 1;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.2) 0%, 
            rgba(139, 92, 246, 0.15) 50%, 
            rgba(236, 72, 153, 0.1) 100%
          );
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          width: 3px;
          height: 60%;
          background: linear-gradient(180deg, #8b5cf6, #a78bfa);
          border-radius: 0 4px 4px 0;
          transform: scaleY(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
        }
        
        .nav-link:hover::after {
          transform: scaleY(0.7);
        }
        
        .nav-link.active::after {
          transform: scaleY(1);
          height: 70%;
          top: 15%;
        }
        
        .nav-link.active {
          background: linear-gradient(95deg, 
            rgba(139, 92, 246, 0.15), 
            rgba(139, 92, 246, 0.08),
            rgba(236, 72, 153, 0.05)
          );
          box-shadow: 
            0 4px 16px rgba(139, 92, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(139, 92, 246, 0.15);
        }
        
        .icon-wrapper {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .nav-link:hover .icon-wrapper {
          background: rgba(139, 92, 246, 0.1);
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.15);
        }

        .nav-link.active .icon-wrapper {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.2), 
            rgba(236, 72, 153, 0.1)
          );
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .active-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c084fc, #f9a8d4);
          box-shadow: 
            0 0 8px rgba(192, 132, 252, 0.6),
            0 0 16px rgba(192, 132, 252, 0.3);
        }
        
        .toggle-icon {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .toggle-btn {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.02), 
            rgba(255, 255, 255, 0.01)
          );
          backdrop-filter: blur(10px);
          border-radius: 14px;
        }
        
        .toggle-btn:hover {
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.15), 
            rgba(139, 92, 246, 0.08)
          );
          border-color: rgba(139, 92, 246, 0.25);
          box-shadow: 
            0 4px 20px rgba(139, 92, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          transform: translateY(-1px);
        }

        .toggle-btn:active {
          transform: translateY(0) scale(0.98);
        }
        
        /* اسکرول بار شیشه‌ای */
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin: 10px 0;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2));
          border-radius: 20px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.4));
        }
        
        /* فوتر با فاصله از پایین */
        .sidebar-footer {
          margin-top: auto;
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        /* divider زیبا */
        .menu-divider {
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.04),
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0.04),
            transparent
          );
          margin: 8px 16px 0 16px;
          position: relative;
        }

        .menu-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.3);
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.2);
        }

        /* بخش‌بندی منو */
        .menu-section {
          position: relative;
        }

        .menu-section-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(139, 92, 246, 0.4);
          padding: 8px 16px 4px;
          transition: all 0.3s ease;
        }
          @media (max-width: 1023px) {
          .sidebar-container {
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
        }
      `}</style>

      <aside
        className={`sidebar-container ${collapsed ? "w-[72px]" : "w-64"}`}
        dir="rtl"
      >
        <div className="sidebar-content">
          {/* Header - لوگو با انیمیشن */}
          <div
            className={`logo-section py-6 ${collapsed ? "px-3" : "px-5"} border-b border-white/[0.04]`}
          >
            <div
              className={`flex items-center ${collapsed ? "justify-center" : "gap-4"}`}
            >
              <div className="logo-wrapper relative">
                <div className="logo-icon">
                  <div className="logo-icon-inner">
                    <GraduationCap
                      size={collapsed ? 26 : 30}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div className="logo-glow-orb"></div>
                <div className="pulse-ring"></div>
                <div className="sparkle-star">
                  <Sparkles size={14} className="text-yellow-400" />
                </div>
              </div>

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="gradient-text-main">دبیرا</div>
                  <div className="subtitle-badge mt-1.5 inline-block">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
                      <p className="text-[10px] text-gray-400 font-medium">مدیریت آموزش</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 mt-4 px-2 space-y-0.5 overflow-y-auto sidebar-scroll">
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link flex items-center gap-3 px-3 py-2.5 ${
                  isActive(item.path)
                    ? "active text-white"
                    : "text-gray-400 hover:text-gray-200"
                } ${collapsed ? "justify-center" : ""} sidebar-item`}
                title={collapsed ? item.label : ""}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className={`icon-wrapper`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="text-[13px] font-medium flex-1">{item.label}</span>
                )}
                {isActive(item.path) && !collapsed && (
                  <span className="active-dot"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Menu Divider */}
          {!collapsed && <div className="menu-divider"></div>}

          {/* Footer - با فاصله از پایین */}
          <div className="sidebar-footer">
            <div
              className={`px-3 ${collapsed ? "px-2" : ""}`}
            >
              <div className="border-t border-white/[0.04] pt-3">
                <button
                  onClick={onToggle}
                  className={`toggle-btn group w-full p-2.5 ${
                    collapsed
                      ? "flex justify-center"
                      : "flex items-center justify-center gap-2"
                  }`}
                >
                  <ChevronLeft
                    size={18}
                    className={`toggle-icon text-gray-400 group-hover:text-purple-300 transition-colors duration-300 ${
                      collapsed ? "rotate-180" : ""
                    }`}
                  />
                  {!collapsed && (
                    <span className="text-[11px] text-gray-500 group-hover:text-purple-300 transition-colors duration-300 font-medium">
                      بستن منو
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}