import { Navigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

export default function ProtectedRoute({ children, page }) {
  const { canAccess, loading } = useSubscription();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!canAccess(page)) {
    console.log(`Access denied to: ${page}, redirecting to /pricing`);
    return <Navigate to="/pricing" replace />;
  }

  return children;
}