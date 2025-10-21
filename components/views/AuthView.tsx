import React, { useState } from 'react';
import { login, signUp, signInWithGoogle, signInWithGitHub } from '../../services/authService';
import type { User } from '../../types';
import Button from '../common/Button';
import { BrandIcon, GoogleIcon, GitHubIcon } from '../common/Icons';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const authAction = isLogin ? login : signUp;
    const result = authAction(email, password);

    if (result.success && result.user) {
      onAuthSuccess(result.user);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };
  
  const handleSocialLogin = (provider: 'google' | 'github') => {
    const authAction = provider === 'google' ? signInWithGoogle : signInWithGitHub;
    const result = authAction();
    if (result.success && result.user) {
        onAuthSuccess(result.user);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-2">
                <BrandIcon />
                <h1 className="text-2xl font-bold text-white tracking-tight">Ihangire Youth</h1>
            </div>
            <p className="text-slate-400">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email Address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan sm:text-sm"
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-400 text-center bg-red-900/50 py-2 px-3 rounded-md">{error}</p>}

        <div>
          <Button type="submit" isLoading={isLoading} className="w-full">
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
        </div>
      </form>

       <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">OR</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
            >
              <GoogleIcon />
              <span className="ml-2">Google</span>
            </button>
          </div>
          <div>
            <button
              onClick={() => handleSocialLogin('github')}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
            >
              <GitHubIcon />
              <span className="ml-2">GitHub</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={toggleMode} className="font-medium text-brand-cyan hover:text-cyan-400 ml-1">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;