'use client';

import { Shield, Zap, TrendingUp, Lock } from 'lucide-react';
import { useLocation } from 'react-router';

export default function AuthVisual() {

  const location = useLocation();
  const isLogin = location.pathname.includes('/login');

  const features = isLogin
    ? [
        { icon: Shield, title: 'Secure Login', description: 'Bank-level security for your account' },
        { icon: Zap, title: 'Instant Access', description: 'Get started in seconds' },
        { icon: TrendingUp, title: 'Real-time Data', description: 'Live credit intelligence' },
      ]
    : [
        { icon: Lock, title: 'Data Privacy', description: 'Your transaction data is protected' },
        { icon: Zap, title: 'Quick Setup', description: 'Start in just a few minutes' },
        { icon: TrendingUp, title: 'Growth Ready', description: 'Unlock financing opportunities' },
      ];

  return (
    <div className="h-full flex flex-col justify-between bg-gradient-to-br from-[#F15A22] to-[#D64919] p-8 sm:p-12 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center backdrop-blur-sm">
              <img src='/Images/logo-only.png'/>
            </div>
            <span className="text-2xl font-bold">PayBaba</span>
          </div>
          <p className="text-white/80 text-sm max-w-xs">
            AI-Powered Credit Intelligence for MSMEs
          </p>
        </div>

        {/* Main Message */}
        <div className="mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {isLogin
              ? 'Welcome Back to Your Credit Dashboard'
              : 'Transform Your Business with Credit Intelligence'}
          </h3>
          <p className="text-white/80 text-base max-w-sm leading-relaxed">
            {isLogin
              ? 'Access real-time credit scoring and growth insights powered by your payment data.'
              : 'Leverage your payment gateway data to unlock bank financing and grow your business.'}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6 relative z-10">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex gap-4 animate-in fade-in duration-500"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Text */}
      <div className="text-white/60 text-xs mt-8 relative z-10">
        <p>🇮🇩 Partnered with PayLabs & Alibaba Cloud</p>
        <p className="mt-1">Trusted by 10,000+ MSMEs across India</p>
      </div>
    </div>
  );
}
