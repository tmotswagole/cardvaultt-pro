import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

const Login: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('username', employeeId);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      const { access_token } = response.data;

      const userResponse = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      setAuth(userResponse.data, access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-ab-navy flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute -top-20 -left-20 w-80 h-80 bg-ab-red rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-ab-red rounded-full blur-3xl"></div>
        </div>
        <div className="z-10 text-center">
          <div className="mb-8 inline-block bg-white rounded-lg p-4">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmqRvMpyn07ZR3Mjpf3sok8GOofsyS3mqhgw&s" alt="Access Bank" className="h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">More Than Banking</h1>
          <p className="text-xl text-white/70">CardVault Pro Operations Control Panel</p>
          <div className="mt-12 h-1 w-24 bg-ab-red mx-auto"></div>
        </div>
        <div className="absolute bottom-8 text-white/30 text-xs">
          © 2026 Access Bank Botswana | Strictly Internal
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 flex justify-center">
             <img src="https://wp.logos-download.com/wp-content/uploads/2023/02/Access_Bank_PLC_Logo.png" alt="Access Bank" className="h-10" />
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-ab-navy mb-2">Staff Sign In</h2>
            <p className="text-ab-text-light text-sm">Please enter your credentials to access the system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div aria-live="assertive">
              {error && (
                <div className="bg-ab-red-light border border-ab-red/20 text-ab-red px-4 py-3 rounded-md text-sm mb-6 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="employeeId" className="block text-sm font-semibold text-ab-navy mb-2">
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                required
                className="input-field"
                placeholder="e.g. ACC001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                aria-label="Employee ID"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-ab-navy">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-ab-red hover:underline font-medium"
                  onClick={() => alert('Please contact IT Support at ext. 1234')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ab-muted hover:text-ab-navy"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center h-11"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <footer className="mt-16 pt-8 border-t border-ab-border flex flex-col items-center gap-2">
             <p className="text-[10px] text-ab-muted uppercase tracking-widest font-semibold">
               CardVault Pro | Access Bank Botswana
             </p>
             <p className="text-[10px] text-ab-muted">
               Version 1.0.0 | Internal System
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

const AlertTriangle: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
  </svg>
);

export default Login;
