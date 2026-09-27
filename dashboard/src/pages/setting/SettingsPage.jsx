import { useEffect, useState } from "react";
import { toast } from "../../components/Toast";
import {
  User,
  Lock,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  LogOut,
  EyeOff,
  Eye,
  Sparkles,
  KeyRound,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const d = JSON.parse(stored);
        setUser({
          name: d.name || "",
          username: d.username || "",
          email: d.email || "",
          phone: d.phone || "",
          address: d.address || "",
          avatar: d.avatar || null,
        });
      } catch (e) {}
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("اطلاعات با موفقیت به‌روزرسانی شد ✨");
    } catch (err) {
      toast.error("خطا");
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("رمز عبور جدید با تکرار آن مطابقت ندارد");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.warning("رمز عبور باید حداقل 6 کاراکتر باشد");
      return;
    }
    setLoading(true);
    try {
      toast.success("رمز عبور با موفقیت تغییر کرد 🔒");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error("خطا");
    } finally {
      setLoading(false);
    }
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUser({ ...user, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const tabs = [
    { id: "profile", label: "اطلاعات شخصی", icon: <User size={18} /> },
    { id: "password", label: "تغییر رمز عبور", icon: <Lock size={18} /> },
  ];

  return (
    <div className="p-6 min-h-screen" dir="rtl">
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .glass-input { background: rgba(15,23,42,0.8)!important; border: 1.5px solid rgba(255,255,255,0.06); color: #fff; border-radius: 14px; padding: 14px 16px; font-size: .9rem; width: 100%; text-align: right; transition: all .25s; }
        .glass-input:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.08); background: rgba(15,23,42,0.95)!important; }
        .glass-input::placeholder { color: rgba(255,255,255,0.15); }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; }
        
        .tab-btn { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 14px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; cursor: pointer; width: 100%; background: transparent; border: 1px solid transparent; color: #94a3b8; }
        .tab-btn:hover { background: rgba(255,255,255,0.03); color: #e2e8f0; border-color: rgba(255,255,255,0.05); }
        .tab-btn.active { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; border-color: transparent; box-shadow: 0 4px 15px rgba(139,92,246,0.3); }
        .tab-btn.logout { color: #f87171; }
        .tab-btn.logout:hover { background: rgba(239,68,68,0.08); color: #fca5a5; border-color: rgba(239,68,68,0.15); }
        
        .setting-card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 28px; }
        .avatar-circle { width: 100px; height: 100px; border-radius: 28px; overflow: hidden; cursor: pointer; position: relative; border: 3px solid rgba(139,92,246,0.4); transition: all 0.3s; }
        .avatar-circle:hover { border-color: #8b5cf6; transform: scale(1.03); }
        .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .avatar-circle:hover .avatar-overlay { opacity: 1; }
        
        .password-strength-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); overflow: hidden; margin-top: 8px; }
        .password-strength-fill { height: 100%; border-radius: 3px; transition: all 0.5s ease; }

        .submit-btn { background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899); background-size: 200% 200%; animation: gradient-shift 3s ease infinite; }
      `}</style>

      <div className="mb-10 text-right">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          تنظیمات
        </h1>
        <p className="text-gray-400 text-sm">
          مدیریت اطلاعات شخصی و امنیت حساب
        </p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="glass-card p-3 sticky top-20 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            <div className="border-t border-white/5 my-2"></div>
            <button onClick={handleLogout} className="tab-btn logout">
              <LogOut size={18} />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1" style={{ animation: "slideIn 0.3s ease-out" }}>
          {activeTab === "profile" && (
            <div className="setting-card">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2.5">
                  <User size={20} className="text-blue-400" />
                  اطلاعات شخصی
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/5">
                  <CheckCircle size={12} className="text-emerald-400" />
                  اطلاعات شما محفوظ است
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex justify-center">
                  <div
                    className="avatar-circle"
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="avatar-overlay">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      className="glass-input"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1">
                      نام کاربری
                    </label>
                    <input
                      type="text"
                      className="glass-input"
                      value={user.username}
                      onChange={(e) =>
                        setUser({ ...user, username: e.target.value })
                      }
                      placeholder="نام کاربری"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1 flex items-center gap-1.5">
                      <Mail size={13} />
                      ایمیل
                    </label>
                    <input
                      type="email"
                      className="glass-input"
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1 flex items-center gap-1.5">
                      <Phone size={13} />
                      شماره تماس
                    </label>
                    <input
                      type="tel"
                      className="glass-input"
                      value={user.phone}
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      dir="ltr"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1 flex items-center gap-1.5">
                      <MapPin size={13} />
                      آدرس
                    </label>
                    <textarea
                      className="glass-input min-h-[80px] resize-y"
                      value={user.address}
                      onChange={(e) =>
                        setUser({ ...user, address: e.target.value })
                      }
                      placeholder="آدرس خود را وارد کنید"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn px-6 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="setting-card">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <KeyRound size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">تغییر رمز عبور</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    برای امنیت بیشتر، رمز خود را مرتب تغییر دهید
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 mr-1">
                    رمز عبور فعلی
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="glass-input pl-12"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="رمز عبور فعلی"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1">
                      رمز عبور جدید
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="glass-input pl-12"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="رمز عبور جدید"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-gray-500">قدرت رمز</span>
                          <span
                            className={`font-medium ${passwordForm.newPassword.length < 4 ? "text-red-400" : passwordForm.newPassword.length < 8 ? "text-amber-400" : "text-emerald-400"}`}
                          >
                            {passwordForm.newPassword.length < 4
                              ? "ضعیف"
                              : passwordForm.newPassword.length < 8
                                ? "متوسط"
                                : "قوی"}
                          </span>
                        </div>
                        <div className="password-strength-bar">
                          <div
                            className={`password-strength-fill ${passwordForm.newPassword.length < 4 ? "bg-red-500" : passwordForm.newPassword.length < 8 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{
                              width: `${Math.min((passwordForm.newPassword.length / 12) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 mr-1">
                      تکرار رمز عبور
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="glass-input pl-12"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="تکرار رمز عبور"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {passwordForm.newPassword &&
                      passwordForm.confirmPassword && (
                        <p
                          className={`text-[10px] mt-1.5 ${passwordForm.newPassword === passwordForm.confirmPassword ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {passwordForm.newPassword ===
                          passwordForm.confirmPassword
                            ? "✓ مطابقت دارد"
                            : "✗ مطابقت ندارد"}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    }}
                  >
                    <Save size={16} />
                    {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
