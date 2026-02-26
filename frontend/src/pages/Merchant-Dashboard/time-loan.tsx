/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Brain,
  Target,
  CalendarClock,
  Lightbulb,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

// Dummy data
const loanData = {
  optimal_week: "Week 2-3",
  optimal_month: "March 2026",
  start_date: "March 9, 2026",
  end_date: "March 23, 2026",
  min_limit: 65,
  max_limit: 85,
  weekly_revenue: [25, 32, 35, 28], // in millions
  monthly_comparison: [
    { month: 'Jan', week1: 24, week2: 31, week3: 34, week4: 27 },
    { month: 'Feb', week1: 25, week2: 32, week3: 35, week4: 28 },
    { month: 'Mar', week1: 26, week2: 33, week3: 36, week4: 29 },
  ],
  supporting_factors: [
    { factor: "Refund Rate", value: "0.2%", status: "positive", icon: Shield },
    { factor: "Settlement Time", value: "1.2 days", status: "positive", icon: Clock },
    { factor: "Transaction Volume", value: "Rp 35M", status: "positive", icon: TrendingUp },
  ],
  recommendation_amount: 70,
  recommendation_purpose: "Lebaran stock preparation",
  confidence_score: 94,
  analysis_period: "6 months"
};

// Weekly pattern data for chart
const weeklyData = [
  { name: 'Week 1', amount: 25, status: 'neutral' },
  { name: 'Week 2', amount: 32, status: 'optimal' },
  { name: 'Week 3', amount: 35, status: 'optimal' },
  { name: 'Week 4', amount: 28, status: 'neutral' },
];

// AI insights
const aiExplanation = {
  weekly_pattern: [
    { week: "Week 1", amount: 25, trend: "fluctuating", optimal: false },
    { week: "Week 2", amount: 32, trend: "stable", optimal: true },
    { week: "Week 3", amount: 35, trend: "peak", optimal: true },
    { week: "Week 4", amount: 28, trend: "declining", optimal: false },
  ]
};

