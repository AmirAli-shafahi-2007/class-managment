import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell, BellRing, AlertCircle, Calendar, FileText, CheckSquare, ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";
import { toast } from "../components/Toast";
import { getSocket } from "../services/socket";

moment.loadPersian({ dialect: "persian-modern" });

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setNotifications(data.data || []);
        setStats(data.stats);
      } else {
        setNotifications([]);
        setStats({ total: 0, high: 0, medium: 0, low: 0 });
      }
    } catch (err) {
      console.error("خطا:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // لود اولیه
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // ✅ گوش دادن به نوتیفیکیشن‌های Real-time از WebSocket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notif) => {
      // اضافه کردن به لیست
      setNotifications((prev) => [notif, ...prev]);
      
      // آپدیت آمار
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        [notif.priority]: (prev[notif.priority] || 0) + 1,
      }));

      // پخش صدا (اختیاری)
      // new Audio("/notification.mp3").play().catch(() => {});
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, []);

  // کلیک خارج از دراپ‌داون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIconByCategory = (category) => {
    if (category === "contract") return <FileText size={16} className="text-purple-400" />;
    if (category === "todo") return <CheckSquare size={16} className="text-blue-400" />;
    if (category === "class") return <Calendar size={16} className="text-orange-400" />;
    return <AlertCircle size={16} className="text-yellow-400" />;
  };

  const getBgColor = (type) => {
    if (type === "danger") return "bg-red-500/10 border-red-500/20";
    if (type === "warning") return "bg-yellow-500/10 border-yellow-500/20";
    if (type === "success") return "bg-green-500/10 border-green-500/20";
    return "bg-blue-500/10 border-blue-500/20";
  };

  const getPriorityBadge = (priority) => {
    if (priority === "high") return <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">بالا</span>;
    if (priority === "medium") return <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">متوسط</span>;
    return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">کم</span>;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative glass-btn p-2 rounded-xl transition group"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing size={18} className="text-yellow-400" />
            <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full bg-red-500 text-white flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </>
        ) : (
          <Bell size={18} className="text-gray-400 group-hover:text-white" />
        )}
      </button>

      {showDropdown && (
        <div className="absolute left-0 mt-3 w-96 max-h-[500px] overflow-hidden rounded-xl z-50 animate-slide-down">
          <div className="user-menu">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">نوتیفیکیشن‌ها</h3>
                {stats && <span className="text-xs text-gray-500">{stats.total} مورد</span>}
              </div>
              {stats && stats.total > 0 && (
                <div className="flex gap-2 mt-2 text-xs">
                  {stats.high > 0 && <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400">{stats.high} بالا</span>}
                  {stats.medium > 0 && <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">{stats.medium} متوسط</span>}
                  {stats.low > 0 && <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-400">{stats.low} کم</span>}
                </div>
              )}
            </div>

            {/* List */}
            <div className="max-h-[350px] overflow-y-auto sidebar-scroll">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">هیچ نوتیفیکیشنی نیست</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.slice(0, 20).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.link) {
                          setShowDropdown(false);
                          navigate(notif.link);
                        }
                      }}
                      className={`p-3 cursor-pointer transition hover:bg-white/5 ${getBgColor(notif.type)}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">{getIconByCategory(notif.category)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-medium text-white truncate">{notif.title}</p>
                            {getPriorityBadge(notif.priority)}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{formatDate(notif.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/notifications");
                }}
                className="w-full text-center text-xs text-purple-400 hover:text-purple-300 transition py-2"
              >
                مشاهده همه نوتیفیکیشن‌ها
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .glass-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }
        .glass-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.15);
        }
        .user-menu {
          background: linear-gradient(180deg, #0f172a 0%, #0a0f1a 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
        }
        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 10px; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slideDown 0.2s ease-out; }
      `}</style>
    </div>
  );
}