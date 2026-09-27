import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import subscriptionService from "../services/subscriptionService";
import { Crown, Lock } from "lucide-react";

export default function SubscriptionGuard({ children, requiredPlan = "pro" }) {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    setLoading(true);
    try {
      const res = await subscriptionService.getInfo();
      setSubscription(res.data);
      
      const isActive = res.data?.isActive;
      const plan = res.data?.plan;
      
      if (requiredPlan === "pro" && isActive && (plan === "pro" || plan === "enterprise")) {
        setHasAccess(true);
      } else if (requiredPlan === "enterprise" && isActive && plan === "enterprise") {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (err) {
      console.error("خطا:", err);
      setHasAccess(false);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
          <Crown size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">دسترسی محدود</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          برای دسترسی به این بخش، نیاز به خرید اشتراک حرفه‌ای دارید.
          با تهیه اشتراک، به تمام امکانات پیشرفته سیستم دسترسی پیدا می‌کنید.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:scale-105 transition"
          >
            <Crown size={18} />
            خرید اشتراک
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition"
          >
            بازگشت
          </button>
        </div>
        
        {subscription && subscription.plan !== "free" && !subscription.isActive && (
          <p className="text-sm text-yellow-500 mt-4">
            ⚠️ اشتراک شما منقضی شده است. لطفاً برای تمدید اقدام کنید.
          </p>
        )}
      </div>
    );
  }

  return children;
}