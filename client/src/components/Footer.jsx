import { Sparkles, Heart, ArrowUp, Send, ChevronLeft, Github, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const sections = [
    { title: 'خدمات', links: ['مدیریت مؤسسات', 'قراردادها', 'کلاس‌ها', 'امور مالی', 'گزارشات'] },
    { title: 'لینک‌ها', links: ['درباره ما', 'تعرفه‌ها', 'تماس با ما', 'سوالات متداول'] },
    { title: 'قوانین', links: ['حریم خصوصی', 'شرایط استفاده'] },
  ];

  return (
    <footer style={{ position: 'relative', backgroundColor: '#030712', borderTop: '1px solid rgba(255,255,255,0.03)' }} dir="rtl">
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 20px rgba(139,92,246,0.2); } 50% { box-shadow: 0 0 40px rgba(139,92,246,0.4); } }
        
        .footer-link { color: #6b7280; text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; transition: all 0.3s; }
        .footer-link:hover { color: #e2e8f0; }
        .footer-link .arrow { opacity: 0; transition: all 0.3s; color: #a78bfa; font-size: 10px; }
        .footer-link:hover .arrow { opacity: 1; }
        
        .social-btn-f { width: 38px; height: 38px; border-radius: 11px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; color: #6b7280; cursor: pointer; transition: all 0.3s; }
        .social-btn-f:hover { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.25); color: #a78bfa; transform: translateY(-3px); }
        
        .newsletter-input-f { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: #fff; border-radius: 12px; padding: 12px 16px; font-size: 0.85rem; outline: none; }
        .newsletter-input-f:focus { border-color: rgba(139,92,246,0.4); }
        .newsletter-input-f::placeholder { color: rgba(255,255,255,0.08); }
        
        .gradient-text-f { background: linear-gradient(135deg, #a78bfa, #c084fc, #f9a8d4); background-size: 300% 300%; animation: gradientFlow 3s ease infinite; -webkit-background-clip: text; background-clip: text; color: transparent; }
      `}</style>

      {/* Scroll to Top */}
      <div style={{ position: 'absolute', top: -22, left: 28 }}>
        <button onClick={scrollToTop} style={{
          width: 44, height: 44, borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', animation: 'pulse 3s ease-in-out infinite',
          boxShadow: '0 8px 25px rgba(139,92,246,0.3)'
        }}>
          <ArrowUp size={18} />
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ padding: '60px 0', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: 40 }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={17} style={{ color: '#fff' }} />
              </div>
              <span className="gradient-text-f" style={{ fontSize: '1.3rem', fontWeight: 900 }}>دبیرا</span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: 20 }}>
              سیستم جامع مدیریت آموزش، راهکاری هوشمند برای مدیریت مؤسسات، کلاس‌ها و امور مالی.
            </p>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input type="email" placeholder="ایمیل شما" className="newsletter-input-f" dir="ltr" />
              <button style={{ padding: '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                <Send size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {[<Github size={16} />, <Linkedin size={16} />, <Twitter size={16} />, <Instagram size={16} />].map((icon, i) => (
                <a key={i} href="#" className="social-btn-f">{icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map((sec, i) => (
            <div key={i}>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 20 }}>{sec.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sec.links.map((link, j) => (
                  <li key={j}><a href="#" className="footer-link"><ChevronLeft size={10} className="arrow" />{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(236,72,153,0.15), transparent)' }} />

        {/* Bottom */}
        <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} | ساخته شده با <Heart size={13} style={{ color: '#f87171', display: 'inline', fill: '#f87171', animation: 'pulse 1.5s infinite' }} />
          </p>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem' }}>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>حریم خصوصی</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>شرایط</a>
          </div>
        </div>
      </div>
    </footer>
  );
}