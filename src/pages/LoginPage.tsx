import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SprinkleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cream-50 via-strawberry-50/30 to-vanilla-100/40" />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '5%', animationDelay: '0s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '15%', animationDelay: '1s' }} />
      <div className="sprinkle-particle sprinkle-particle-5" style={{ left: '25%', animationDelay: '0.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-2" style={{ left: '40%', animationDelay: '2s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '55%', animationDelay: '1.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '70%', animationDelay: '3s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '80%', animationDelay: '2.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-5" style={{ left: '90%', animationDelay: '4s' }} />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-strawberry-200/40 to-strawberry-100/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-vanilla-200/40 to-vanilla-100/20 rounded-full blur-3xl" />
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch {
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <SprinkleBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="card-sprinkle rounded-3xl p-8 animate-slide-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-strawberry-400 to-strawberry-500 flex items-center justify-center mb-4 shadow-lg hover-lift" style={{ boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)' }}>
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-chocolate-600">欢迎回来</h1>
            <p className="text-chocolate-400 mt-1">登录您的 Sprinkle 账户</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 animate-slide-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-chocolate-500 mb-1.5">用户名</label>
              <Input
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) clearError();
                }}
                autoComplete="username"
                className="input-sprinkle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate-500 mb-1.5">密码</label>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                autoComplete="current-password"
                className="input-sprinkle"
              />
            </div>
            <Button type="submit" className="w-full btn-sprinkle" loading={isLoading}>
              登录
            </Button>
          </form>

          <p className="text-center text-sm text-chocolate-400 mt-6">
            还没有账户？{' '}
            <Link to="/register" className="text-strawberry-500 hover:text-strawberry-600 font-semibold transition-colors hover-underline">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
