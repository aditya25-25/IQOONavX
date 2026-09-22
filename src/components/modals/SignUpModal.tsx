import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SignUpModal: React.FC = () => {
  const { isAuthModalOpen, authModalType, closeAuthModal, openAuthModal, signUpMock } = useAuth();
  const isOpen = isAuthModalOpen && authModalType === 'signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please complete all registration fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signUpMock(name, email);
      setSuccess(true);
    } catch {
      setError('Failed to create account. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAuthModal}
      title="Join iQOO NavX"
      subtitle="Unlock Monster Mode precision navigation & offline maps"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Prototype Banner */}
        <div className="p-3 rounded-xl bg-[#FFC800]/10 border border-[#FFC800]/25 flex items-start gap-2.5 text-xs text-[#FFC800]">
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#FFC800]" />
          <div>
            <span className="font-bold">Prototype Mode:</span> Accounts created here will be stored in your browser session for this demo session.
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
            <span>Account created! Initializing NavX Monster Core...</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-1">
            Pilot Name / Call-Sign
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E95A5]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ApexPilot_77"
              className="w-full bg-[#161922] border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder:text-[#5B6275] focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-colors"
              required
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E95A5]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pilot@iqoo.dev"
              className="w-full bg-[#161922] border border-white/10 rounded-xl px-10 py-2.5 text-sm text-white placeholder:text-[#5B6275] focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-colors"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E95A5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full bg-[#161922] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder:text-[#5B6275] focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E95A5] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-1">
              Confirm Pass
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E95A5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat pass"
                className="w-full bg-[#161922] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[#5B6275] focus:outline-none focus:border-[#FFC800] focus:ring-1 focus:ring-[#FFC800] transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#FFC800] hover:bg-[#FFE043] text-black font-bold text-sm tracking-wide transition-all shadow-glow-yellow-sm active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Create NavX Account'
            )}
          </button>
        </div>

        {/* Switch to Sign In */}
        <div className="text-center pt-2 text-xs text-[#8E95A5]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="text-[#FFC800] font-semibold hover:underline"
          >
            Sign In here
          </button>
        </div>
      </form>
    </Modal>
  );
};
