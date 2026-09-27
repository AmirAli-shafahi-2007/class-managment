import { useState, useEffect } from 'react';
import { Crown, Gift, Sparkles, Shield } from 'lucide-react';

export default function Pricing() {
  const [cycle, setCycle] = useState('monthly');
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const plans = {
    monthly: [
      { 
        id: 'free', name: 'رایگان', price: '۰', period: 'همیشه', color: '#6b7280',
        desc: 'برای شروع و آشنایی با سیستم',
        features: ['۳ مؤسسه', '۵ کلاس در ماه', 'گزارشات پایه', 'پشتیبانی ایمیل'],
        notFeatures: ['قرارداد', 'خروجی PDF'],
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        )
      },
      { 
        id: 'pro', name: 'حرفه‌ای', price: '۱۹۹', original: '۲۹۹', period: 'ماهانه', color: '#8b5cf6',
        desc: 'بهترین انتخاب برای آموزشگاه‌ها',
        features: ['مؤسسه نامحدود', 'کلاس نامحدود', 'قرارداد نامحدود', 'گزارشات پیشرفته', 'خروجی PDF/Excel', 'پشتیبانی ۲۴/۷'],
        popular: true,
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
            <circle cx="13" cy="3" r="1.5" fill="white" stroke="none" opacity="0.5"/>
          </svg>
        )
      },
      { 
        id: 'enterprise', name: 'سازمانی', price: '۴۹۹', original: '۶۹۹', period: 'ماهانه', color: '#10b981',
        desc: 'برای سازمان‌های بزرگ و چند کاربره',
        features: ['همه امکانات حرفه‌ای', 'چند کاربر همزمان', 'پشتیبانی اختصاصی', 'API اختصاصی', 'گواهینامه رسمی'],
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9,12 11,14 15,10"/>
          </svg>
        )
      },
    ],
    yearly: [
      { 
        id: 'free', name: 'رایگان', price: '۰', period: 'همیشه', color: '#6b7280',
        desc: 'برای شروع و آشنایی با سیستم',
        features: ['۳ مؤسسه', '۵ کلاس در ماه', 'گزارشات پایه', 'پشتیبانی ایمیل'],
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        )
      },
      { 
        id: 'pro', name: 'حرفه‌ای', price: '۱,۹۹۰', original: '۳,۵۸۸', period: 'سالانه', color: '#8b5cf6',
        desc: 'بهترین انتخاب با ۳۰٪ تخفیف',
        badge: '🎁 ۲ ماه هدیه',
        features: ['مؤسسه نامحدود', 'کلاس نامحدود', 'قرارداد نامحدود', 'گزارشات پیشرفته', 'خروجی PDF/Excel', 'پشتیبانی ۲۴/۷', '۲ ماه رایگان'],
        popular: true,
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c2.5 0 4.5-2 4.5-4.5S17.5 5 15 5c-2 0-3.5 1-4.5 2.5C9.5 6 8 5 6 5 3.5 5 2 7 2 9.5S3.5 14 6 14"/>
            <path d="M15 9c1 1 2 2.5 2 4.5s-1 3.5-2 4.5"/>
            <circle cx="17" cy="4" r="1.5" fill="white" stroke="none" opacity="0.6"/>
          </svg>
        )
      },
      { 
        id: 'enterprise', name: 'سازمانی', price: '۴,۹۹۰', original: '۸,۳۸۸', period: 'سالانه', color: '#10b981',
        desc: 'سازمانی با ۴۰٪ تخفیف',
        badge: '🎁 ۳ ماه هدیه',
        features: ['همه امکانات حرفه‌ای', 'چند کاربر همزمان', 'پشتیبانی اختصاصی', 'API اختصاصی', 'گواهینامه رسمی', '۳ ماه رایگان'],
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
            <circle cx="12" cy="7" r="1" fill="white" stroke="none" opacity="0.5"/>
          </svg>
        )
      },
    ],
  };

  const current = plans[cycle];

  return (
    <section id="pricing" style={{ position: 'relative', padding: '120px 0', backgroundColor: '#030712', overflow: 'hidden' }} dir="rtl">
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes floatOrb { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.4); } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 20px rgba(139,92,246,0.2); } 50% { box-shadow: 0 0 50px rgba(139,92,246,0.5), 0 0 80px rgba(236,72,153,0.2); } }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
        
        .price-card-v3 {
          background: linear-gradient(160deg, rgba(20,15,50,0.8), rgba(10,8,25,0.6));
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 32px;
          padding: 40px 30px;
          display: flex; flex-direction: column;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(50px);
          -webkit-backdrop-filter: blur(50px);
          position: relative; overflow: hidden;
          opacity: 0; transform: translateY(40px);
        }
        
        .price-card-v3.show { opacity: 1; transform: translateY(0); }
        .price-card-v3.show:nth-child(1) { transition-delay: 0s; }
        .price-card-v3.show:nth-child(2) { transition-delay: 0.15s; }
        .price-card-v3.show:nth-child(3) { transition-delay: 0.3s; }
        
        .price-card-v3::before {
          content: ''; position: absolute; inset: 0; opacity: 0;
          transition: opacity 0.6s; border-radius: 32px; z-index: 0;
        }
        .price-card-v3.c2::before { background: radial-gradient(ellipse at top, rgba(139,92,246,0.2), transparent 60%); }
        .price-card-v3.c1::before { background: radial-gradient(ellipse at top, rgba(107,114,128,0.1), transparent 60%); }
        .price-card-v3.c3::before { background: radial-gradient(ellipse at top, rgba(16,185,129,0.2), transparent 60%); }
        
        .price-card-v3::after {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          transition: left 0.8s; z-index: 1;
        }
        
        .price-card-v3:hover::before { opacity: 1; }
        .price-card-v3:hover::after { left: 200%; }
        .price-card-v3:hover {
          transform: translateY(-16px) scale(1.02);
          border-color: rgba(139,92,246,0.3);
          box-shadow: 0 40px 80px -25px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.1);
        }
        .price-card-v3.popular {
          border-color: rgba(139,92,246,0.3);
          animation: pulseGlow 3s ease-in-out infinite;
        }
        
        .price-icon-v3 {
          width: 64px; height: 64px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px; position: relative; z-index: 2;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
        }
        .price-card-v3:hover .price-icon-v3 {
          transform: scale(1.2) rotate(-10deg);
          box-shadow: 0 15px 50px -10px currentColor;
        }
        
        .price-tag-v3 {
          position: absolute; top: 20px; left: 20px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white; padding: 8px 20px; border-radius: 50px;
          font-size: 0.75rem; font-weight: 800; z-index: 5;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 8px 25px rgba(139,92,246,0.4);
          animation: pulseGlow 3s ease-in-out infinite;
        }
        
        .gradient-text-price {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #f9a8d4);
          background-size: 300% 300%;
          animation: gradientFlow 3s ease infinite;
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        
        .toggle-btn-price {
          padding: 12px 32px; border-radius: 50px; border: none;
          font-size: 0.95rem; font-weight: 700; cursor: pointer;
          background: transparent; color: #9ca3af; transition: all 0.3s;
        }
        .toggle-btn-price.active {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff; box-shadow: 0 8px 30px rgba(139,92,246,0.3);
        }
        
        .orb-deco-p { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(70px); animation: floatOrb 10s ease-in-out infinite; }
      `}</style>

      {/* تزئینات */}
      <div className="orb-deco-p" style={{ width: 500, height: 500, background: 'rgba(139,92,246,0.06)', top: '-10%', right: '-8%' }} />
      <div className="orb-deco-p" style={{ width: 400, height: 400, background: 'rgba(16,185,129,0.04)', bottom: '-5%', left: '-5%', animationDelay: '-5s' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ 
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 50, padding: '10px 24px', fontSize: '0.85rem', color: '#c4b5fd',
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            backdropFilter: 'blur(20px)'
          }}>
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            تعرفه‌های شفاف
          </span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '3.5rem', fontWeight: 900, marginBottom: 20, color: '#fff' }}>
            <span className="gradient-text-price">سرمایه‌گذاری</span> روی آموزش
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: 48 }}>پلن مناسب خود را انتخاب کنید</p>
          
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 50, padding: 5, gap: 5 }}>
            <button onClick={() => setCycle('monthly')} className={`toggle-btn-price ${cycle === 'monthly' ? 'active' : ''}`}>ماهانه</button>
            <button onClick={() => setCycle('yearly')} className={`toggle-btn-price ${cycle === 'yearly' ? 'active' : ''}`}>
              سالانه <span style={{ fontSize: 11, background: 'rgba(250,204,21,0.25)', color: '#fde047', padding: '3px 10px', borderRadius: 20, marginRight: 8, fontWeight: 700 }}>۳۰٪ تخفیف</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 28 }}>
          {current.map((p, i) => (
            <div 
              key={i} 
              className={`price-card-v3 ${p.popular ? 'popular' : ''} c${i+1} show`}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {p.popular && (
                <div className="price-tag-v3">
                  <Crown size={14} /> محبوب‌ترین
                </div>
              )}
              
              {p.badge && (
                <div style={{ textAlign: 'center', marginBottom: 20, position: 'relative', zIndex: 2 }}>
                  <span style={{ 
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)', 
                    color: '#fff', padding: '6px 18px', borderRadius: 20, 
                    fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6,
                    boxShadow: '0 4px 15px rgba(245,158,11,0.3)'
                  }}>
                    <Gift size={14} /> {p.badge}
                  </span>
                </div>
              )}
              
              <div className="price-icon-v3" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}>
                {p.icon}
              </div>
              
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', textAlign: 'center', marginBottom: 6, position: 'relative', zIndex: 2 }}>
                {p.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 2 }}>
                {p.desc}
              </p>
              
              <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 2 }}>
                {p.original && (
                  <p style={{ color: '#6b7280', textDecoration: 'line-through', fontSize: '0.95rem', marginBottom: 6, opacity: 0.7 }}>
                    {p.original} هزار تومان
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', letterSpacing: -2 }}>{p.price}</span>
                  <span style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 600 }}>هزار ت</span>
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>/ {p.period}</span>
              </div>
              
              <div style={{ flex: 1, marginBottom: 32, position: 'relative', zIndex: 2 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', color: '#d1d5db', fontSize: '0.9rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {f}
                  </div>
                ))}
                {p.notFeatures?.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', color: '#4b5563', fontSize: '0.9rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
              
              <a href="/dashboard/register" style={{
                display: 'block', width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textAlign: 'center', textDecoration: 'none',
                background: p.id === 'free' 
                  ? 'rgba(255,255,255,0.04)' 
                  : p.popular 
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)' 
                    : `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                color: '#fff', transition: 'all 0.4s', position: 'relative', zIndex: 2,
                boxShadow: p.popular ? '0 10px 40px rgba(139,92,246,0.3)' : 'none',
                backgroundSize: p.popular ? '200% 200%' : 'auto',
                animation: p.popular ? 'gradientFlow 3s ease infinite' : 'none'
              }}>
                {p.id === 'free' ? 'شروع رایگان' : 'شروع کنید'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}