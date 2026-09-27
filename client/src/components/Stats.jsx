import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export default function Stats() {
  const [counts, setCounts] = useState({
    institutions: 0, classes: 0, users: 0, revenue: 0, satisfaction: 0, contracts: 0
  });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  const targets = {
    institutions: 50, classes: 1200, users: 350, revenue: 850, satisfaction: 98, contracts: 200
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => { if (sectionRef.current) obs.unobserve(sectionRef.current); };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000, steps = 60, interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = 1 - Math.pow(1 - step / steps, 3);
      setCounts({
        institutions: Math.round(targets.institutions * progress),
        classes: Math.round(targets.classes * progress),
        users: Math.round(targets.users * progress),
        revenue: Math.round(targets.revenue * progress),
        satisfaction: Math.round(targets.satisfaction * progress),
        contracts: Math.round(targets.contracts * progress),
      });
      if (step >= steps) { clearInterval(timer); setCounts(targets); }
    }, interval);
    return () => clearInterval(timer);
  }, [visible]);

  const stats = [
    { 
      label: 'مؤسسه فعال', value: counts.institutions, suffix: '+', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', target: 'institutions',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>
    },
    { 
      label: 'کلاس برگزار شده', value: counts.classes, suffix: '+', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', target: 'classes',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10.5L12 15L2 10.5 12 6zM6 12.5V17c0 1.5 2 3 6 3s6-1.5 6-3v-4.5"/></svg>
    },
    { 
      label: 'کاربر فعال', value: counts.users, suffix: '+', color: '#10b981', bg: 'rgba(16,185,129,0.15)', target: 'users',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    { 
      label: 'تومان تراکنش', value: counts.revenue, suffix: 'M+', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', target: 'revenue',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    { 
      label: 'رضایت کاربران', value: counts.satisfaction, suffix: '%', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)', target: 'satisfaction',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
    },
    { 
      label: 'قرارداد فعال', value: counts.contracts, suffix: '+', color: '#6366f1', bg: 'rgba(99,102,241,0.15)', target: 'contracts',
      icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
    },
  ];

  const getProgressWidth = (value, target) => {
    return visible ? `${Math.min(100, (value / target) * 100)}%` : '0%';
  };

  return (
    <section ref={sectionRef} style={{ position: 'relative', padding: '100px 0', backgroundColor: '#030712', overflow: 'hidden' }} dir="rtl">
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes floatOrb { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-25px,35px) scale(1.3); } }
        
        .stat-card-s {
          background: linear-gradient(160deg, rgba(20,15,50,0.7), rgba(10,8,25,0.5));
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px; padding: 28px 20px 24px;
          text-align: center; transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
          backdrop-filter: blur(40px); position: relative; overflow: hidden; cursor: pointer;
          opacity: 0; transform: translateY(40px);
        }
        .stat-card-s.show { opacity: 1; transform: translateY(0); }
        .stat-card-s.show:nth-child(1) { transition-delay: 0s; }
        .stat-card-s.show:nth-child(2) { transition-delay: 0.1s; }
        .stat-card-s.show:nth-child(3) { transition-delay: 0.2s; }
        .stat-card-s.show:nth-child(4) { transition-delay: 0.3s; }
        .stat-card-s.show:nth-child(5) { transition-delay: 0.4s; }
        .stat-card-s.show:nth-child(6) { transition-delay: 0.5s; }
        
        .stat-card-s::after {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          transition: left 0.7s; z-index: 1;
        }
        .stat-card-s:hover::after { left: 200%; }
        .stat-card-s:hover {
          transform: translateY(-10px) scale(1.03);
          border-color: rgba(139,92,246,0.3);
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
        }
        
        .stat-icon-s {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px; position: relative; z-index: 2;
          transition: all 0.5s; box-shadow: 0 8px 30px -8px rgba(0,0,0,0.4);
        }
        .stat-card-s:hover .stat-icon-s {
          transform: scale(1.15) rotate(-8deg);
          box-shadow: 0 15px 40px -8px currentColor;
        }
        
        .stat-val-s { font-size: 2.2rem; font-weight: 900; color: #fff; margin-bottom: 4px; position: relative; z-index: 2; }
        @media (min-width: 640px) { .stat-val-s { font-size: 2.8rem; } }
        
        .stat-lbl-s { font-size: 0.85rem; color: #94a3b8; font-weight: 500; position: relative; z-index: 2; }
        .stat-card-s:hover .stat-lbl-s { color: #cbd5e1; }
        
        .stat-bar-s { position: relative; z-index: 2; margin-top: 12px; height: 4px; background: rgba(255,255,255,0.04); border-radius: 4px; overflow: hidden; }
        .stat-fill-s { height: 100%; border-radius: 4px; transition: width 1.5s cubic-bezier(0.4,0,0.2,1); }
        
        .gradient-text-stats {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #f9a8d4);
          background-size: 300% 300%;
          animation: gradientFlow 3s ease infinite;
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        
        .orb-deco-s { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(70px); animation: floatOrb 9s ease-in-out infinite; }
      `}</style>

      <div className="orb-deco-s" style={{ width: 450, height: 450, background: 'rgba(139,92,246,0.05)', top: '-10%', left: '-5%' }} />
      <div className="orb-deco-s" style={{ width: 350, height: 350, background: 'rgba(59,130,246,0.04)', bottom: '-5%', right: '-5%', animationDelay: '-4s' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.2)', borderRadius: 50, padding: '10px 24px', fontSize: '0.85rem', color: '#c4b5fd', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28, backdropFilter: 'blur(20px)' }}>
            <Sparkles size={14} style={{ color: '#fbbf24' }} /> آمار و ارقام
          </span>
          <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, marginBottom: 16, color: '#fff' }}>
            اعدادی که <span className="gradient-text-stats">افتخار</span> ما هستند
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 20 }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card-s show">
              <div className="stat-icon-s" style={{ background: s.bg }}>{s.icon}</div>
              <div className="stat-val-s" style={{ textShadow: `0 0 30px ${s.color}30` }}>{s.value}{s.suffix}</div>
              <div className="stat-lbl-s">{s.label}</div>
              <div className="stat-bar-s">
                <div className="stat-fill-s" style={{ 
                  width: getProgressWidth(s.value, targets[s.target]), 
                  background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`,
                  transitionDelay: `${i * 0.15}s`
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}