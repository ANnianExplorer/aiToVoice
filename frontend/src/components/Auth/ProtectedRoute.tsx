import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Spin } from 'antd';
import { useState, useEffect } from 'react';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onHydrate(() => setHydrated(false));
    const unsubFinish = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated, set immediately
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => { unsub(); unsubFinish(); };
  }, []);

  if (!hydrated) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
