import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  Crown,
  Zap,
  Shield,
  Star,
  CreditCard,
  Sparkles,
  Gift,
  TrendingUp,
  Award,
  Rocket,
  BadgeDollarSign,
  AlertCircle,
} from "lucide-react";
import subscriptionService from "../../services/subscriptionService";
import { toast } from "../../components/Toast";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // امکانات اشتراک (فقط چیزهایی که واقعاً در برنامه پیاده‌سازی شده‌اند)
  const PRO_FEATURES = [
    "مدیریت نامحدود مؤسسه‌ها و شرکت‌ها",
    "قراردادها با نرخ ساعتی و آپلود فایل قرارداد",
    "برنامه‌ی هفتگی و ساخت خودکار کلاس‌ها",
    "ثبت حضور و غیاب و گزارش روزانه کلاس",
    "صورتحساب و امور مالی (درآمد و هزینه)",
    "گزارش‌ها با خروجی PDF و Excel",
    "تقویم و اعلان‌ها",
    "مدیریت وظایف (Todo)",
  ];

  // ⚠️ id و قیمت این‌ها باید با PLANS در subscriptionController.js بک‌اند یکی باشد
  const plans = [
    {
      id: "monthly",
      name: "اشتراک ماهانه",
      price: 199000,
      period: "ماه",
      icon: <Zap size={22} className="sm:w-[26px] sm:h-[26px]" />,
      color: "from-blue-500 to-purple-600",
      features: PRO_FEATURES,
    },
    {
      id: "yearly",
      name: "اشتراک سالانه",
      price: 1990000,
      period: "سال",
      icon: <Rocket size={22} className="sm:w-[26px] sm:h-[26px]" />,
      color: "from-purple-500 to-pink-600",
      popular: true,
      badge: "۲ ماه رایگان",
      note: "۳۹۸٬۰۰۰ تومان کمتر از پرداخت ماهانه",
      features: PRO_FEATURES,
    },
  ];

  const currentPlans = plans;

  useEffect(() => {
    loadSubscription();
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("پرداخت موفق! اشتراک شما فعال شد.");
      loadSubscription();
    } else if (paymentStatus === "failed") {
      toast.error("پرداخت ناموفق بود.");
    }
  }, []);

  async function loadSubscription() {
    try {
      const res = await subscriptionService.getInfo();
      setCurrentSubscription(res?.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePurchase(plan) {
    setSelectedPlan(plan.id);
    setLoading(true);
    try {
      // requestPayment در صورت موفقیت کاربر را به درگاه هدایت می‌کند
      const res = await subscriptionService.requestPayment(plan.id);
      if (!res.success) {
        toast.error("خطا: " + (res.message || "ناشناخته"));
      }
    } catch (err) {
      toast.error("خطا در پرداخت: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (p) => (p === 0 ? "رایگان" : p.toLocaleString() + " تومان");
  const isActive = currentSubscription?.isActive;
  const isTrial = currentSubscription?.isTrial === true;
  // اشتراک پولی فعال (نه دوره‌ی آزمایشی و نه رایگان قدیمی)
  const isPaid = isActive && !isTrial && currentSubscription?.plan !== "free";

  const getTotalDays = () => {
    if (!currentSubscription) return 365;
    if (currentSubscription.totalDays) return currentSubscription.totalDays;
    if (currentSubscription.startDate && currentSubscription.endDate) {
      const start = new Date(currentSubscription.startDate);
      const end = new Date(currentSubscription.endDate);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (diff > 0) return diff;
    }
    if (currentSubscription.remainingDays > 31) return 365;
    return 30;
  };

  const totalDays = getTotalDays();
  const remainingDays = currentSubscription?.remainingDays || 0;
  const usedPercent = totalDays > 0 ? Math.min(100, Math.round(((totalDays - remainingDays) / totalDays) * 100)) : 0;

  const getStatusColor = (percent) => {
    if (percent < 25) return { bg: "from-emerald-500/10 via-green-500/5 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", bar: "from-emerald-500 to-green-500", dot: "bg-emerald-400", badge: "bg-emerald-500/20", badgeText: "text-emerald-400", iconBg: "from-emerald-500 to-green-600" };
    if (percent < 50) return { bg: "from-green-500/10 via-lime-500/5 to-green-500/5", border: "border-green-500/20", text: "text-green-400", bar: "from-green-500 to-lime-500", dot: "bg-green-400", badge: "bg-green-500/20", badgeText: "text-green-400", iconBg: "from-green-500 to-lime-600" };
    if (percent < 70) return { bg: "from-yellow-500/10 via-amber-500/5 to-yellow-500/5", border: "border-yellow-500/20", text: "text-yellow-400", bar: "from-yellow-500 to-amber-500", dot: "bg-yellow-400", badge: "bg-yellow-500/20", badgeText: "text-yellow-400", iconBg: "from-yellow-500 to-amber-600" };
    if (percent < 85) return { bg: "from-orange-500/10 via-orange-500/5 to-amber-500/5", border: "border-orange-500/20", text: "text-orange-400", bar: "from-orange-500 to-red-500", dot: "bg-orange-400", badge: "bg-orange-500/20", badgeText: "text-orange-400", iconBg: "from-orange-500 to-red-600" };
    if (percent < 95) return { bg: "from-red-500/10 via-red-500/5 to-rose-500/5", border: "border-red-500/20", text: "text-red-400", bar: "from-red-500 to-rose-500", dot: "bg-red-400", badge: "bg-red-500/20", badgeText: "text-red-400", iconBg: "from-red-500 to-rose-600" };
    return { bg: "from-red-600/15 via-red-600/8 to-rose-600/5", border: "border-red-500/30", text: "text-red-500", bar: "from-red-600 to-rose-600", dot: "bg-red-500", badge: "bg-red-600/25", badgeText: "text-red-500", iconBg: "from-red-600 to-rose-600" };
  };

  const statusColor = getStatusColor(usedPercent);
  const progressPercent = 100 - usedPercent;

  return (
    <div className="p-4 sm:p-6 min-h-screen relative overflow-hidden bg-[#030712]" dir="rtl">
      <style>{`
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes twinkle { 0%,100%{opacity:.1;transform:scale(.8)} 50%{opacity:.6;transform:scale(1.2)} }
        @keyframes stardust { 0%{transform:translateY(0) translateX(0) scale(1);opacity:.6} 50%{transform:translateY(-10px) translateX(5px) scale(.8);opacity:.3} 100%{transform:translateY(0) translateX(0) scale(1);opacity:.6} }
        @keyframes star-float { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(3px,-8px) rotate(45deg)} }
        
        .bg-animated {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(135deg, #030712 0%, #06061a 20%, #0a0a28 40%, #0d0d2a 60%, #08081a 80%, #030712 100%);
          background-size: 500% 500%;
          animation: gradient-shift 20s ease infinite;
        }
        
        .stars-container { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .star { position: absolute; pointer-events: none; z-index: 0; }
        .star-4pt { width: 4px; height: 4px; background: white; border-radius: 50%; animation: twinkle 3s ease-in-out infinite; box-shadow: 0 0 2px rgba(255,255,255,.8), 0 0 4px rgba(139,92,246,.6); }
        .star-dust { width: 1.5px; height: 1.5px; background: white; border-radius: 50%; animation: stardust 5s ease-in-out infinite; box-shadow: 0 0 1px rgba(255,255,255,.5), 0 0 3px rgba(236,72,153,.3); }
        .star-halo { width: 2px; height: 2px; background: rgba(255,255,255,.9); border-radius: 50%; animation: twinkle 2.5s ease-in-out infinite; box-shadow: 0 0 2px rgba(255,255,255,.8), 0 0 4px rgba(139,92,246,.6); }
        .star-cluster { position: absolute; animation: star-float 15s ease-in-out infinite; }
        
        .pricing-card { 
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06); 
          border-radius: 24px; 
          transition: all 0.3s; 
          display: flex; 
          flex-direction: column;
          position: relative;
          z-index: 1;
        }
        .pricing-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.4); }
        .pricing-card.popular { border: 2px solid rgba(139,92,246,0.4); }
        @media (min-width: 768px) {
          .pricing-card.popular { transform: scale(1.02); }
          .pricing-card.popular:hover { transform: scale(1.03) translateY(-4px); }
        }
        
        .popular-badge { 
          background: linear-gradient(135deg, #8b5cf6, #ec4899); 
          padding: 6px 20px; 
          border-radius: 30px; 
          font-size: 11px; 
          font-weight: 600; 
          position: absolute; 
          top: -14px; 
          right: 16px;
          white-space: nowrap;
          z-index: 2;
        }
        @media (min-width: 640px) { .popular-badge { right: 24px; font-size: 12px; } }
        
        .gift-badge { background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 600; }
        @media (min-width: 640px) { .gift-badge { font-size: 11px; } }
        
        .feature-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 12px; }
        @media (min-width: 640px) { .feature-row { gap: 10px; padding: 7px 0; font-size: 13px; } }
        
        .billing-toggle { background: rgba(255,255,255,0.05); border-radius: 40px; padding: 4px; display: inline-flex; gap: 4px; border: 1px solid rgba(255,255,255,0.08); position: relative; z-index: 1; }
        .billing-btn { padding: 8px 20px; border-radius: 36px; font-size: 13px; font-weight: 500; transition: all 0.3s; cursor: pointer; border: none; color: #9ca3af; background: transparent; white-space: nowrap; }
        @media (min-width: 640px) { .billing-btn { padding: 10px 28px; font-size: 14px; } }
        .billing-btn.active { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; box-shadow: 0 4px 15px rgba(59,130,246,0.3); }
        .billing-btn:not(.active):hover { background: rgba(255,255,255,0.05); color: #e5e7eb; }
        
        .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          position: relative;
          z-index: 1;
        }

        .content-wrapper { position: relative; z-index: 10; }
      `}</style>

      {/* پس‌زمینه کهکشانی */}
      <div className="bg-animated" />
      
      {/* ستاره‌ها */}
      <div className="stars-container">
        <div className="star-cluster" style={{ top: '8%', left: '15%' }}>
          <div className="star star-halo" style={{ top: 0, left: 0, animationDelay: '0s' }}></div>
          <div className="star star-4pt" style={{ top: '15px', left: '10px', animationDelay: '0.5s' }}></div>
          <div className="star star-dust" style={{ top: '-5px', left: '20px', animationDelay: '1s' }}></div>
        </div>
        <div className="star-cluster" style={{ top: '12%', right: '18%', animationDelay: '-5s' }}>
          <div className="star star-4pt" style={{ top: 0, left: 0, animationDelay: '0.3s' }}></div>
          <div className="star star-halo" style={{ top: '12px', left: '-15px', animationDelay: '0.8s' }}></div>
        </div>
        <div className="star star-dust" style={{ top: '20%', left: '35%', animationDelay: '0.1s' }}></div>
        <div className="star star-4pt" style={{ top: '30%', right: '30%', animationDelay: '0.4s' }}></div>
        <div className="star star-halo" style={{ top: '55%', left: '25%', animationDelay: '0.7s' }}></div>
        <div className="star star-dust" style={{ top: '65%', right: '25%', animationDelay: '1.1s' }}></div>
        <div className="star star-4pt" style={{ top: '75%', left: '45%', animationDelay: '0.3s' }}></div>
        <div className="star star-halo" style={{ top: '35%', right: '15%', animationDelay: '0.5s' }}></div>
        <div className="star star-dust" style={{ top: '50%', left: '80%', animationDelay: '0.2s' }}></div>
        <div className="star star-4pt" style={{ top: '85%', left: '65%', animationDelay: '1.3s' }}></div>
      </div>

      {/* محتوای اصلی */}
      <div className="content-wrapper">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-purple-500/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-5 border border-purple-500/20">
            <Sparkles size={12} className="sm:w-[14px] sm:h-[14px] text-purple-400" />
            <span className="text-[10px] sm:text-xs text-purple-400">سیستم مدیریت آموزشی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold pt-2 sm:pt-3 mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            تعرفه‌های اشتراک
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto px-4">
            پلن مناسب خود را انتخاب کنید و از تمام امکانات بهره‌مند شوید
          </p>
        </div>

        {/* Status */}
        {currentSubscription && (
          <div className="max-w-lg mx-auto mb-8 sm:mb-10 px-2">
            <div className={`glass-card !rounded-2xl p-4 sm:p-6 relative overflow-hidden border transition-all duration-700 bg-gradient-to-br ${statusColor.bg} ${statusColor.border}`}>
              {isActive && remainingDays > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-white/5">
                  <div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${statusColor.bar}`} style={{ width: `${progressPercent}%` }} />
                </div>
              )}

              <div className="pb-4 sm:pb-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <div className={`relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-700 ${!isActive ? "bg-gradient-to-br from-gray-500 to-gray-600" : `bg-gradient-to-br ${statusColor.iconBg}`}`}>
                      {isActive ? <Crown size={20} className="sm:w-[26px] sm:h-[26px] text-white" /> : <AlertCircle size={20} className="sm:w-[26px] sm:h-[26px] text-white" />}
                      {isActive && (
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-900 flex items-center justify-center transition-all duration-700 ${statusColor.dot}`}>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-1 uppercase tracking-wider">وضعیت اشتراک</p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`text-lg sm:text-2xl font-extrabold transition-all duration-700 ${statusColor.text}`}>{isActive ? "فعال" : "منقضی شده"}</span>
                        {currentSubscription.plan !== "free" && (
                          <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium border transition-all duration-700 ${statusColor.badge} ${statusColor.badgeText}`}>
                            {isTrial ? "دوره آزمایشی" : "اشتراک حرفه‌ای"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isActive && remainingDays > 0 ? (
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className={`text-2xl sm:text-4xl font-black tracking-tight transition-all duration-700 ${statusColor.text}`}>{remainingDays}</span>
                        <span className="text-gray-400 text-xs sm:text-sm">روز</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">باقی‌مانده از {totalDays} روز</p>
                      <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 justify-end">
                        <span className={`text-[9px] sm:text-[10px] ${statusColor.text}`}>{usedPercent}% مصرف شده</span>
                        <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${statusColor.bar}`} style={{ width: `${usedPercent}%` }} />
                        </div>
                      </div>
                      {remainingDays <= 7 && (
                        <p className="text-[10px] sm:text-xs text-red-400 mt-1 font-medium animate-pulse">⚠️ زمان تمدید نزدیک است</p>
                      )}
                    </div>
                  ) : (
                    <button onClick={() => navigate("/pricing")} className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all hover:scale-105 ${isActive ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/20" : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"}`}>
                      {isActive ? "تمدید اشتراک" : "تهیه اشتراک"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto px-2 sm:px-0">
          {currentPlans.map((plan) => (
            <div key={plan.id} className={`pricing-card p-5 sm:p-7 relative ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="popular-badge text-white">پیشنهادی</div>}
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 sm:mb-5 mx-auto`}>
                <div className="text-white">{plan.icon}</div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-1">{plan.name}</h3>
              {plan.badge && (
                <div className="flex justify-center mb-2 sm:mb-3">
                  <span className="gift-badge text-white flex items-center gap-1">
                    <Gift size={10} className="sm:w-[11px] sm:h-[11px]" /> {plan.badge}
                  </span>
                </div>
              )}
              <div className="text-center mb-4 sm:mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white">{formatPrice(plan.price)}</span>
                  <span className="text-gray-500 text-xs sm:text-sm">/{plan.period}</span>
                </div>
                {plan.note && (
                  <p className="text-[10px] sm:text-xs text-green-400 mt-1.5 sm:mt-2 font-medium">{plan.note}</p>
                )}
              </div>
              <div className="flex-1 mb-4 sm:mb-6">
                {plan.features.map((f, i) => (
                  <div key={i} className="feature-row text-gray-300">
                    <Check size={14} className="sm:w-[15px] sm:h-[15px] text-green-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                {plan.notFeatures?.map((f, i) => (
                  <div key={i} className="feature-row text-gray-600">
                    <span className="w-[14px] sm:w-[15px] flex-shrink-0 text-center text-red-500/50">—</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePurchase(plan)}
                disabled={loading}
                className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.id === "free"
                    ? "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    : plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPlan === plan.id ? (
                  <><div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> پردازش...</>
                ) : (
                  <><CreditCard size={14} className="sm:w-[15px] sm:h-[15px]" /> {isPaid ? "تمدید" : "خرید"} {plan.name}</>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-gray-400 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2"><Shield size={14} className="sm:w-4 sm:h-4 text-green-400" /> پرداخت امن</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><BadgeDollarSign size={14} className="sm:w-4 sm:h-4 text-blue-400" /> فعال‌سازی فوری پس از پرداخت</div>
            <div className="flex items-center gap-1.5 sm:gap-2"><TrendingUp size={14} className="sm:w-4 sm:h-4 text-purple-400" /> پشتیبانی در ساعات کاری</div>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-3 sm:mt-4">* کلیه قیمت‌ها به تومان می‌باشد.</p>
        </div>
      </div>
    </div>
  );
}