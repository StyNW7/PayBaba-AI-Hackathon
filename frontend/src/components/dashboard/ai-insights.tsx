import { TrendingUp, AlertCircle, CheckCircle, Clock, Target, Zap } from 'lucide-react';

export default function AIInsights() {
  const insights = [
    {
      icon: TrendingUp,
      title: 'Strong Growth Momentum',
      description: 'Transaction volume increased by 23% this month. Consider expanding inventory.',
      type: 'positive',
      action: 'View details',
      time: '2 min ago'
    },
    {
      icon: AlertCircle,
      title: 'Refund Rate Alert',
      description: 'Refund rate at 4.2% exceeds threshold. Review recent transactions.',
      type: 'warning',
      action: 'Review now',
      time: '15 min ago'
    },
    {
      icon: Target,
      title: 'Credit Limit Opportunity',
      description: 'Eligible for limit increase to ₹7.5L based on payment history.',
      type: 'neutral',
      action: 'Apply now',
      time: '1 hour ago'
    },
    {
      icon: CheckCircle,
      title: 'Payment Success Rate',
      description: '98.5% success rate. Top performer in your industry.',
      type: 'positive',
      action: 'View report',
      time: '3 hours ago'
    }
  ];

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
      {insights.map((insight, idx) => {
        const Icon = insight.icon;
        const bgColor = insight.type === 'positive' ? 'bg-[#E0F7F6]' : insight.type === 'warning' ? 'bg-[#FEF3C7]' : 'bg-[#EFF6FF]';
        const borderColor = insight.type === 'positive' ? 'border-[#2DAEAA]' : insight.type === 'warning' ? 'border-[#F59E0B]' : 'border-[#3B82F6]';
        const iconColor = insight.type === 'positive' ? 'text-[#2DAEAA]' : insight.type === 'warning' ? 'text-[#F59E0B]' : 'text-[#3B82F6]';
        const hoverBg = insight.type === 'positive' ? 'hover:bg-[#C7EEE8]' : insight.type === 'warning' ? 'hover:bg-[#FDE68A]' : 'hover:bg-[#DBEAFE]';

        return (
          <div 
            key={idx} 
            className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group ${hoverBg}`}
          >
            <div className="flex gap-3">
              <div className={`${iconColor} p-2 bg-white/60 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-[#1F2937] text-sm">{insight.title}</h4>
                  <span className="text-[#6B7280] text-xs flex items-center gap-1">
                    <Clock size={10} />
                    {insight.time}
                  </span>
                </div>
                <p className="text-[#6B7280] text-xs leading-relaxed mb-2">{insight.description}</p>
                <button className={`text-xs font-medium flex items-center gap-1 ${
                  insight.type === 'positive' ? 'text-[#2DAEAA]' : 
                  insight.type === 'warning' ? 'text-[#F59E0B]' : 
                  'text-[#3B82F6]'
                }`}>
                  {insight.action}
                  <Zap size={10} />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* AI Assistant CTA */}
      <div className="bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] p-4 rounded-xl text-white mt-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Ask AI Assistant</h4>
            <p className="text-white/80 text-xs mt-0.5">Get personalized recommendations</p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #F15A22;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2DAEAA;
        }
      `}</style>
    </div>
  );
}