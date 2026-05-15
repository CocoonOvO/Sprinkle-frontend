import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const SprinkleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50-50 via-pink-50/30 to-blue-100/40" />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '10%', animationDelay: '0s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '25%', animationDelay: '1s' }} />
      <div className="sprinkle-particle sprinkle-particle-5" style={{ left: '40%', animationDelay: '0.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-2" style={{ left: '55%', animationDelay: '2s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '70%', animationDelay: '1.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '85%', animationDelay: '3s' }} />
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <SprinkleBackground />

      <div className="relative z-10 text-center animate-float">
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl hover-lift" style={{ boxShadow: '0 12px 32px rgba(236, 72, 153, 0.4)' }}>
          <span className="text-white font-bold text-5xl">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-600 mb-2">页面未找到</h1>
        <p className="text-slate-400 mb-8">抱歉，您访问的页面不存在</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 btn-sprinkle text-white rounded-xl"
        >
          <Home className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
};