export default function SmartLoanPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(loanData.recommendation_amount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount * 1000000);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E7EB]">
          <p className="text-sm font-medium text-[#1F2937]">{label}</p>
          <p className="text-sm text-[#F15A22] font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Smart Loan Timing</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Smart Loan Timing Recommendation
          </h1>
          <p className="text-[#6B7280] mt-2">AI-powered analysis to optimize your loan application timing</p>
        </div>

        {/* Confidence Score */}
        <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E5E7EB] p-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#2DAEAA] rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-[#6B7280]">AI Confidence</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#1F2937]">{loanData.confidence_score}%</span>
              <div className="w-16 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] rounded-full"
                  style={{ width: `${loanData.confidence_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Main Recommendation Card */}
      <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-6 lg:p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 animate-float">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">Best Time to Apply for Loan</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              {loanData.optimal_week} {loanData.optimal_month}
            </h2>
            
            <div className="flex items-center gap-2 text-white/90 text-lg mb-4">
              <CalendarClock size={20} />
              <span>{loanData.start_date} - {loanData.end_date}</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-sm text-white/80">Estimated Limit</p>
                <p className="text-2xl font-bold">
                  Rp {loanData.min_limit}-{loanData.max_limit} Million
                </p>
              </div>
              
              <div className="bg-[#FCD34D] text-[#1F2937] px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
                <CheckCircle size={18} />
                High Recommendation
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              {loanData.supporting_factors.map((factor, idx) => {
                const Icon = factor.icon;
                return (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <Icon size={16} className="mb-1" />
                    <p className="text-xs text-white/80">{factor.factor}</p>
                    <p className="text-sm font-bold">{factor.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decorative Element */}
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Sparkles size={48} className="text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: AI Explanation */}
      <div className="bg-gradient-to-br from-[#F3F4F6] to-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">AI Analysis by Qwen</h2>
            <p className="text-sm text-[#6B7280]">Based on {loanData.analysis_period} transaction analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Pattern */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#1F2937] flex items-center gap-2">
              <BarChart3 size={18} className="text-[#F15A22]" />
              📊 Weekly Pattern
            </h3>
            
            <div className="space-y-3">
              {aiExplanation.weekly_pattern.map((week, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:translate-x-1 ${
                    week.optimal ? 'bg-[#10B981]/10 border border-[#10B981]/20' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      week.optimal ? 'bg-[#10B981]' : 'bg-[#F3F4F6]'
                    }`}>
                      <span className={`text-sm font-bold ${week.optimal ? 'text-white' : 'text-[#6B7280]'}`}>
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">{week.week}</p>
                      <p className="text-sm text-[#6B7280]">Rp {week.amount}M ({week.trend})</p>
                    </div>
                  </div>
                  {week.optimal && (
                    <CheckCircle size={18} className="text-[#10B981]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Factors & Recommendation */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-[#1F2937] flex items-center gap-2 mb-3">
                <Target size={18} className="text-[#2DAEAA]" />
                🔍 Supporting Factors
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <Shield size={16} className="text-[#10B981]" />
                  <span className="text-sm">Lowest refund rate in weeks 2-3 (0.2%)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <Clock size={16} className="text-[#10B981]" />
                  <span className="text-sm">Fastest settlement in this period (1.2 days)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                  <TrendingUp size={16} className="text-[#10B981]" />
                  <span className="text-sm">Consistent high transaction volume</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#F15A22]/10 to-[#2DAEAA]/10 rounded-xl p-4 border border-[#F15A22]/20">
              <h3 className="font-semibold text-[#1F2937] flex items-center gap-2 mb-2">
                <Lightbulb size={18} className="text-[#F15A22]" />
                🎯 Recommendation
              </h3>
              <p className="text-[#1F2937]">
                Apply for <span className="font-bold text-[#F15A22]">Rp {loanData.recommendation_amount} million</span>{' '}
                for <span className="font-semibold">{loanData.recommendation_purpose}</span>{' '}
                in <span className="font-semibold text-[#2DAEAA]">week 2 next month</span>.
              </p>
            </div>

            {/* Confidence Meter */}
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#6B7280]">Prediction Accuracy</span>
                <span className="text-xs font-semibold text-[#1F2937]">94%</span>
              </div>
              <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Weekly Pattern Bar Chart */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Weekly Revenue Pattern</h2>
            <p className="text-sm text-[#6B7280] mt-1">Average transaction volume by week</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#2DAEAA] rounded-full"></div>
              <span className="text-xs text-[#6B7280]">Optimal Weeks</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#F15A22] rounded-full"></div>
              <span className="text-xs text-[#6B7280]">Other Weeks</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" domain={[0, 40]} tickFormatter={(value) => `Rp${value}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {weeklyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.status === 'optimal' ? '#2DAEAA' : '#F15A22'}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#2DAEAA]" />
            <span className="text-sm">Peak weeks: Rp 32-35M</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-[#F15A22]" />
            <span className="text-sm">Low weeks: Rp 25-28M</span>
          </div>
        </div>
      </div>

      {/* Section 4: Monthly Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Monthly Comparison</h2>
            <p className="text-sm text-[#6B7280] mt-1">Historical data for the last 3 months</p>
          </div>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'table' ? null : 'table')}
            className="flex items-center gap-1 text-[#F15A22] hover:text-[#2DAEAA] transition-colors"
          >
            {expandedSection === 'table' ? 'Show less' : 'Show details'}
            {expandedSection === 'table' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Month</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Week 1</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Week 2</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Week 3</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Week 4</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Trend</th>
              </tr>
            </thead>
            <tbody>
              {loanData.monthly_comparison.map((month, idx) => {
                const avgOptimal = (month.week2 + month.week3) / 2;
                const prevMonth = idx > 0 ? loanData.monthly_comparison[idx - 1] : null;
                const growth = prevMonth ? ((avgOptimal - (prevMonth.week2 + prevMonth.week3) / 2) / ((prevMonth.week2 + prevMonth.week3) / 2) * 100).toFixed(1) : null;
                
                return (
                  <tr key={month.month} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-4 font-medium text-[#1F2937]">{month.month}</td>
                    <td className="py-3 px-4">
                      <span className="text-[#6B7280]">Rp {month.week1}M</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#2DAEAA]">Rp {month.week2}M</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#2DAEAA]">Rp {month.week3}M</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#6B7280]">Rp {month.week4}M</span>
                    </td>
                    <td className="py-3 px-4">
                      {growth && (
                        <span className={`text-xs font-medium ${Number(growth) > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {Number(growth) > 0 ? '↑' : '↓'} {Math.abs(Number(growth))}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expanded section with trend line */}
        {expandedSection === 'table' && (
          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-4">Weekly Trend Analysis</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={loanData.monthly_comparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="week2" stroke="#2DAEAA" strokeWidth={2} name="Week 2" />
                <Line type="monotone" dataKey="week3" stroke="#F15A22" strokeWidth={2} name="Week 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Section 5: Action Button */}
      <div className="bg-gradient-to-r from-[#F3F4F6] to-[#F9FAFB] rounded-2xl p-6 border border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center animate-pulse-glow">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937]">Ready to proceed?</h3>
              <p className="text-sm text-[#6B7280]">Apply now with the optimal timing recommendation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Amount selector */}
            <select 
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
            >
              <option value="65">Rp 65 Million</option>
              <option value="70">Rp 70 Million (Recommended)</option>
              <option value="75">Rp 75 Million</option>
              <option value="80">Rp 80 Million</option>
              <option value="85">Rp 85 Million</option>
            </select>

            <button className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Apply with This Recommendation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <p className="text-xs text-[#6B7280] flex items-center gap-1">
            <AlertCircle size={12} />
            Based on historical data analysis. Actual loan approval and terms may vary based on current financial assessment.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(241, 90, 34, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 5px rgba(45, 174, 170, 0.3);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}