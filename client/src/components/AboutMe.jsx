import { useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  Sparkles,
  Heart,
  Star,
  Clock,
  Target,
} from "lucide-react";

export default function AboutMe() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setVisible(true);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const highlights = [
    {
      label: "سال تجربه",
      value: "۳+",
      color: "#3b82f6",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
    },
    {
      label: "پروژه موفق",
      value: "۲۰+",
      color: "#f59e0b",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ),
    },
    {
      label: "رضایت مشتری",
      value: "۱۰۰٪",
      color: "#f43f5e",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: "پشتیبانی",
      value: "۲۴/۷",
      color: "#10b981",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
  ];

  const skills = [
    {
      name: "React.js",
      level: 95,
      color: "#06b6d4",
      desc: "کامپوننت، هوک، HOC، Zustand",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1.5" fill="#06b6d4" stroke="none" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      ),
    },
    {
      name: "Node.js",
      level: 90,
      color: "#22c55e",
      desc: "Express، REST API، WebSocket",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      name: "MongoDB",
      level: 85,
      color: "#10b981",
      desc: "Aggregation، Mongoose، Atlas",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.5 3.5 3 8 3s8-1.5 8-3V6" />
          <path d="M4 12v6c0 1.5 3.5 3 8 3s8-1.5 8-3v-6" />
        </svg>
      ),
    },
    {
      name: "UI/UX Design",
      level: 88,
      color: "#8b5cf6",
      desc: "Figma، Tailwind، Responsive",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
          <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
        </svg>
      ),
    },
    {
      name: "JavaScript",
      level: 95,
      color: "#eab308",
      desc: "ES6+، Async/Await، DOM",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <line x1="8" y1="12" x2="10" y2="14" />
          <line x1="8" y1="14" x2="10" y2="12" />
          <line x1="14" y1="12" x2="16" y2="14" />
          <line x1="14" y1="14" x2="16" y2="12" />
        </svg>
      ),
    },
  ];

  const techs = [
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "Tailwind",
    "TypeScript",
    "REST API",
    "Git",
    "Docker",
    "Redux",
    "Next.js",
    "GraphQL",
  ];

  const socialLinks = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      href: "#",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      href: "#",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      ),
      href: "#",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      href: "mailto:info@academy.ir",
    },
  ];

  return (
    <section
      id="about"
      style={{
        position: "relative",
        padding: "clamp(60px, 8vw, 120px) 0",
        backgroundColor: "#030712",
        overflow: "hidden",
      }}
      dir="rtl"
    >
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes wave { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(-15deg); } 75% { transform: rotate(15deg); } }
        @keyframes typing { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes floatEmoji { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-18px) scale(1.15); } }
        @keyframes sparkle { 0%,100% { opacity: 0.4; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes morphOrb { 0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; } }
        
        .glass-card-about {
          background: linear-gradient(160deg, rgba(25,20,50,0.7), rgba(10,8,22,0.8));
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 24px; padding: clamp(20px, 3vw, 28px);
          backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
          transition: all 0.4s ease; opacity: 0; transform: translateY(20px);
        }
        .glass-card-about.show { opacity: 1; transform: translateY(0); }
        .glass-card-about:hover { border-color: rgba(139,92,246,0.2); }
        
        .profile-ring {
          width: clamp(80px, 15vw, 100px); height: clamp(80px, 15vw, 100px);
          border-radius: clamp(22px, 4vw, 26px);
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          padding: 3px; margin: 0 auto 18px;
        }
        .profile-inner {
          width: 100%; height: 100%; border-radius: clamp(19px, 3.5vw, 23px);
          background: #0f0f23; display: flex;
          align-items: center; justify-content: center;
          font-size: clamp(2rem, 5vw, 2.5rem);
        }
        
        .skill-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 12px;
          border: 1px solid transparent; transition: all 0.3s ease;
        }
        
        .skill-bar { 
          width: clamp(40px, 10vw, 60px); height: 4px; 
          background: rgba(255,255,255,0.05); 
          border-radius: 10px; overflow: hidden; 
          transition: width 0.4s ease;
        }
        .skill-item:hover .skill-bar { width: clamp(70px, 15vw, 100px); }
        .skill-fill { height: 100%; border-radius: 10px; }
        
        .social-btn-about {
          width: clamp(34px, 6vw, 38px); height: clamp(34px, 6vw, 38px);
          border-radius: 11px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          color: #6b7280; cursor: pointer; transition: all 0.3s; text-decoration: none;
        }
        .social-btn-about:hover { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.25); color: #a78bfa; transform: translateY(-3px); }
        
        .tech-tag {
          padding: 5px 12px; border-radius: 50px; font-size: clamp(0.68rem, 1.2vw, 0.75rem);
          background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.1);
          color: #a78bfa; transition: all 0.3s; white-space: nowrap;
        }
        .tech-tag:hover { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.2); color: #c4b5fd; }
        
        .gradient-text-about {
          background: linear-gradient(135deg, #c4b5fd, #a78bfa, #c084fc, #f9a8d4);
          background-size: 300% 300%; animation: gradientFlow 3s ease infinite;
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        
        .morph-orb-a { position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%); pointer-events: none; animation: morphOrb 12s ease-in-out infinite; }
      `}</style>

      <div className="morph-orb-a" style={{ top: "-10%", right: "-5%" }} />
      <div
        className="morph-orb-a"
        style={{
          bottom: "-10%",
          left: "-5%",
          animationDelay: "-6s",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.04), transparent 70%)",
        }}
      />

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 24px)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(36px, 6vw, 56px)",
          }}
        >
          {/* Emoji Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginBottom: 24,
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                animation: "floatEmoji 3.5s ease-in-out infinite",
                display: "inline-block",
              }}
            >
              <span
                style={{
                  animation: "wave 2.5s ease-in-out infinite",
                  display: "inline-block",
                  transformOrigin: "bottom right",
                }}
              >
                👋
              </span>
            </span>
            <span
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                animation: "floatEmoji 3.5s ease-in-out 0.6s infinite",
                display: "inline-block",
              }}
            >
              💻
            </span>
            <span
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                animation: "floatEmoji 3.5s ease-in-out 1.2s infinite",
                display: "inline-block",
              }}
            >
              ✨
            </span>
          </div>

          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 50,
                padding: "clamp(6px, 1vw, 8px) clamp(14px, 3vw, 20px)",
                fontSize: "clamp(0.7rem, 1.3vw, 0.8rem)",
                color: "#c4b5fd",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backdropFilter: "blur(20px)",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10b981",
                  animation: "pulse 2s ease-in-out infinite",
                  display: "inline-block",
                }}
              />
              در دسترس برای همکاری
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: "clamp(1.6rem, 5vw, 3rem)",
              fontWeight: 900,
              marginBottom: 16,
              color: "#fff",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            سلام،{" "}
            <span style={{ margin: "0 8px", display: "inline-block" }}>
              <span className="gradient-text-about">امیرعلی</span>
            </span>{" "}
            هستم
            <span
              style={{
                display: "inline-block",
                animation: "typing 1s step-end infinite",
                color: "#8b5cf6",
                fontWeight: 400,
                fontSize: "clamp(1.4rem, 4.5vw, 2.8rem)",
                marginLeft: 4,
              }}
            >
              _
            </span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            برنامه‌نویس{" "}
            <span style={{ color: "#c4b5fd", fontWeight: 600 }}>
              Full-Stack
            </span>{" "}
           {" "}
            <span style={{ color: "#fbbf24", fontWeight: 600 }}></span> 
            <Sparkles
              size={14}
              style={{
                display: "inline",
                color: "#fbbf24",
                marginRight: 4,
                verticalAlign: "middle",
              }}
            />
          </p>
        </div>

        {/* Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: "clamp(10px, 2vw, 14px)",
            marginBottom: "clamp(24px, 4vw, 32px)",
          }}
        >
          {highlights.map((h, i) => (
            <div
              key={i}
              className="glass-card-about show"
              style={{
                padding: "clamp(14px, 2vw, 18px) clamp(10px, 1.5vw, 14px)",
                textAlign: "center",
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div
                style={{
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {h.icon}
              </div>
              <div
                style={{
                  fontSize: "clamp(1.3rem, 3vw, 1.6rem)",
                  fontWeight: 900,
                  color: h.color,
                  marginBottom: 2,
                }}
              >
                {h.value}
              </div>
              <div
                style={{
                  fontSize: "clamp(0.68rem, 1.2vw, 0.75rem)",
                  color: "#6b7280",
                }}
              >
                {h.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
            gap: "clamp(14px, 2.5vw, 20px)",
            alignItems: "stretch",
          }}
        >
          {/* Left - Profile */}
          <div
            className="glass-card-about show"
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transitionDelay: "0s",
            }}
          >
            <div className="profile-ring">
              <div className="profile-inner">👨‍💻</div>
            </div>
            <h3
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                marginBottom: 2,
              }}
            >
              امیرعلی شفاهی
            </h3>
            <p
              className="gradient-text-about"
              style={{
                fontWeight: 600,
                fontSize: "clamp(0.75rem, 1.5vw, 0.82rem)",
                marginBottom: 12,
              }}
            >
              Full-Stack Developer
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                fontSize: "clamp(0.7rem, 1.3vw, 0.75rem)",
                color: "#9ca3af",
                marginBottom: 14,
              }}
            >
              <MapPin size={12} style={{ color: "#6b7280" }} />{" "}
              <span>مشهد</span>
              <span style={{ color: "#4b5563", margin: "0 4px" }}>•</span>
              <Briefcase size={12} style={{ color: "#6b7280" }} />{" "}
              <span>Freelancer</span>
            </div>

            <p
              style={{
                color: "#6b7280",
                fontSize: "clamp(0.73rem, 1.3vw, 0.8rem)",
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              از ۱۴۰۰ فعال در حوزه کدنویسی .
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} className="social-btn-about">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right - Skills */}
          <div
            className="glass-card-about show"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transitionDelay: "0.1s",
            }}
          >
            <h4
              style={{
                color: "#fff",
                fontWeight: 700,
                marginBottom: 16,
                fontSize: "clamp(0.82rem, 1.5vw, 0.9rem)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#eab308"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
              </svg>
              مهارت‌های فنی
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="skill-item"
                  style={{
                    background:
                      hoveredSkill === i ? `${s.color}08` : "transparent",
                    borderColor:
                      hoveredSkill === i ? `${s.color}20` : "transparent",
                  }}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div
                    style={{
                      width: "clamp(28px, 5vw, 34px)",
                      height: "clamp(28px, 5vw, 34px)",
                      borderRadius: 10,
                      background: `${s.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {s.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          color: hoveredSkill === i ? "#fff" : "#d1d5db",
                          fontSize: "clamp(0.72rem, 1.3vw, 0.8rem)",
                          fontWeight: 600,
                          transition: "color 0.3s",
                        }}
                      >
                        {s.name}
                      </span>
                      <span
                        style={{
                          color: s.color,
                          fontWeight: 700,
                          fontSize: "clamp(0.65rem, 1.1vw, 0.72rem)",
                          opacity: 0.7,
                        }}
                      >
                        {s.level}%
                      </span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-fill"
                        style={{
                          width: visible ? `${s.level}%` : "0%",
                          background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`,
                          transition: `width 1.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {techs.map((t, i) => (
                  <span key={i} className="tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
