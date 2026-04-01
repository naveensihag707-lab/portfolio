import { useState, useEffect } from 'react';
import { loginWithGoogle } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full glass p-12 rounded-[40px] relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-accent">
          <User size={40} />
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-4">Welcome Back</h1>
        <p className="text-foreground/60 mb-12 leading-relaxed">
          Sign in to access your dashboard and manage your portfolio experience.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm flex items-center gap-3">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-accent text-background font-bold rounded-2xl hover:glow-shadow transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-background/10 border-t-background rounded-full animate-spin" />
          ) : (
            <>
              Sign in with Google <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="mt-8 pt-8 border-t border-glass-border">
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-medium text-foreground/40 hover:text-accent transition-colors"
          >
            Back to Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}
