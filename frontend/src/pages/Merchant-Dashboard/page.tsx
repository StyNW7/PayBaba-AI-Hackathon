/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/stat-card';
import CreditScoreChart from '@/components/dashboard/credit-score-chart';
import AIInsights from '@/components/dashboard/ai-insights';
import ProductInsights from '@/components/dashboard/product-insights';
import LoadingSpinner from '@/components/loading-spinner';
import ErrorState from '@/components/error-state';
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
  Building2,
  Phone,
  MapPin,
  Package,
  Sparkles
} from 'lucide-react';
import { merchantApi, type DashboardData, type MerchantProfile, type ProductInsights as ProductInsightsType } from '@/services/api';

export default function DashboardPage() {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profileData, setProfileData] = useState<MerchantProfile | null>(null);
  const [productInsights, setProductInsights] = useState<ProductInsightsType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [dashboardRes, profileRes, insightsRes] = await Promise.all([
        merchantApi.getDashboard(),
        merchantApi.getProfile(),
        merchantApi.getProductInsights()
      ]);

      if (dashboardRes.success) {
        setDashboardData(dashboardRes.data);
      }
      if (profileRes.success) {
        setProfileData(profileRes.data);
      }
      if (insightsRes.success) {
        setProductInsights(insightsRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  // const getRiskBandColor = (band: string) => {
  //   switch (band?.toLowerCase()) {
  //     case 'low':
  //       return 'text-green-600 bg-green-100';
  //     case 'medium':
  //       return 'text-yellow-600 bg-yellow-100';
  //     case 'high':
  //       return 'text-red-600 bg-red-100';
  //     default:
  //       return 'text-gray-600 bg-gray-100';
  //   }
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  if (!dashboardData || !profileData) {
    return (
      <div className="p-4 lg:p-8">
        <ErrorState message="No data available" onRetry={fetchDashboardData} />
      </div>
    );
  }

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
          <button 
            onClick={() => setSelectedPeriod('30days')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedPeriod === '30days' 
                ? 'bg-[#F3F4F6] text-[#1F2937] font-medium' 
                : 'text-[#6B7280] hover:bg-[#F3F4F6]'
            }`}
          >
            <Calendar size={18} className={selectedPeriod === '30days' ? 'text-[#F15A22]' : 'text-[#6B7280]'} />
            Last 30 days
          </button>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} className="text-[#6B7280]" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <Download size={18} className="text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Welcome Section with Real Profile Data */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#F15A22] via-[#F15A22]/90 to-[#2DAEAA] rounded-2xl p-8 lg:p-10 text-white shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1">
              <Sparkles size={14} />
              Welcome back!
            </div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              Member since {formatDate(profileData.merchant.joinDate)}
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{profileData.user.companyName}</h2>
          <p className="text-white/90 text-lg mb-6 leading-relaxed max-w-3xl">
            Your business is performing well! Credit score is at <span className="font-bold">{dashboardData.currentCreditScore}</span> with {dashboardData.riskBand} risk band. 
            {dashboardData.monthlyGrowth > 0 
              ? ` Monthly growth is up by ${dashboardData.monthlyGrowth.toFixed(1)}%.` 
              : ' Keep up the good work!'}
          </p>
          
          {/* Quick Stats in Welcome Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Business Category</p>
              <p className="text-xl font-bold">{profileData.merchant.businessCategory || 'N/A'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Business Scale</p>
              <p className="text-xl font-bold">{profileData.merchant.businessScale || 'N/A'}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Total Transactions</p>
              <p className="text-xl font-bold">{formatNumber(dashboardData.totalTransactions)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/70 text-sm">Monthly Volume</p>
              <p className="text-xl font-bold">{formatCurrency(dashboardData.monthlyTransactionVolume)}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <Building2 size={16} />
              <span>{profileData.user.fullName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={16} />
              <span>{profileData.user.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{profileData.user.city}, {profileData.user.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stats with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <StatCard
            icon={<CreditCard size={28} />}
            label="Credit Score"
            value={dashboardData.currentCreditScore.toString()}
            change={`↑ ${dashboardData.currentCreditScore-25} points`}
            trend="up"
            color="orange"
            subtext={dashboardData.riskBand}
          />
        </div>
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <StatCard
            icon={<Shield size={28} />}
            label="Risk Band"
            value={dashboardData.riskBand}
            change={`${dashboardData.riskBand} Risk`}
            trend={dashboardData.riskBand.toLowerCase() === 'low' ? 'up' : dashboardData.riskBand.toLowerCase() === 'high' ? 'down' : 'neutral'}
            color={dashboardData.riskBand.toLowerCase() === 'low' ? 'teal' : dashboardData.riskBand.toLowerCase() === 'medium' ? 'orange' : 'blue'}
            subtext="Based on transaction history"
          />
        </div>
        {/* <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <StatCard
            icon={<TrendingUp size={28} />}
            label="Est. Credit Limit"
            value={formatCurrency(dashboardData.estimatedMaxLimit)}
            change={`Range: ${formatCurrency(dashboardData.estimatedMinLimit)} - ${formatCurrency(dashboardData.estimatedMaxLimit)}`}
            trend="up"
            color="orange"
            subtext="Eligible for increase"
          />
        </div> */}
      </div>

      {/* Credit Score Chart */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <CreditScoreChart data={dashboardData.scoreHistory} />
      </div>

      {/* Product Insights Section - New */}
      {productInsights && (
        <div className="animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <ProductInsights data={productInsights} />
        </div>
      )}

      {/* Middle Stats and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <StatCard
                icon={<DollarSign size={28} />}
                label="Monthly Transactions"
                value={formatCurrency(dashboardData.monthlyTransactionVolume)}
                change={`${dashboardData.monthlyGrowth > 0 ? '↑' : '↓'} ${Math.abs(dashboardData.monthlyGrowth).toFixed(1)}% vs last month`}
                trend={dashboardData.monthlyGrowth > 0 ? 'up' : dashboardData.monthlyGrowth < 0 ? 'down' : 'neutral'}
                color="teal"
                subtext={`Volume: ${formatNumber(dashboardData.totalTransactions)} total txns`}
              />
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '0.7s' }}>
              <StatCard
                icon={<Activity size={28} />}
                label="Avg Daily Transaction"
                value={formatCurrency(dashboardData.avgDailyTransaction)}
                change="Per day average"
                trend="neutral"
                color="orange"
                subtext="Last 30 days"
              />
            </div>
            <div className="animate-slideUp" style={{ animationDelay: '0.8s' }}>
              <StatCard
                icon={<AlertCircle size={28} />}
                label="Refund Rate"
                value={`${dashboardData.refundRate.toFixed(1)}%`}
                change={dashboardData.refundRate > 3 ? '↑ Above target' : '↓ Within target'}
                trend={dashboardData.refundRate > 3 ? 'down' : 'up'}
                color="orange"
                subtext={dashboardData.refundRate > 3 ? 'Needs attention' : 'Good performance'}
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
                <Package size={24} className="text-[#F15A22] group-hover:rotate-12 transition-transform" />
                <span className="text-sm font-semibold text-[#1F2937]">Products</span>
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
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slideUp" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[#1F2937] text-xl font-bold">AI Insights</h3>
              <p className="text-[#6B7280] text-sm mt-1">Smart recommendations</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
          </div>
          <AIInsights 
            monthlyGrowth={dashboardData.monthlyGrowth}
            refundRate={dashboardData.refundRate}
            creditScore={dashboardData.currentCreditScore}
            estimatedLimit={dashboardData.estimatedMaxLimit}
          />
        </div>
      </div>

      {/* Recent Activity - Enhanced */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl animate-fadeIn" style={{ animationDelay: '1s' }}>
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
          {dashboardData.scoreHistory.slice(0, 4).map((item, idx) => (
            <div 
              key={idx} 
              className="group flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#FFF3ED] hover:to-[#E0F7F6] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#F15A22]/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity size={22} className="text-[#F15A22]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1F2937] group-hover:text-[#F15A22] transition-colors">
                    Credit Score Update
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#6B7280]">{formatDate(item.date)}</span>
                    <span className="w-1 h-1 bg-[#6B7280] rounded-full"></span>
                    <span className="text-[#10B981]">Updated</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#1F2937] font-bold text-lg">{item.score}</span>
                <p className="text-[#6B7280] text-xs">points</p>
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