import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'orange' | 'teal' | 'blue';
  subtext?: string;
}

export default function StatCard({ icon, label, value, change, trend, color = 'orange', subtext }: StatCardProps) {
  const gradients = {
    orange: 'from-[#F15A22] to-[#F15A22]/90',
    teal: 'from-[#2DAEAA] to-[#2DAEAA]/90',
    blue: 'from-[#3B82F6] to-[#3B82F6]/90',
  };

  const bgGradients = {
    orange: 'from-[#FFF3ED] to-[#FFE5D5]',
    teal: 'from-[#E0F7F6] to-[#C7EEE8]',
    blue: 'from-[#EFF6FF] to-[#DBEAFE]',
  };

  const textColors = {
    orange: 'text-[#F15A22]',
    teal: 'text-[#2DAEAA]',
    blue: 'text-[#3B82F6]',
  };

  const trendIcons = {
    up: <TrendingUp size={16} className="text-[#10B981]" />,
    down: <TrendingDown size={16} className="text-[#EF4444]" />,
    neutral: <Minus size={16} className="text-[#6B7280]" />,
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${bgGradients[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Decorative Circle */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r ${gradients[color]} rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500 group-hover:scale-150`} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[#6B7280] text-sm font-medium mb-1 flex items-center gap-1">
              {label}
              {trend && trendIcons[trend]}
            </p>
            <h3 className="text-[#1F2937] text-3xl font-bold mb-1 group-hover:text-[#F15A22] transition-colors">
              {value}
            </h3>
            {change && (
              <p className={`text-sm font-medium ${
                trend === 'up' ? 'text-[#10B981]' : 
                trend === 'down' ? 'text-[#EF4444]' : 
                'text-[#6B7280]'
              }`}>
                {change}
              </p>
            )}
            {subtext && (
              <p className="text-xs text-[#6B7280] mt-2">{subtext}</p>
            )}
          </div>
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${bgGradients[color]} flex items-center justify-center ${textColors[color]} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
            {icon}
          </div>
        </div>

        {/* Progress Bar (for some cards) */}
        {label.includes('Credit Score') && (
          <div className="mt-4 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] rounded-full" style={{ width: '68%' }} />
          </div>
        )}
      </div>
    </div>
  );
}