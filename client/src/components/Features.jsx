import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function Features() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const features = [
    { 
      title: 'مدیریت مؤسسات', 
      desc: 'ثبت و مدیریت نامحدود مؤسسات آموزشی با اطلاعات کامل مدیران، شماره تماس، ایمیل و آدرس',
      color: '#3b82f6',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18"/>
          <path d="M5 21V7l8-4v18"/>
          <path d="M19 21V11l-6-4"/>
          <rect x="8" y="10" width="2" height="2" rx="0.5" fill="white" stroke="none" opacity="0.7"/>
          <rect x="13" y="12" width="2" height="2" rx="0.5" fill="white" stroke="none" opacity="0.7"/>
          <rect x="10" y="15" width="2" height="2" rx="0.5" fill="white" stroke="none" opacity="0.5"/>
        </svg>
      )
    },
    { 
      title: 'قراردادهای هوشمند', 
      desc: 'ایجاد قراردادهای ساعتی با قابلیت پیگیری وضعیت، محاسبه خودکار درآمد و گزارش‌گیری',
      color: '#8b5cf6',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <circle cx="10" cy="9" r="1.5" fill="white" stroke="none" opacity="0.6"/>
        </svg>
      )
    },
    { 
      title: 'الگوی کلاس‌ها', 
      desc: 'تعریف کلاس‌های تکراری هفتگی با قابلیت انتخاب روز، ساعت و بازه زمانی دلخواه',
      color: '#f97316',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="6" x2="12" y2="12"/>
          <line x1="12" y1="12" x2="16" y2="14"/>
          <circle cx="8" cy="10" r="2" fill="white" stroke="none" opacity="0.4"/>
          <path d="M4 4l-1 1M20 4l1 1M4 20l-1-1M20 20l1-1" strokeWidth="1"/>
        </svg>
      )
    },
    { 
      title: 'تقویم حضور و غیاب', 
      desc: 'مشاهده کلاس‌های روزانه، ثبت حضور/غیاب و محاسبه خودکار ساعات تدریس',
      color: '#10b981',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <circle cx="12" cy="15" r="1.5" fill="white" stroke="none" opacity="0.8"/>
          <circle cx="8" cy="15" r="1.5" fill="white" stroke="none" opacity="0.5"/>
          <circle cx="16" cy="15" r="1.5" fill="white" stroke="none" opacity="0.5"/>
        </svg>
      )
    },
    { 
      title: 'امور مالی', 
      desc: 'ثبت درآمدها و هزینه‌ها با فیلتر پیشرفته، محاسبه موجودی و تاریخچه کامل تراکنش‌ها',
      color: '#22c55e',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          <circle cx="12" cy="5" r="1.5" fill="white" stroke="none" opacity="0.5"/>
          <circle cx="12" cy="19" r="1.5" fill="white" stroke="none" opacity="0.5"/>
        </svg>
      )
    },
    { 
      title: 'مدیریت تسک‌ها', 
      desc: 'ایجاد و پیگیری وظایف روزانه با قابلیت تعیین اولویت، موعد مقرر و وضعیت انجام',
      color: '#f59e0b',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9,11 12,14 22,4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          <circle cx="19" cy="5" r="1" fill="white" stroke="none" opacity="0.6"/>
        </svg>
      )
    },
    { 
      title: 'گزارشات پیشرفته', 
      desc: 'نمودارهای تحلیلی، گزارش ساعات تدریس و درآمد با قابلیت خروجی PDF و Excel',
      color: '#6366f1',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
          <circle cx="18" cy="8" r="1.5" fill="white" stroke="none" opacity="0.7"/>
          <circle cx="12" cy="3" r="1.5" fill="white" stroke="none" opacity="0.5"/>
          <circle cx="6" cy="12" r="1.5" fill="white" stroke="none" opacity="0.5"/>
        </svg>
      )
    },
    { 
      title: 'صورتحساب خودکار', 
      desc: 'تولید صورتحساب ماهانه، پیگیری بدهی‌ها و ثبت پرداخت‌ها به صورت یکپارچه',
      color: '#f43f5e',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <path d="M9 15l2 2 4-4"/>
          <circle cx="17" cy="5" r="1" fill="white" stroke="none" opacity="0.6"/>
        </svg>
      )
    },
  ];

  return (
    <section id="features" style={{ position: 'relative', padding: '100px 0', backgroundColor: '#030712' }} dir="rtl">
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes floatOrb { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-30px) scale(1.3); } }
        
        .feat-card-v3 {
          background: linear-gradient(160deg, rgba(20,15,50,0.7), rgba(10,8,25,0.5));
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 24px;
          padding: 32px 24px;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(40px);
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        
        .feat-card-v3.show {
          opacity: 1;
          transform: translateY(0);
        }
        .feat-card-v3.show:nth-child(1) { transition-delay: 0s; }
        .feat-card-v3.show:nth-child(2) { transition-delay: 0.1s; }
        .feat-card-v3.show:nth-child(3) { transition-delay: 0.2s; }
        .feat-card-v3.show:nth-child(4) { transition-delay: 0.3s; }
        .feat-card-v3.show:nth-child(5) { transition-delay: 0.4s; }
        .feat-card-v3.show:nth-child(6) { transition-delay: 0.5s; }
        .feat-card-v3.show:nth-child(7) { transition-delay: 0.6s; }
        .feat-card-v3.show:nth-child(8) { transition-delay: 0.7s; }
        
        .feat-card-v3::before {
          content: ''; position: absolute; inset: 0; opacity: 0;
          transition: opacity 0.6s; border-radius: 24px; z-index: 0;
        }
        
        .feat-card-v3::after {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          transition: left 0.8s; z-index: 1;
        }
        
        .feat-card-v3:hover::before { opacity: 1; }
        .feat-card-v3:hover::after { left: 200%; }
        .feat-card-v3:hover { 
          transform: translateY(-12px) scale(1.02); 
          border-color: rgba(139,92,246,0.25); 
          box-shadow: 0 35px 70px -25px rgba(0,0,0,0.7), 0 0 50px rgba(139,92,246,0.08); 
        }
        
        .feat-icon-v3 {
          width: 56px; height: 56px; min-width: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 30px -8px rgba(0,0,0,0.4);
        }
        
        .feat-card-v3:hover .feat-icon-v3 {
          transform: scale(1.15) rotate(-10deg);
          box-shadow: 0 12px 40px -8px currentColor;
        }
        
        .feat-content-v3 { flex: 1; position: relative; z-index: 2; }
        .feat-title-v3 { font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 8px; transition: all 0.4s; }
        .feat-card-v3:hover .feat-title-v3 { color: #f1f5f9; }
        .feat-desc-v3 { font-size: 0.9rem; color: #94a3b8; line-height: 1.8; transition: all 0.4s; }
        .feat-card-v3:hover .feat-desc-v3 { color: #cbd5e1; }
        
        .feat-glow-line {
          position: absolute; bottom: 0; left: 10%; width: 80%; height: 2px;
          background: linear-gradient(90deg, transparent, currentColor, transparent);
          opacity: 0; transition: all 0.5s; z-index: 2;
        }
        .feat-card-v3:hover .feat-glow-line { opacity: 0.4; }
        
        .gradient-text-feat {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #f9a8d4, #818cf8);
          background-size: 400% 400%;
          animation: gradientFlow 3s ease infinite;
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        
        .orb-deco { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(60px); animation: floatOrb 8s ease-in-out infinite; }
      `}</style>

      {/* تزئینات پس‌زمینه */}
      <div className="orb-deco" style={{ width: 400, height: 400, background: 'rgba(139,92,246,0.05)', top: '10%', right: '-5%' }} />
      <div className="orb-deco" style={{ width: 350, height: 350, background: 'rgba(59,130,246,0.04)', bottom: '5%', left: '-5%', animationDelay: '-4s' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{ 
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', 
            borderRadius: 50, padding: '10px 24px', fontSize: '0.85rem', color: '#c4b5fd', 
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            backdropFilter: 'blur(20px)', boxShadow: '0 0 30px rgba(139,92,246,0.08)'
          }}>
            <Sparkles size={14} style={{ color: '#fbbf24', animation: 'spin 4s linear infinite' }} />
            امکانات بی‌نظیر آکادمی
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
          </span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '3.5rem', fontWeight: 900, marginBottom: 20, color: '#fff', letterSpacing: -1 }}>
            همه چیز برای <span className="gradient-text-feat">مدیریت حرفه‌ای</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            از ثبت مؤسسه تا گزارش‌گیری مالی، همه ابزارهایی که نیاز دارید در یک پلتفرم یکپارچه
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="feat-card-v3 show">
              <div className="feat-icon-v3" style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}dd)` }}>
                {f.icon}
              </div>
              <div className="feat-content-v3">
                <div className="feat-title-v3">{f.title}</div>
                <div className="feat-desc-v3">{f.desc}</div>
              </div>
              <div className="feat-glow-line" style={{ color: f.color }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}