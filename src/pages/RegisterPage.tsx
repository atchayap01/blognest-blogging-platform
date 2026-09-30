import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register(name.trim(), email.trim(), password, confirmPassword);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-md">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center text-white mx-auto shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-stone-500 font-serif italic">
            Join BlogNest to start publishing articles and joining discussions
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="regName" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              Full Name
            </label>
            <input
              id="regName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Maya Lin"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div>
            <label htmlFor="regEmail" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              Email Address
            </label>
            <input
              id="regEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="maya@example.com"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div>
            <label htmlFor="regPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              Password (min 6 characters)
            </label>
            <input
              id="regPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div>
            <label htmlFor="regConfirmPassword" className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
              Confirm Password
            </label>
            <input
              id="regConfirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Hashing password & saving to MongoDB...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-800 hover:underline">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
