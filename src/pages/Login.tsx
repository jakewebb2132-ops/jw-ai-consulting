import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { jwTheme } from '../theme/jwTheme';
import { LockKey, CircleNotch } from 'phosphor-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuthStore();

  // If already logged in, redirect to dashboard or attempted URL
  useEffect(() => {
    if (session) {
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    }
  }, [session, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
    // Success is handled by the useEffect watching the session state
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-4">
      {/* JW AI Branding Component */}
      <div className="mb-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold tracking-tighter text-white mb-2" style={{ fontFamily: jwTheme.typography.fontHeading }}>JW AI</h1>
        <div className="h-0.5 w-12 bg-zinc-700 rounded-full mb-4" />
        <p className="text-zinc-400 font-medium tracking-widest text-sm uppercase">Restricted Access</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
         {/* Subtle top glow logic matching primary brand color */}
         <div 
           className="absolute top-0 left-0 right-0 h-1 opacity-50" 
           style={{ background: `linear-gradient(90deg, transparent, ${jwTheme.colors.primary}, transparent)` }} 
         />
         
         <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-950/50 border border-red-900/50 text-red-500 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-1.5 border-b border-zinc-800 pb-2 focus-within:border-zinc-500 transition-colors">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-700 font-medium w-full"
                placeholder="admin@jwaiconsulting.com"
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-1.5 border-b border-zinc-800 pb-2 focus-within:border-zinc-500 transition-colors">
               <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Passphrase</label>
               <input 
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-700 font-medium w-full"
                 placeholder="••••••••••••"
                 disabled={isLoading}
               />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all text-white border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                 backgroundColor: jwTheme.colors.primary,
                 borderColor: jwTheme.colors.primary
              }}
            >
               {isLoading ? (
                 <CircleNotch weight="bold" className="animate-spin" size={18} />
               ) : (
                 <LockKey weight="bold" size={18} />
               )}
               {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
         </form>
      </div>

      {/* Footer Text regarding sign ups being restricted */}
      <div className="mt-8 text-center text-xs text-zinc-600">
        System strictly limited to internal JW AI Consulting administration.
      </div>
    </div>
  );
};

export default Login;
