import { Lock, Crown } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { Link } from 'react-router-dom';

export default function LockedOverlay({ page, children }) {
  const { canAccess, plan, isActive } = useSubscription();

  if (canAccess(page)) {
    return children;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* محتوای تار */}
      <div style={{ filter: 'blur(6px)', opacity: 0.25, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(4px)',
        zIndex: 20, gap: 24, padding: 24, textAlign: 'center'
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))',
          border: '2px solid rgba(139,92,246,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={32} style={{ color: '#c4b5fd' }} />
        </div>

        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.4rem', marginBottom: 8 }}>این بخش قفل شده! 🔒</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 380, lineHeight: 1.7 }}>
            {!isActive 
              ? 'اشتراک شما منقضی شده. برای دسترسی به این بخش، اشتراک خود را تمدید کنید.'
              : 'این ویژگی در پلن رایگان در دسترس نیست. با ارتقا به پلن حرفه‌ای، به همه امکانات دسترسی پیدا کنید.'}
          </p>
        </div>

        <Link to="/pricing" style={{
          padding: '14px 32px', borderRadius: 14,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)',
          color: '#fff', fontWeight: 700, fontSize: '0.95rem',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 30px rgba(139,92,246,0.3)'
        }}>
          <Crown size={18} />
          {isActive ? 'ارتقا به حرفه‌ای' : 'تمدید اشتراک'}
        </Link>
      </div>
    </div>
  );
}