'use client';

import StatCard from '@/components/dashboard/stat-card';
import CreditScoreChart from '@/components/dashboard/credit-score-chart';
import AIInsights from '@/components/dashboard/ai-insights';
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  DollarSign, 
  Zap,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Activity,
  BarChart3,
  Target
} from 'lucide-react';

export default function DashboardPage() {

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header Section with Gradient */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Dashboard</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Business Overview
          </h1>
          <p className="text-[#6B7280] mt-2">Track your business performance and credit health in real-time</p>
        </div>
        
        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-white rounded-xl border border-[#E5E7EB] p-2 shadow-sm">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F3F4F6] text-[#1F2937] font-medium">
            <Calendar size={18} className="text-[#F15A22]" />
            Last 30 days
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <RefreshCw size={18} className="text-[#6B7280]" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <Download size={18} className="text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Welcome Section - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#F15A22] via-[#F15A22]/90 to-[#2DAEAA] rounded-2xl p-8 lg:p-10 text-white shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              🎉 Welcome back!
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Acme Industries</h2>
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            Your business is performing exceptionally well! 🚀 Credit score improved by <span className="font-bold">25 points</span> in the last 3 months, placing you in the top 15% of businesses.
          </p>
          
          {/* Quick Stats in Welcome Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Active Days</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Success Rate</p>
              <p className="text-2xl font-bold">98.5%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Customers</p>
              <p className="text-2xl font-bold">1,284</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Cash Flow</p>
              <p className="text-2xl font-bold">+₹2.4M</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="group bg-white text-[#F15A22] px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              View Full Report
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
              Apply for Credit
              <Target size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Stats with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <StatCard
            icon={<CreditCard size={28} />}
            label="Credit Score"
            value="680"
            change="↑ 25 points (Excellent)"
            trend="up"
            color="orange"
            subtext="Very Good"
          />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <StatCard
            icon={<Shield size={28} />}
            label="Risk Band"
            value="Low Risk"
            change="A+ Rating"
            trend="neutral"
            color="teal"
            subtext="Top 15%"
          />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <StatCard
            icon={<TrendingUp size={28} />}
            label="Est. Credit Limit"
            value="₹5.2L"
            change="↑ 15% from last month"
            trend="up"
            color="orange"
            subtext="Eligible for increase"
          />
        </div>
      </div>

      {/* Credit Score Chart */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <CreditScoreChart />
      </div>

      {/* Middle Stats and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <StatCard
                icon={<DollarSign size={28} />}
                label="Monthly Transactions"
                value="₹18.5M"
                change="↑ 12% vs last month"
                trend="up"
                color="teal"
                subtext="Volume: 2,847 txns"
              />
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <StatCard
                icon={<Activity size={28} />}
                label="MoM Growth"
                value="12.3%"
                change="Accelerating (+2.1%)"
                trend="up"
                color="orange"
                subtext="Above industry avg"
              />
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '0.7s' }}>
              <StatCard
                icon={<AlertCircle size={28} />}
                label="Refund Rate"
                value="4.2%"
                change="↑ 0.5% (Monitor)"
                trend="down"
                color="orange"
                subtext="Target: <3.5%"
              />
            </div>
          </div>

          {/* Quick Actions - Enhanced */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[#1F2937] text-xl font-bold">Quick Actions</h3>
                <p className="text-[#6B7280] text-sm mt-1">Frequently used operations</p>
              </div>
              <BarChart3 size={24} className="text-[#F15A22]" />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button className="group flex flex-col items-center gap-2 bg-gradient-to-br from-[#FFF3ED] to-[#FFE5D5] p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Zap size={24} className="text-[#F15A22] group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-[#1F2937]">Limit Increase</span>
              </button>
              
              <button className="group flex flex-col items-center gap-2 bg-gradient-to-br from-[#E0F7F6] to-[#C7EEE8] p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <TrendingUp size={24} className="text-[#2DAEAA] group-hover:translate-y-[-2px] transition-transform" />
                <span className="text-sm font-semibold text-[#1F2937]">Analytics</span>
              </button>
              
              <button className="group flex flex-col items-center gap-2 bg-gradient-to-br from-[#FFF3ED] to-[#FFE5D5] p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CreditCard size={24} className="text-[#F15A22] group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-[#1F2937]">Statement</span>
              </button>
              
              <button className="group flex flex-col items-center gap-2 bg-gradient-to-br from-[#E0F7F6] to-[#C7EEE8] p-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Shield size={24} className="text-[#2DAEAA] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-[#1F2937]">Security</span>
              </button>
            </div>

            {/* Additional Actions */}
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] grid grid-cols-2 gap-2">
              <button className="text-sm text-[#6B7280] hover:text-[#F15A22] transition-colors flex items-center justify-center gap-1">
                <RefreshCw size={14} />
                Reconcile
              </button>
              <button className="text-sm text-[#6B7280] hover:text-[#2DAEAA] transition-colors flex items-center justify-center gap-1">
                <Download size={14} />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* AI Insights - Enhanced */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#1F2937] text-xl font-bold">AI Insights</h3>
              <p className="text-[#6B7280] text-sm mt-1">Smart recommendations</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
          <AIInsights />
        </div>
      </div>

      {/* Recent Activity - Enhanced */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl animate-fadeIn" style={{ animationDelay: '0.9s' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[#1F2937] text-xl font-bold">Recent Activity</h3>
            <p className="text-[#6B7280] text-sm mt-1">Latest transactions and updates</p>
          </div>
          <button className="text-[#F15A22] hover:text-[#2DAEAA] font-medium flex items-center gap-1 transition-colors">
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className="group flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#FFF3ED] hover:to-[#E0F7F6] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#F15A22]/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign size={22} className="text-[#F15A22]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937] group-hover:text-[#F15A22] transition-colors">
                    Transaction #{1000 + item}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#6B7280]">2 hours ago</span>
                    <span className="w-1 h-1 bg-[#6B7280] rounded-full"></span>
                    <span className="text-[#10B981]">Completed</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#1F2937] font-bold text-lg">₹{(5 - item).toFixed(1)}L</span>
                <p className="text-[#6B7280] text-xs">+12% vs avg</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add custom animations */}
      <style> {`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}