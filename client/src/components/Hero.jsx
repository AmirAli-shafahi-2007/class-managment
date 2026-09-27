import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Zap, TrendingUp, Star, Sparkles } from "lucide-react";

export default function Hero() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      let animationFrameId;
      let time = 0;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      // کاهش ذرات از ۱۵۰ به ۶۰
      const particles = Array.from({ length: 60 }, () => {
        const baseOpacity = Math.random() * 0.3 + 0.15;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          life: Math.random() * 300,
          maxLife: 300 + Math.random() * 200,
          color:
            Math.random() > 0.6
              ? [139, 92, 246]
              : Math.random() > 0.5
                ? [236, 72, 153]
                : [99, 102, 241],
          opacity: baseOpacity,
          orbit: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() - 0.5) * 0.015,
          orbitRadius: 100 + Math.random() * 400,
        };
      });

      let mouseX = canvas.width / 2;
      let mouseY = canvas.height / 2;
      let targetMouseX = mouseX;
      let targetMouseY = mouseY;

      canvas.addEventListener("mousemove", (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
      });

      function drawGlow(x, y, radius, color, alpha) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(${color}, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      function animate() {
        time++;
        ctx.fillStyle = "rgba(3, 7, 18, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const centerX = canvas.width * 0.35;
        const centerY = canvas.height * 0.45;
        drawGlow(
          centerX,
          centerY,
          300,
          "139, 92, 246",
          0.06 + Math.sin(time * 0.02) * 0.02,
        );
        drawGlow(
          centerX,
          centerY,
          200,
          "236, 72, 153",
          0.04 + Math.cos(time * 0.03) * 0.02,
        );

        particles.forEach((p) => {
          p.orbit += p.orbitSpeed;
          p.x =
            centerX +
            Math.cos(p.orbit) * p.orbitRadius +
            (mouseX - centerX) * 0.2;
          p.y =
            centerY +
            Math.sin(p.orbit) * p.orbitRadius +
            (mouseY - centerY) * 0.2;
          p.life--;
          if (p.life <= 0) {
            p.life = p.maxLife;
            p.orbit = Math.random() * Math.PI * 2;
            p.orbitRadius = 100 + Math.random() * 400;
          }
          const alpha = (p.life / p.maxLife) * p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
          ctx.fill();
          drawGlow(p.x, p.y, p.size * 3, p.color, alpha * 0.15);
        });

        animationFrameId = requestAnimationFrame(animate);
      }

      animate();
      
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resize);
      };
    };

    // با تاخیر ۲۰۰ms اجرا کن تا صفحه اول لود بشه
    const timeout = setTimeout(() => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => initCanvas(), { timeout: 500 });
      } else {
        initCanvas();
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#030712",
      }}
      dir="rtl"
    >
      <style>{`
        @keyframes gradientFlow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulseSlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes floatUp { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { 0%{opacity:0;transform:scale(0.7)rotate(-5deg)} 60%{transform:scale(1.05)rotate(1deg)} 100%{opacity:1;transform:scale(1)rotate(0deg)} }
        @keyframes shimmer { 0%{left:-100%} 100%{left:300%} }
        @keyframes starSpin { 0%{transform:rotate(0deg)scale(1)} 50%{transform:rotate(180deg)scale(1.4)} 100%{transform:rotate(360deg)scale(1)} }
        @keyframes borderPulse { 0%,100%{box-shadow:0 0 30px rgba(139,92,246,.3),0 0 60px rgba(139,92,246,.1)} 50%{box-shadow:0 0 60px rgba(139,92,246,.6),0 0 120px rgba(236,72,153,.3)} }
        @keyframes morphGradient { 0%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} 100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} }
        @keyframes textGlitch { 0%,100%{text-shadow:0 0 20px rgba(139,92,246,.5)} 25%{text-shadow:-2px 0 rgba(236,72,153,.5),2px 0 rgba(99,102,241,.5)} }
        @keyframes scrollDot { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(14px)} }
        @keyframes iconFloat { 0%,100%{transform:translateX(-50%) translateY(0px)} 50%{transform:translateX(-50%) translateY(-8px)} }
        
        .hero-title { font-size: clamp(2.8rem, 8vw, 6rem); font-weight:900; line-height:1.05; letter-spacing:-1px; }
        .hero-subtitle { font-size: clamp(1rem, 2.5vw, 1.35rem); max-width:700px; margin:0 auto; }
        .btn-hero { padding: clamp(15px, 2vw, 22px) clamp(28px, 4vw, 44px); border-radius:18px; font-weight:800; font-size:clamp(.95rem,1.5vw,1.15rem); text-decoration:none; display:inline-flex; align-items:center; gap:12px; transition:all .5s; position:relative; overflow:hidden; cursor:pointer; border:none; }
        .btn-primary-hero { background:linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899,#4f46e5); background-size:400% 400%; animation:gradientFlow 3s ease infinite, borderPulse 3s ease-in-out infinite; color:#fff; box-shadow:0 10px 50px rgba(139,92,246,.4); }
        .btn-primary-hero::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); animation:shimmer 2.5s infinite; }
        .btn-primary-hero:hover { transform:translateY(-6px) scale(1.04); box-shadow:0 20px 60px rgba(139,92,246,.6); }
        .btn-glass-hero { background:rgba(255,255,255,.02); border:1.5px solid rgba(139,92,246,.25); color:#fff; backdrop-filter:blur(30px); }
        .btn-glass-hero:hover { background:rgba(139,92,246,.2); border-color:rgba(139,92,246,.5); transform:translateY(-6px); box-shadow:0 15px 50px rgba(139,92,246,.3); }
        .gradient-text-hero { background:linear-gradient(135deg,#a78bfa,#c084fc,#f9a8d4,#818cf8); background-size:300% 300%; animation:gradientFlow 3s ease infinite; -webkit-background-clip:text; background-clip:text; color:transparent; }
        .morph-orb { animation: morphGradient 8s ease-in-out infinite; }
        
        .stat-card-hero { background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01)); border:1px solid rgba(255,255,255,.06); border-radius:24px; padding:28px 16px 20px; text-align:center; transition:all .5s; backdrop-filter:blur(20px); animation:scaleIn .8s ease-out both; position:relative; overflow:visible; cursor:pointer; margin-top:30px; }
        .stat-card-hero::before { content:''; position:absolute; inset:0; border-radius:24px; opacity:0; transition:opacity .5s; z-index:0; }
        .stat-card-hero.c1::before { background:radial-gradient(circle at center, rgba(59,130,246,.15), transparent 70%); }
        .stat-card-hero.c2::before { background:radial-gradient(circle at center, rgba(139,92,246,.15), transparent 70%); }
        .stat-card-hero.c3::before { background:radial-gradient(circle at center, rgba(245,158,11,.15), transparent 70%); }
        .stat-card-hero.c4::before { background:radial-gradient(circle at center, rgba(16,185,129,.15), transparent 70%); }
        .stat-card-hero::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent); transition:left .7s; z-index:1; }
        .stat-card-hero:hover::before { opacity:1; }
        .stat-card-hero:hover::after { left:200%; }
        .stat-card-hero:hover { transform:translateY(-8px); border-color:rgba(139,92,246,.3); box-shadow:0 25px 50px -15px rgba(0,0,0,.5); }
        .stat-card-hero:nth-child(1){animation-delay:0s} .stat-card-hero:nth-child(2){animation-delay:.15s} .stat-card-hero:nth-child(3){animation-delay:.3s} .stat-card-hero:nth-child(4){animation-delay:.45s}
        
        .stat-icon-float { position:absolute; top:-35px; left:50%; transform:translateX(-50%); width:65px; height:65px; border-radius:20px; display:flex; align-items:center; justify-content:center; z-index:5; transition:all .5s; box-shadow:0 10px 30px -10px rgba(0,0,0,.3); animation:iconFloat 3s ease-in-out infinite; }
        .stat-card-hero:hover .stat-icon-float { transform:translateX(-50%) translateY(-8px) scale(1.1); box-shadow:0 20px 40px -10px rgba(0,0,0,.4); }
        .stat-value { font-size:32px; font-weight:900; color:#fff; margin:8px 0 4px; position:relative; z-index:2; transition:all .5s; }
        .stat-card-hero:hover .stat-value { transform:scale(1.05); }
        .stat-label { font-size:13px; color:#94a3b8; font-weight:500; position:relative; z-index:2; transition:all .3s; }
        .stat-card-hero:hover .stat-label { color:#cbd5e1; }
        
        @media (max-width:640px) { .stat-icon-float{width:50px;height:50px;border-radius:16px;top:-28px} .stat-value{font-size:22px} .stat-label{font-size:10px} .stat-card-hero{padding:24px 10px 16px;margin-top:24px} }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      />

      <div
        className="morph-orb"
        style={{
          position: "absolute",
          width: "min(600px, 90vw)",
          height: "min(600px, 90vw)",
          background:
            "radial-gradient(circle, rgba(139,92,246,.15), transparent 70%)",
          top: "-20%",
          left: "-15%",
          zIndex: 0,
        }}
      />
      <div
        className="morph-orb"
        style={{
          position: "absolute",
          width: "min(500px, 80vw)",
          height: "min(500px, 80vw)",
          background:
            "radial-gradient(circle, rgba(236,72,153,.1), transparent 70%)",
          bottom: "-15%",
          right: "-10%",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1400,
          margin: "0 auto",
          padding: "120px 20px 80px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-start",
            marginBottom: isMobile ? 28 : 36,
            animation: "floatUp .8s ease-out",
          }}
        >
          <span
            style={{
              background: "rgba(139,92,246,.1)",
              border: "1px solid rgba(139,92,246,.25)",
              borderRadius: 50,
              padding: isMobile ? "8px 18px" : "12px 28px",
              fontSize: isMobile ? ".75rem" : ".9rem",
              color: "#c4b5fd",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              animation: "borderPulse 3s ease-in-out infinite",
              backdropFilter: "blur(20px)",
            }}
          >
            <Star
              size={isMobile ? 12 : 16}
              style={{
                color: "#fbbf24",
                fill: "#fbbf24",
                animation: "starSpin 3s linear infinite",
              }}
            />
            نسل جدید مدیریت آموزش
            <Sparkles
              size={isMobile ? 12 : 16}
              style={{
                color: "#fbbf24",
                animation: "starSpin 3s linear infinite reverse",
              }}
            />
          </span>
        </div>

        <div
          style={{
            animation: "floatUp 1s ease-out .2s both",
            textAlign: isMobile ? "center" : "right",
          }}
        >
          <h1
            className="hero-title"
            style={{ marginBottom: isMobile ? 20 : 28 }}
          >
            <span style={{ color: "#f1f5f9" }}>سیستم </span>
            <span className="gradient-text-hero">مدیریت</span>
            <br />
            <span
              className="gradient-text-hero"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              آموزشی
            </span>
            <br />
            <span
              style={{
                color: "#94a3b8",
                fontSize: "clamp(1.5rem, 4vw, 3rem)",
                fontWeight: 700,
              }}
            >
              دبیرا
            </span>
          </h1>
        </div>

        <p
          className="hero-subtitle"
          style={{
            color: "#94a3b8",
            marginBottom: isMobile ? 36 : 48,
            textAlign: isMobile ? "center" : "right",
            animation: "floatUp 1s ease-out .4s both",
            lineHeight: 1.8,
          }}
        >
          مدیریت هوشمند مؤسسات، کلاس‌ها، قراردادها و امور مالی
          <br />
          <span
            style={{
              color: "#64748b",
              fontSize: "clamp(.75rem, 1.5vw, .9rem)",
            }}
          >
            با رابط کاربری حرفه‌ای، گزارشات تحلیلی و امنیت بالا
          </span>
        </p>
        {/* 
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
            marginBottom: isMobile ? 56 : 72,
            justifyContent: isMobile ? "center" : "flex-start",
            animation: "floatUp 1s ease-out .6s both",
          }}
        >
          <a href="/dashboard/register" className="btn-hero btn-primary-hero">
            <Zap
              size={22}
              style={{ animation: "starSpin 4s linear infinite" }}
            />
            شروع رایگان
            <ArrowLeft size={22} />
          </a>
          <a href="#features" className="btn-hero btn-glass-hero">
            <TrendingUp size={22} />
            کشف ویژگی‌های خفن
          </a>
        </div> */}

        {/* CTA + Stats Row */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "center" : "space-between",
            gap: isMobile ? 28 : 36,
            animation: "fadeInUp 0.8s ease-out 0.6s both",
            maxWidth: isMobile ? "100%" : "1150px",
            margin: isMobile ? "0 auto" : "0",
          }}
        >
          {/* دکمه‌های CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              gap: 14,
              flexShrink: 0,
              justifyContent: "center",
            }}
          >
            <a
              href="/dashboard/register"
              style={{
                padding: "16px 32px",
                borderRadius: 16,
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)",
                backgroundSize: "200% 200%",
                animation: "gradientFlow 3s ease infinite",
                color: "#fff",
                boxShadow: "0 8px 35px rgba(139,92,246,0.4)",
                transition: "all 0.4s",
                border: "none",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Zap
                  size={22}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(251,191,36,0.6))",
                  }}
                />
                شروع رایگان
                <ArrowLeft size={20} />
              </span>
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </a>

            <a
              href="#features"
              style={{
                padding: "16px 32px",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1.5px solid rgba(139,92,246,0.25)",
                color: "#e2e8f0",
                backdropFilter: "blur(20px)",
                transition: "all 0.4s",
                cursor: "pointer",
              }}
            >
              <TrendingUp size={22} style={{ color: "#a78bfa" }} />
              کشف ویژگی‌ها
            </a>
          </div>

          {/* کارت‌های آمار */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(4, 1fr)",
              gap: isMobile ? "14px" : "18px",
              flex: 1,
              maxWidth: isMobile ? "100%" : "780px",
            }}
          >
            <style>{`
      .stat-card-v3 {
        background: linear-gradient(160deg, rgba(20, 15, 50, 0.7), rgba(10, 8, 25, 0.5));
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 20px;
        padding: 22px 14px 18px;
        text-align: center;
        transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px);
      }
      
      .stat-card-v3.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .stat-card-v3.show:nth-child(1) { transition-delay: 0s; }
      .stat-card-v3.show:nth-child(2) { transition-delay: 0.12s; }
      .stat-card-v3.show:nth-child(3) { transition-delay: 0.24s; }
      .stat-card-v3.show:nth-child(4) { transition-delay: 0.36s; }
      
      .stat-card-v3::before {
        content: ''; position: absolute; inset: 0; opacity: 0;
        transition: opacity 0.5s; z-index: 0; border-radius: 20px;
      }
      .stat-card-v3.c1::before { background: radial-gradient(circle at 50% 20%, rgba(59,130,246,0.25), transparent 60%); }
      .stat-card-v3.c2::before { background: radial-gradient(circle at 50% 20%, rgba(139,92,246,0.25), transparent 60%); }
      .stat-card-v3.c3::before { background: radial-gradient(circle at 50% 20%, rgba(245,158,11,0.25), transparent 60%); }
      .stat-card-v3.c4::before { background: radial-gradient(circle at 50% 20%, rgba(16,185,129,0.25), transparent 60%); }
      
      .stat-card-v3:hover::before { opacity: 1; }
      .stat-card-v3:hover {
        transform: translateY(-8px) scale(1.04);
        border-color: rgba(139,92,246,0.4);
        box-shadow: 0 25px 50px -15px rgba(0,0,0,0.6), 0 0 35px rgba(139,92,246,0.12);
      }
      
      .stat-icon-v3 {
        width: 50px; height: 50px; border-radius: 15px;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 14px; position: relative; z-index: 2;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      }
      
      .stat-card-v3:hover .stat-icon-v3 {
        transform: scale(1.2) rotate(-5deg);
        box-shadow: 0 8px 30px currentColor;
      }
      
      .stat-val-v3 { font-size: 32px; font-weight: 900; color: #fff; margin-bottom: 4px; position: relative; z-index: 2; transition: all 0.4s; letter-spacing: -0.5px; }
      .stat-card-v3:hover .stat-val-v3 { transform: scale(1.06); }
      
      .stat-lbl-v3 { font-size: 12px; color: #94a3b8; font-weight: 600; position: relative; z-index: 2; transition: all 0.3s; }
      .stat-card-v3:hover .stat-lbl-v3 { color: #e2e8f0; }
      
      .stat-dot-v3 {
        position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
        width: 5px; height: 5px; border-radius: 50%; z-index: 2;
        transition: all 0.5s; opacity: 0.3;
      }
      .stat-card-v3:hover .stat-dot-v3 { opacity: 1; box-shadow: 0 0 12px currentColor, 0 0 25px currentColor; }
      
      @media (max-width: 640px) {
        .stat-card-v3 { padding: 16px 8px 14px; border-radius: 16px; }
        .stat-icon-v3 { width: 40px; height: 40px; border-radius: 12px; margin-bottom: 10px; }
        .stat-val-v3 { font-size: 22px; }
        .stat-lbl-v3 { font-size: 10px; }
      }
    `}</style>

            {[
              {
                label: "مؤسسه فعال",
                value: "+۵۰",
                color: "#3b82f6",
                bg: "linear-gradient(135deg, #3b82f6, #2563eb)",
                shadow: "rgba(59,130,246,0.4)",
                class: "c1",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 22h20" />
                    <path d="M5 22V6l7-3v19" />
                    <path d="M19 22V10l-6-3" />
                    <circle
                      cx="9"
                      cy="12"
                      r="1.5"
                      fill="white"
                      stroke="none"
                      opacity="0.6"
                    />
                    <circle
                      cx="15"
                      cy="9"
                      r="1.5"
                      fill="white"
                      stroke="none"
                      opacity="0.6"
                    />
                    <circle
                      cx="12"
                      cy="17"
                      r="1.5"
                      fill="white"
                      stroke="none"
                      opacity="0.6"
                    />
                  </svg>
                ),
              },
              {
                label: "کلاس برگزار شده",
                value: "+۱۰۰۰",
                color: "#8b5cf6",
                bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                shadow: "rgba(139,92,246,0.4)",
                class: "c2",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10.5L12 15L2 10.5L12 6L22 10.5Z" />
                    <path d="M6 12.5V17C6 18.5 8 20 12 20C16 20 18 18.5 18 17V12.5" />
                    <circle
                      cx="12"
                      cy="2"
                      r="2"
                      fill="white"
                      stroke="none"
                      opacity="0.4"
                    />
                    <circle cx="12" cy="2" r="0.8" fill="white" stroke="none" />
                  </svg>
                ),
              },
              {
                label: "رضایت کاربران",
                value: "۹۸٪",
                color: "#f59e0b",
                bg: "linear-gradient(135deg, #f59e0b, #d97706)",
                shadow: "rgba(245,158,11,0.4)",
                class: "c3",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      fill="white"
                      stroke="none"
                      opacity="0.3"
                    />
                  </svg>
                ),
              },
              {
                label: "پشتیبانی ۲۴/۷",
                value: "۲۴/۷",
                color: "#10b981",
                bg: "linear-gradient(135deg, #10b981, #059669)",
                shadow: "rgba(16,185,129,0.4)",
                class: "c4",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                    <circle
                      cx="12"
                      cy="12"
                      r="2"
                      fill="white"
                      stroke="none"
                      opacity="0.4"
                    />
                    <path
                      d="M5 3L2 6M19 3l3 3M5 21l-3-3M19 21l3-3"
                      strokeWidth="1.2"
                      opacity="0.5"
                    />
                  </svg>
                ),
              },
            ].map((s, i) => (
              <div key={i} className={`stat-card-v3 ${s.class} show`}>
                <div
                  className="stat-icon-v3"
                  style={{
                    background: s.bg,
                    boxShadow: `0 6px 20px ${s.shadow}`,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  className="stat-val-v3"
                  style={{ textShadow: `0 0 25px ${s.color}40` }}
                >
                  {s.value}
                </div>
                <div className="stat-lbl-v3">{s.label}</div>
                <div
                  className="stat-dot-v3"
                  style={{ background: s.color, color: s.color }}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "pulseSlow 2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: 32,
              height: 50,
              borderRadius: 16,
              border: "2px solid rgba(139,92,246,.4)",
              display: "flex",
              justifyContent: "center",
              paddingTop: 8,
            }}
          >
            <div
              style={{
                width: 5,
                height: 12,
                borderRadius: 3,
                background: "#a78bfa",
                animation: "scrollDot 1.5s ease-in-out infinite",
                boxShadow: "0 0 10px rgba(139,92,246,.5)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
