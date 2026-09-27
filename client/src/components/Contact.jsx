import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Shield,
  Zap,
  Sparkles,
  CheckCircle,
  Coffee,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      const rect = sectionRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);
    const nodes = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 250) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 250)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await sendMessage(form);
    toast.success('پیام با موفقیت ارسال شد! 🎉');
    setForm({ name: '', email: '', subject: '', message: '' });
  } catch (err) {
    toast.error('خطا در ارسال پیام');
  }
  setLoading(false);
};

  const contactWays = [
    {
      icon: <Phone size={16} />,
      label: "0994-406-0815",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      href: "tel:09123456789",
    },
    {
      icon: <Mail size={16} />,
      label: "info@academy.ir",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      href: "mailto:info@academy.ir",
    },
    {
      icon: <MapPin size={16} />,
      label: "مشهد",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      href: "#",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "clamp(60px, 8vw, 100px) 0",
        backgroundColor: "#030712",
        overflow: "hidden",
      }}
      dir="rtl"
    >
      <style>{`
        @keyframes gradientFlow { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { left: -150%; } 100% { left: 200%; } }
        @keyframes morphOrb { 0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; } }
        
        .card-glass {
          background: linear-gradient(160deg, rgba(25,20,50,0.6), rgba(10,8,22,0.8));
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 28px; backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .card-glass:hover { border-color: rgba(139,92,246,0.25); box-shadow: 0 25px 50px -20px rgba(0,0,0,0.5); }
        
        .input-glass {
          width: 100%; background: rgba(15,20,40,0.6);
          border: 1.5px solid rgba(255,255,255,0.05);
          color: #e2e8f0; border-radius: 14px;
          padding: clamp(12px, 2vw, 14px) clamp(14px, 2.5vw, 18px);
          font-size: clamp(0.82rem, 1.4vw, 0.9rem);
          text-align: right; outline: none; transition: all 0.3s ease;
        }
        .input-glass:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 4px rgba(139,92,246,0.06); background: rgba(15,20,40,0.9); }
        .input-glass::placeholder { color: rgba(255,255,255,0.08); font-size: clamp(0.78rem, 1.3vw, 0.85rem); }
        
        .btn-gradient {
          padding: clamp(13px, 2vw, 15px) clamp(24px, 4vw, 32px); border-radius: 14px; border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef);
          background-size: 200% 200%; animation: gradientFlow 4s ease infinite;
          color: #fff; font-weight: 700; font-size: clamp(0.88rem, 1.5vw, 0.95rem);
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.4s; position: relative; overflow: hidden;
          box-shadow: 0 10px 35px rgba(139,92,246,0.3);
        }
        .btn-gradient::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.6s; }
        .btn-gradient:hover::after { left: 200%; }
        .btn-gradient:hover { transform: translateY(-3px); box-shadow: 0 20px 50px rgba(139,92,246,0.45); }
        
        .gradient-text-new {
          background: linear-gradient(135deg, #a78bfa, #c084fc, #f9a8d4);
          background-size: 300% 300%; animation: gradientFlow 3s ease infinite;
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        
        .contact-way-item {
          display: flex; align-items: center; gap: clamp(10px, 2vw, 14px);
          padding: clamp(10px, 1.8vw, 14px) clamp(12px, 2vw, 18px);
          border-radius: 16px; transition: all 0.3s; cursor: pointer; text-decoration: none;
        }
        .contact-way-item:hover { background: rgba(139,92,246,0.06); }
        
        .morph-orb-new { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%); pointer-events: none; animation: morphOrb 10s ease-in-out infinite; }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="morph-orb-new" style={{ top: "-10%", right: "-5%" }} />
      <div
        className="morph-orb-new"
        style={{
          bottom: "-10%",
          left: "-5%",
          animationDelay: "-5s",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)",
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
            marginBottom: "clamp(40px, 6vw, 60px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              💬
            </span>
            <span
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                animation: "float 3s ease-in-out 0.5s infinite",
              }}
            >
              ✨
            </span>
            <span
              style={{
                fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                animation: "float 3s ease-in-out 1s infinite",
              }}
            >
              🚀
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
              fontWeight: 900,
              marginBottom: 16,
              color: "#fff",
              letterSpacing: -1,
            }}
          >
            بیا <span className="gradient-text-new">با هم صحبت</span> کنیم!
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(0.88rem, 1.6vw, 1.05rem)",
              maxWidth: 450,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            منتظر شنیدن صدای گرمت هستیم 😊
          </p>
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
            gap: "clamp(16px, 3vw, 28px)",
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {contactWays.map((way, i) => (
              <a
                key={i}
                href={way.href}
                className="contact-way-item"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div
                  style={{
                    width: "clamp(36px, 7vw, 42px)",
                    height: "clamp(36px, 7vw, 42px)",
                    borderRadius: 13,
                    background: way.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: way.color,
                    flexShrink: 0,
                  }}
                >
                  {way.icon}
                </div>
                <span
                  style={{
                    color: "#d1d5db",
                    fontSize: "clamp(0.8rem, 1.4vw, 0.9rem)",
                  }}
                >
                  {way.label}
                </span>
              </a>
            ))}

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.03)",
                margin: "12px 0",
              }}
            />

            <div
              style={{
                padding: "clamp(10px, 2vw, 14px) clamp(12px, 2vw, 18px)",
                borderRadius: 16,
                background: "rgba(16,185,129,0.04)",
                border: "1px solid rgba(16,185,129,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10b981",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    color: "#10b981",
                    fontSize: "clamp(0.75rem, 1.3vw, 0.82rem)",
                    fontWeight: 600,
                  }}
                >
                  آنلاین هستیم
                </span>
              </div>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "clamp(0.7rem, 1.2vw, 0.78rem)",
                  lineHeight: 1.6,
                }}
              >
                شنبه تا پنجشنبه
                <br />۹ صبح تا ۸ شب
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {[
                { icon: <Shield size={14} />, text: "امن", color: "#10b981" },
                { icon: <Zap size={14} />, text: "سریع", color: "#f59e0b" },
                {
                  icon: <Coffee size={14} />,
                  text: "دوستانه",
                  color: "#8b5cf6",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "clamp(8px, 1.5vw, 10px)",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.03)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ color: b.color, marginBottom: 4 }}>
                    {b.icon}
                  </div>
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "clamp(0.65rem, 1.1vw, 0.7rem)",
                    }}
                  >
                    {b.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div
            className="card-glass"
            style={{ padding: "clamp(22px, 4vw, 32px) clamp(18px, 3vw, 28px)" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: "clamp(38px, 7vw, 44px)",
                  height: "clamp(38px, 7vw, 44px)",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 25px rgba(139,92,246,0.25)",
                }}
              >
                <MessageSquare size={20} style={{ color: "#fff" }} />
              </div>
              <div>
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
                  }}
                >
                  پیام بذار برامون
                </h3>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "clamp(0.68rem, 1.1vw, 0.73rem)",
                  }}
                >
                  قول می‌دیم زود جواب بدیم 🤞
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <input
                type="text"
                placeholder="اسمت رو بگو *"
                className="input-glass"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 12,
                }}
              >
                <input
                  type="email"
                  placeholder="ایمیلت *"
                  className="input-glass"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  dir="ltr"
                />
                <input
                  type="text"
                  placeholder="موضوع *"
                  className="input-glass"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  required
                />
              </div>

              <textarea
                rows={4}
                placeholder="هر چی دوست داری بهمون بگو... *"
                className="input-glass"
                style={{ resize: "none", minHeight: 100 }}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />

              <button type="submit" className="btn-gradient" disabled={loading}>
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />{" "}
                    صبر کن...
                  </>
                ) : (
                  <>
                    <Send size={18} /> بفرست بره!
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
