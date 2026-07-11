import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wrench, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = login(email, password);

    if (result.success) {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  // Demo credentials fill karne ke liye
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@maintainiq.com');
      setPassword('admin123');
    } else {
      setEmail('ali@maintainiq.com');
      setPassword('tech123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Wrench className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">MaintainIQ</h1>
          <p className="text-slate-600 mt-2">QR-Based Maintenance Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Admin Login
              </button>
              <button
                onClick={() => fillDemoCredentials('technician')}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Technician Login
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <p><strong>Admin:</strong> admin@maintainiq.com / admin123</p>
              <p><strong>Tech:</strong> ali@maintainiq.com / tech123</p>
            </div>
          </div>
        </div>

        {/* Public Access */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Have a QR code?{' '}
            <button
              onClick={() => navigate('/scan')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Scan to Report Issue
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;