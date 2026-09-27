import { Lock } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export default function DisabledButton({ feature, children, className, style, onClick, ...props }) {
  const { canCreate, plan, isActive } = useSubscription();
  const navigate = useNavigate();

  if (canCreate(feature)) {
    return (
      <button className={className} style={style} onClick={onClick} {...props}>
        {children}
      </button>
    );
  }

  return (
    <button 
      className={className}
      style={{ ...style, opacity: 0.45, cursor: 'not-allowed' }}
      onClick={() => navigate('/pricing')}
      title={!isActive ? 'اشتراک شما غیرفعال است' : 'نیاز به اشتراک حرفه‌ای'}
      {...props}
    >
      <Lock size={16} style={{ marginRight: 6 }} />
      {children}
      <span style={{ fontSize: '0.7rem', marginRight: 6, opacity: 0.7 }}>
        ({!isActive ? 'تمدید' : 'ارتقا'})
      </span>
    </button>
  );
}