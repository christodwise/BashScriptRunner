import React, { useState } from 'react';
import { LockIcon, ShieldIcon } from './Icons';

interface LoginProps {
  onLogin: (user: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(username);
    } else {
      setError('Invalid credentials (try admin/admin)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 p-3 rounded-full">
            <ShieldIcon className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Bash Script Runner</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Secure Gateway Access</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <LockIcon className="absolute right-3 top-3.5 w-5 h-5 text-slate-600" />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-emerald-900/20"
          >
            Authenticate
          </button>
        </form>
        
        <div className="mt-6 text-center text-slate-600 text-xs">
          Restricted System. Authorized Personnel Only.
        </div>
      </div>
    </div>
  );
};

export default Login;
