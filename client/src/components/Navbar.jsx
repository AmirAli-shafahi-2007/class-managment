import { useState, useEffect, useRef } from "react";
import { Menu, X, Rocket, Star, Sparkles, Zap } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["features", "pricing", "about", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
      if (window.scrollY < 100) setActiveSection("home");
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { label: "ویژگی‌ها", href: "#features", id: "features" },
    { label: "تعرفه‌ها", href: "#pricing", id: "pricing" },
    { label: "درباره", href: "#about", id: "about" },
    { label: "تماس", href: "#contact", id: "contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.6s",
        background: scrolled ? "var(--bg-card-solid)" : "transparent",
        backdropFilter: scrolled ? "blur(40px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.3)" : "none",
      }}
      dir="rtl"
    >
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes starSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes floatLogo { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
        
        .nav-link { position: relative; padding: 10px 18px; border-radius: 14px; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: all 0.3s; cursor: pointer; }
        .nav-link:hover { color: var(--text-primary); transform: translateY(-2px); background: rgba(139,92,246,0.08); }
        .nav-link.active { color: #fff; font-weight: 600; background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1)); }
        
        .logo-box { width: 44px; height: 44px; border-radius: 15px; background: linear-gradient(135deg, #6d28d9, #7c3aed, #a78bfa); background-size: 200% 200%; animation: gradientFlow 4s ease infinite; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 8px 35px rgba(139,92,246,0.35); flex-shrink: 0; }
        .logo-star { position: absolute; top: -6px; right: -6px; animation: starSpin 4s linear infinite; }
        
        .gradient-text-nav { background: linear-gradient(135deg, #c4b5fd, #a78bfa, #f9a8d4); background-size: 300% 300%; animation: gradientFlow 3s ease infinite; -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 1.4rem; font-weight: 900; }
        
        .btn-primary-nav { padding: 11px 26px; border-radius: 14px; border: none; background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: all 0.3s; box-shadow: 0 8px 30px rgba(139,92,246,0.3); }
        .btn-primary-nav:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(139,92,246,0.5); }
        .btn-login-nav { padding: 10px 22px; border-radius: 13px; border: 1.5px solid rgba(139,92,246,0.2); background: rgba(139,92,246,0.06); color: #a78bfa; font-weight: 600; font-size: 0.88rem; cursor: pointer; text-decoration: none; transition: all 0.3s; }
        .btn-login-nav:hover { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.4); color: #c4b5fd; }
        
        .mobile-menu { background: var(--bg-card-solid); backdrop-filter: blur(60px); border-top: 1px solid rgba(139,92,246,0.1); animation: slideDown 0.3s ease-out; }
        .mobile-link { display: block; padding: 15px 20px; color: var(--text-secondary); text-decoration: none; font-size: 1rem; text-align: center; border-radius: 14px; transition: all 0.3s; margin: 2px 8px; }
        .mobile-link:hover { color: var(--text-primary); background: rgba(139,92,246,0.08); }
      `}</style>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(16px, 3vw, 32px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: isMobile ? 68 : 80,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="logo-box">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10.5L12 15L2 10.5L12 6L22 10.5Z" />
                <path d="M6 12.5V17C6 18.5 8 20 12 20C16 20 18 18.5 18 17V12.5" />
              </svg>
              <div className="logo-star">
                <Star size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
              </div>
            </div>
            <span
              className="gradient-text-nav"
              style={{ display: isMobile ? "none" : "block" }}
            >
              دبیرا
            </span>
          </div>

          <div
            style={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${activeSection === link.id ? "active" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            style={{
              display: isMobile ? "none" : "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <a href="/dashboard/login" className="btn-login-nav">
              ورود
            </a>
            <a href="/dashboard/register" className="btn-primary-nav">
              <Rocket size={17} />
              شروع رایگان
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: isMobile ? "flex" : "none",
              padding: 10,
              borderRadius: 14,
              background: mobileOpen
                ? "rgba(139,92,246,0.2)"
                : "rgba(255,255,255,0.04)",
              border: mobileOpen
                ? "1.5px solid rgba(139,92,246,0.4)"
                : "1.5px solid var(--border)",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobile && mobileOpen && (
        <div className="mobile-menu">
          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                marginTop: 12,
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ThemeToggle />
              </div>
              <a
                href="/dashboard/login"
                className="mobile-link"
                style={{
                  border: "1.5px solid rgba(139,92,246,0.2)",
                  background: "rgba(139,92,246,0.06)",
                }}
              >
                ورود به پنل
              </a>
              <a
                href="/dashboard/register"
                style={{
                  display: "block",
                  padding: "15px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)",
                  color: "#fff",
                  textAlign: "center",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                🚀 شروع رایگان
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
