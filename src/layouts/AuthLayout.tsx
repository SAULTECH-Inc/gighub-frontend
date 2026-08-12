import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export function AuthLayout() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden mesh-gradient-auth">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-[120px] opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-[120px] opacity-70" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="relative z-10 w-full flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}
