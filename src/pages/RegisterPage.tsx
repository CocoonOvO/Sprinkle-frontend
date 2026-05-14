import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SprinkleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-vanilla-50/50 via-cream-100 to-strawberry-50/30" />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '8%', animationDelay: '0.3s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '18%', animationDelay: '1.3s' }} />
      <div className="sprinkle-particle sprinkle-particle-2" style={{ left: '30%', animationDelay: '0.8s' }} />
      <div className="sprinkle-particle sprinkle-particle-5" style={{ left: '45%', animationDelay: '2.3s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '60%', animationDelay: '1.8s' }} />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '75%', animationDelay: '3.3s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '85%', animationDelay: '2.8s' }} />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-vanilla-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-tl from-strawberry-200/30 to-transparent rounded-full blur-3xl" />
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('密码长度至少为6位');
      return;
    }

    try {
      await register({
        username: formData.username,
        display_name: formData.display_name,
        password: formData.password,
      });
      navigate('/');
    } catch {
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <SprinkleBackground />

      <div className="relative z-10 w-full max-w-md">
        <div className="card-sprinkle rounded-3xl p-8 animate-slide-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-strawberry-400 to-strawberry-500 flex items-center justify-center mb-4 shadow-lg hover-lift" style={{ boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)' }}>
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-chocolate-600">创建账户</h1>
            <p className="text-chocolate-400 mt-1">加入 Sprinkle 开始聊天</p>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 animate-slide-in">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-chocolate-500 mb-1.5">用户名</label>
              <Input
                name="username"
                placeholder="选择用户名"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="input-sprinkle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate-500 mb-1.5">显示名称</label>
              <Input
                name="display_name"
                placeholder="输入显示名称"
                value={formData.display_name}
                onChange={handleChange}
                autoComplete="name"
                className="input-sprinkle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate-500 mb-1.5">密码</label>
              <Input
                name="password"
                type="password"
                placeholder="设置密码"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="input-sprinkle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chocolate-500 mb-1.5">确认密码</label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="input-sprinkle"
              />
            </div>
            <Button type="submit" className="w-full btn-sprinkle mt-2" loading={isLoading}>
              注册
            </Button>
          </form>

          <p className="text-center text-sm text-chocolate-400 mt-6">
            已有账户？{' '}
            <Link to="/login" className="text-strawberry-500 hover:text-strawberry-600 font-semibold transition-colors">
              返回登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
