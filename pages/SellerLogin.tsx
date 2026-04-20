import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginSeller } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';

const SellerLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginSeller({ email, password });

            if (response.success && response.data) {
                // Use the context login to update state everywhere
                login(response.data.token, response.data.role);

                // Redirect based on role
                if (response.data.role === 'admin') {
                    navigate('/admin');
                } else {
                  navigate('/bulk-order');
                }
            }
        } catch (err: any) {
      if (err.status === 403) {
        // Not approved
        setStatusMessage(err.message);
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Store
          </Link>
          <div className="w-14 h-14 mx-auto mb-6 bg-[#111111] rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111] mb-3">
            Seller <span className="font-serif italic text-gray-400">Portal</span>
          </h1>
          <p className="text-gray-500 font-light text-sm">
            Sign in to access your seller dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
          {/* Error alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Status message (pending/rejected) */}
          {statusMessage && (
            <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{statusMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#6B8E23] rounded-lg py-3.5 px-4 text-sm outline-none transition-all duration-300 placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(107,142,35,0.08)]"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-[#6B8E23] rounded-lg py-3.5 px-4 pr-11 text-sm outline-none transition-all duration-300 placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(107,142,35,0.08)]"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#111111] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Want to become a seller?{' '}
              <Link to="/become-seller" className="text-[#6B8E23] hover:underline font-medium">
                Apply here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerLogin;
