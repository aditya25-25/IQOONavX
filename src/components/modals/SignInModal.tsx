import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const SignInModal: React.FC = () => {
  const { isAuthModalOpen, authModalType, closeAuthModal, openAuthModal, signInMock } = useAuth();
  const isOpen = isAuthModalOpen && authModalType === 'signin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await signInMock(email);
      setSuccess(true);
    } catch {
      setError('Failed to sign in. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('pilot.iqoo@matrix.dev');
    setPassword('MonsterPass144Hz!');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAuthModal}
      title="Sign In to iQOO NavX"
      subtitle="Access synced telemetry, custom monster HUDs & offline routes"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prototype Mode Notice */}
        <div className="p-3 rounded-xl bg-[#FFC800]/10 border border-[#FFC800]/25 flex items-start gap-2.5 text-xs text-[#FFC800]">
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#FFC800]" />
          <div>
            <span className="font-bold">Prototype Mode:</span> Authentication is prepared for Supabase connection. Any mock email will activate the demo pilot session.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pilot Authenticated. Initializing Monster Telemetry...</span>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-1.5">
            Pilot Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E95A5]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pilot@iqoo-navx.dev"
              className="w-full bg-[#161922] border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder:text-[#5B6275] focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-colors"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#8E95A5] uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert('Demo prototype: Use any password or click "Quick Fill Demo".')}
              className="text-xs text-[#FFC800] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E95A5]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#161922] border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder:text-[#5B6275] focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E95A5] hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-sm tracking-wide transition-all shadow-glow-yellow-sm active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In to NavX'
            )}
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#8E95A5] hover:text-white font-mono transition-colors"
          >
            ⚡ Quick Fill Demo Credentials
          </button>
        </div>

        {/* Switch to Sign Up */}
        <div className="text-center pt-2 text-xs text-[#8E95A5]">
          New to iQOO NavX?{' '}
          <button
            type="button"
            onClick={() => openAuthModal('signup')}
            className="text-[#FFC800] font-semibold hover:underline"
          >
            Create Pilot Account
          </button>
        </div>
      </form>
    </Modal>
  );
};
