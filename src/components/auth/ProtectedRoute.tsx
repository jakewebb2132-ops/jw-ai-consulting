import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { CircleNotch } from 'phosphor-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isInitialized } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    // Show a minimalist loading state while Supabase checks the session token
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <CircleNotch weight="bold" size={32} className="animate-spin text-zinc-600 mb-4" />
        <p className="text-sm font-medium tracking-widest uppercase">Authenticating</p>
      </div>
    );
  }

  if (!session) {
    // Force a hard redirect to the login gate, preserving the attempted destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
