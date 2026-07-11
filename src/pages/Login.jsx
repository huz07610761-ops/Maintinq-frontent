import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QrCode, Shield, Wrench, Users, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      desc: 'Manage assets, assign issues, view analytics',
      icon: Shield,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'technician',
      name: 'Technician',
      desc: 'View assigned tasks, update status, add notes',
      icon: Wrench,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'public',
      name: 'Public User',
      desc: 'Scan QR, report issues without login',
      icon: Users,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  const handleLogin = () => {
    if (!selectedRole) return;
    
    if (selectedRole === 'public') {
      navigate('/scan'); 
    } else {
      setUser({ role: selectedRole, name: selectedRole === 'admin' ? 'Admin User' : 'Ali Khan' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <QrCode className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MaintainIQ</h1>
          <p className="text-gray-600">AI-Powered QR Maintenance & Asset History Platform</p>
          <p className="text-sm text-gray-500 mt-2">SMIT Final Hackathon Project</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Select Your Role
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <Icon className={isSelected ? 'text-white' : 'text-gray-600'} size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.desc}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
              selectedRole
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight size={20} />
          </button>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium mb-1">Demo Mode</p>
            <p className="text-xs text-yellow-700">
              No password required. Just select a role to explore the workflow. Data is saved in localStorage.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-6 space-x-4 text-sm">
          <button 
            onClick={() => navigate('/asset/AST-001')}
            className="text-blue-600 hover:underline"
          >
            View Sample Asset Page
          </button>
          <span className="text-gray-400">|</span>
          <button 
            onClick={() => {
              setUser({ role: 'admin', name: 'Demo Admin' });
              navigate('/dashboard');
            }}
            className="text-blue-600 hover:underline"
          >
            Skip to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;