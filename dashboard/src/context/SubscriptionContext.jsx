import { createContext, useContext, useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    try {
      const res = await subscriptionService.getInfo();
      setSubscription(res?.data || res || null);
    } catch (e) {
      console.error('Subscription load error:', e);
      setSubscription(null);
    }
    setLoading(false);
  }

  const isActive = subscription?.isActive === true;
  const plan = subscription?.plan || 'free';
  const remainingDays = subscription?.remainingDays || 0;

  // دسترسی‌ها
  const permissions = {
    free: ['dashboard', 'pricing', 'settings', 'notifications', 'todo'],
    pro: ['dashboard', 'companies', 'contracts', 'classes', 'calendar', 'todo', 'finance', 'invoices', 'reports', 'pricing', 'settings', 'notifications'],
    enterprise: ['dashboard', 'companies', 'contracts', 'classes', 'calendar', 'todo', 'finance', 'invoices', 'reports', 'pricing', 'settings', 'notifications'],
    expired: ['pricing', 'settings', 'notifications'],
  };

  const currentPlan = isActive ? plan : 'expired';
  const allowedPages = permissions[currentPlan] || permissions.expired;

  const canAccess = (page) => {
    console.log(`Checking access for ${page}: plan=${currentPlan}, isActive=${isActive}, allowed=${allowedPages.includes(page)}`);
    return allowedPages.includes(page);
  };

  const canCreate = (feature) => {
    if (!isActive) return false;
    if (plan === 'free') {
      return ['todo'].includes(feature);
    }
    return true;
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription, loading, isActive, plan, remainingDays,
      canAccess, canCreate, allowedPages, reload: loadSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);