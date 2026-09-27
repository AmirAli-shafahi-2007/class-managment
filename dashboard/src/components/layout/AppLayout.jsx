import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const sidebarWidth = collapsed ? "5rem" : "16rem";

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-[#030712]" dir="rtl">
      <style>{`
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes overlayFadeIn { from{opacity:0} to{opacity:1} }

        .bg-animated{
          position:absolute;inset:0;z-index:0;
          background:linear-gradient(135deg,#030712,#06061a,#0a0a28,#0d0d2a,#08081a,#030712);
          background-size:500% 500%;animation:gradient-shift 20s ease infinite;
        }

        .mobile-overlay {
          position:fixed;inset:0;background:rgba(0,0,0,0.6);
          backdrop-filter:blur(4px);z-index:45;
          animation:overlayFadeIn 0.3s ease;
        }

        .sidebar-mobile-wrapper {
          position:fixed;right:0;top:0;height:100vh;z-index:55;
          animation:slideIn 0.3s ease;
          padding-top: 0 !important;
        }

        /* Force sidebar to show and be on top */
        .sidebar-mobile-wrapper .sidebar-container {
          transform: translateX(0) !important;
          z-index: 55 !important;
          padding-top: 0 !important;
        }
        
        /* Logo section margin fix */
        .sidebar-mobile-wrapper .logo-section {
          padding-top: 1rem !important;
        }

        .main-content {
          position:relative;z-index:10;min-height:100vh;
          padding-top:4rem;padding-left:1rem;padding-right:1rem;
          transition:margin-right 0.4s;
        }
      `}</style>

      {/* پس‌زمینه */}
      <div className="bg-animated" />

      {/* ====== دسکتاپ: سایدبار همیشه هست ====== */}
      {!isMobile && (
        <Sidebar 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(!collapsed)} 
        />
      )}

      {/* ====== موبایل/تبلت: سایدبار با wrapper و z-index بالاتر ====== */}
      {isMobile && mobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="sidebar-mobile-wrapper">
            <Sidebar 
              collapsed={false} 
              onToggle={() => setMobileMenuOpen(false)} 
            />
          </div>
        </>
      )}

      {/* ====== تاپبار ====== */}
      <Topbar 
        collapsed={collapsed} 
        onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)}
        isMobile={isMobile}
      />
      
      {/* ====== محتوای اصلی ====== */}
      <main 
        className="main-content"
        style={{ marginRight: isMobile ? '0' : sidebarWidth }}
      >
        <Outlet />
      </main>
    </div>
  );
}