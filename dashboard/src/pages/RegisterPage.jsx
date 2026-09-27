import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { toast } from "../components/Toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.warning("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.user._id,
          name: res.user.name,
          username: res.user.username,
        }),
      );
      toast.success("ثبت‌نام با موفقیت انجام شد 🎉");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      toast.error(err.message || "ثبت‌نام انجام نشد");
    } finally {
      setLoading(false);
    }
  };

  const FloatingShapes = () => (
    <>
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-500/30 rounded-full animate-float blur-sm" style={{ animationDelay: "0s" }} />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-indigo-400/30 rounded-full animate-float blur-sm" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-pink-500/20 rounded-full animate-float blur-sm" style={{ animationDelay: "2s" }} />
      <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-cyan-400/30 rounded-full animate-float blur-sm" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400/40 rounded-full animate-float blur-sm" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-1/4 right-1/2 w-4 h-4 bg-violet-500/25 rounded-full animate-float blur-sm" style={{ animationDelay: "2.5s" }} />
    </>
  );

  const GridBackground = () => (
    <div className="absolute inset-0 opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
          backgroundSize: "60px 60px",
          backgroundPosition: `${mousePosition.x * 0.01}px ${mousePosition.y * 0.01}px`,
          transition: "background-position 0.1s ease-out",
        }}
      />
    </div>
  );

  const getPasswordStrength = (pass) => {
    if (!pass) return { width: 0, color: "", label: "" };
    const length = pass.length;
    if (length < 4) return { width: 25, color: "bg-red-500", label: "ضعیف" };
    if (length < 6) return { width: 50, color: "bg-orange-500", label: "متوسط" };
    if (length < 8) return { width: 75, color: "bg-yellow-500", label: "خوب" };
    return { width: 100, color: "bg-green-500", label: "قوی" };
  };

  const strength = getPasswordStrength(form.password);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#030712] px-4 py-6 sm:px-6 relative overflow-hidden" dir="rtl">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.2); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes countPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-gradient { animation: gradient-shift 3s ease infinite; background-size: 200% 200%; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-count { animation: countPulse 0.3s ease-in-out; }
        
        .glass-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 32px;
          position: relative;
          overflow: hidden;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          transition: left 0.5s;
        }
        .glass-card:hover::before {
          left: 200%;
        }
        .glass-input {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          border-radius: 16px;
          padding: 14px 48px 14px 16px;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          text-align: right;
        }
        @media (min-width: 640px) {
          .glass-input {
            padding: 16px 52px 16px 16px;
            font-size: 1rem;
          }
        }
        .glass-input:focus {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1), 0 0 20px rgba(139, 92, 246, 0.1);
          background: rgba(15, 23, 42, 0.8);
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.2); font-size: 0.85rem; }
        .input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); transition: color 0.3s; pointer-events: none; }
        @media (min-width: 640px) {
          .input-icon { right: 18px; }
        }
        .glass-input:focus ~ .input-icon { color: #a78bfa; }
        
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          pointer-events: none;
        }
        
        .register-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          position: relative;
          overflow: hidden;
        }
        .register-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }

        @media (max-width: 380px) {
          .glass-card {
            border-radius: 24px;
          }
          .glass-input {
            padding: 12px 42px 12px 12px;
            font-size: 0.875rem;
            border-radius: 12px;
          }
          .input-icon {
            right: 12px;
          }
          .input-icon svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>

      {/* Background Effects */}
      <GridBackground />
      <FloatingShapes />

      <div className="glow-orb w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] bg-indigo-600/20 top-[-100px] sm:top-[-200px] left-[-100px] sm:left-[-200px]" />
      <div className="glow-orb w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-purple-600/15 bottom-[-80px] sm:bottom-[-150px] right-[-80px] sm:right-[-150px]" />
      <div className="glow-orb w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] bg-pink-600/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

      {/* Main Card */}
      <div className="w-full max-w-[440px] sm:max-w-[460px] relative z-10">
        <div className="glass-card p-6 sm:p-8 md:p-10 animate-pulse-glow">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl" />

          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center relative animate-gradient shadow-2xl">
                <span className="text-3xl sm:text-4xl md:text-5xl">✨</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles size={12} className="sm:w-4 sm:h-4 text-yellow-900" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mt-4 sm:mt-6 mb-1 sm:mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ساخت حساب جدید
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm flex items-center justify-center gap-1">
              <span>به خانواده ما بپیوندید</span>
              <span className="inline-block animate-bounce">🚀</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 sm:mr-2 font-medium uppercase tracking-wider">
                نام و نام خانوادگی
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="نام کامل خود را وارد کنید"
                  onChange={handleChange}
                  required
                  autoFocus
                  className="glass-input"
                />
                <User size={18} className="sm:w-5 sm:h-5 input-icon" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 sm:mr-2 font-medium uppercase tracking-wider">
                نام کاربری
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  placeholder="یک نام کاربری انتخاب کنید"
                  onChange={handleChange}
                  required
                  className="glass-input"
                />
                <UserPlus size={18} className="sm:w-5 sm:h-5 input-icon" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 sm:mr-2 font-medium uppercase tracking-wider">
                شماره تماس
              </label>
              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  onChange={handleChange}
                  required
                  className="glass-input"
                  dir="ltr"
                />
                <Phone size={18} className="sm:w-5 sm:h-5 input-icon" />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 to-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 mr-1 sm:mr-2 font-medium uppercase tracking-wider">
                رمز عبور
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="حداقل ۶ کاراکتر"
                  onChange={handleChange}
                  required
                  className="glass-input"
                />
                <Lock size={18} className="sm:w-5 sm:h-5 input-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                </button>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </div>

              {/* Password Strength */}
              {form.password && (
                <div className="mt-2 sm:mt-3 animate-count">
                  <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                    <span className={`text-[10px] sm:text-xs font-medium ${
                      form.password.length < 4 ? "text-red-400" : form.password.length < 6 ? "text-orange-400" : form.password.length < 8 ? "text-yellow-400" : "text-green-400"
                    }`}>
                      {strength.label}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {form.password.length}/6 کاراکتر
                    </span>
                  </div>
                  <div className="h-1 sm:h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${strength.width}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={loading}
                className="register-btn w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white font-bold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال ثبت نام...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="sm:w-5 sm:h-5" />
                    <span>ثبت نام در سیستم</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 sm:px-4 text-[10px] sm:text-xs text-gray-600 bg-[#0a0f1a]">
                قبلاً عضو هستید؟
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-bold transition inline-flex items-center gap-1 group text-xs sm:text-sm"
            >
              <span>وارد حساب کاربری خود شوید</span>
              <ArrowLeft size={12} className="sm:w-[14px] sm:h-[14px] group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Footer badge */}
          <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] text-gray-600">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              اطلاعات شما محفوظ است
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}