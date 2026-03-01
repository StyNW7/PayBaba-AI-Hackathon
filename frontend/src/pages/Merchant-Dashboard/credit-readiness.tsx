/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  Target,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';
import CreditScoreMeter from '@/components/credit-readiness/credit-score-meter';
import ScoreComponentsTable from '@/components/credit-readiness/score-component-tables';
import ImprovementTips from '@/components/credit-readiness/improvement-tips';
import AIExplanation from '@/components/credit-readiness/ai-explanation';
import { merchantApi, type CreditDetail } from '@/services/api';
import LoadingSpinner from '@/components/loading-spinner';
import ErrorState from '@/components/error-state';

// Helper function to format currency
const formatCurrency = (amount: string | number) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

// Helper function to format number
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export default function CreditReadinessPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditData, setCreditData] = useState<CreditDetail | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch credit data from API
  const fetchCreditData = async () => {
    try {
      setError(null);
      const response = await merchantApi.getCreditDetail();
      
      if (response.success && response.data) {
        setCreditData(response.data);
      } else {
        setError(response.message || 'Failed to load credit data');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load credit data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCreditData();
  };

  const handleExportReport = () => {
    // Implement export logic here
    console.log('Exporting credit report...');
    alert('Exporting credit report as PDF...');
  };

  // Transform API data to component format
  const getComponents = () => {
    if (!creditData) return [];
    
    const { components } = creditData;
    const totalScore = creditData.score;
    
    return [
      { 
        name: 'Transaction Volume', 
        score: components.transactionVolume.score, 
        weight: components.transactionVolume.weight * 100,
        contribution: (components.transactionVolume.score * components.transactionVolume.weight),
        color: '#F15A22' 
      },
      { 
        name: 'Revenue Consistency', 
        score: components.revenueConsistency.score, 
        weight: components.revenueConsistency.weight * 100,
        contribution: (components.revenueConsistency.score * components.revenueConsistency.weight),
        color: '#2DAEAA' 
      },
      { 
        name: 'Growth Trend', 
        score: components.growthTrend.score, 
        weight: components.growthTrend.weight * 100,
        contribution: (components.growthTrend.score * components.growthTrend.weight),
        color: '#F15A22' 
      },
      { 
        name: 'Refund Rate', 
        score: components.refundRate.score, 
        weight: components.refundRate.weight * 100,
        contribution: (components.refundRate.score * components.refundRate.weight),
        color: '#10B981' 
      },
      { 
        name: 'Settlement Time', 
        score: components.settlementTime.score, 
        weight: components.settlementTime.weight * 100,
        contribution: (components.settlementTime.score * components.settlementTime.weight),
        color: '#F59E0B' 
      },
    ];
  };

  // Generate explanation text based on actual data
  const getExplanationText = () => {
    if (!creditData) return { positives: [], warnings: [], improvements: [] };

    const { components, metrics } = creditData;
    const positives = [];
    const warnings = [];
    const improvements = [];

    // Transaction Volume
    if (components.transactionVolume.score >= 80) {
      positives.push(`Strong transaction volume with ${formatNumber(metrics.transactionCount3m)} transactions in last 3 months`);
    } else if (components.transactionVolume.score < 60) {
      warnings.push('Transaction volume is below optimal levels');
      improvements.push('Increase transaction volume through more sales or larger ticket sizes');
    }

    // Revenue Consistency
    const volatility = parseFloat(metrics.revenueVolatility);
    if (volatility < 15) {
      positives.push(`Excellent revenue stability with only ${volatility.toFixed(1)}% volatility`);
    } else if (volatility > 30) {
      warnings.push('High revenue volatility detected');
      improvements.push('Focus on stabilizing monthly revenue streams');
    }

    // Growth Trend
    const growth = parseFloat(metrics.growthPercentageMoM);
    if (growth > 5) {
      positives.push(`Strong growth momentum at ${growth.toFixed(1)}% month-over-month`);
    } else if (growth > 0) {
      positives.push(`Consistent growth of ${growth.toFixed(1)}% month-over-month`);
    } else if (growth < 0) {
      warnings.push('Negative growth trend detected');
      improvements.push('Develop strategies to reverse the declining trend');
    }

    // Refund Rate
    const refundRate = parseFloat(metrics.refundRatePercentage);
    if (refundRate < 2) {
      positives.push(`Excellent refund rate of only ${refundRate.toFixed(1)}%`);
    } else if (refundRate > 5) {
      warnings.push(`High refund rate of ${refundRate.toFixed(1)}%`);
      improvements.push('Review refund reasons and improve product/service quality');
    }

    // Settlement Time
    const settlementDays = parseFloat(metrics.avgSettlementDays);
    if (settlementDays <= 1) {
      positives.push(`Fast settlement time of ${settlementDays.toFixed(1)} days`);
    } else if (settlementDays > 2.5) {
      warnings.push(`Settlement time of ${settlementDays.toFixed(1)} days is above industry average`);
      improvements.push('Optimize settlement processing to improve score');
    }

    return { positives, warnings, improvements };
  };

  // Generate recommendation text
  const getRecommendation = () => {
    if (!creditData) return '';
    
    const { score, riskBand, components } = creditData;
    
    if (score >= 80) {
      return `Excellent credit score! Your business shows strong fundamentals. Focus on maintaining current performance and you'll qualify for premium funding options.`;
    } else if (score >= 60) {
      // Find the lowest scoring component
      const lowestComponent = Object.entries(components)
        .reduce((lowest, [key, value]) => 
          value.score < lowest.score ? { key, ...value } : lowest
        , { key: '', score: 100, weight: 0 });
      
      const componentNames = {
        transactionVolume: 'transaction volume',
        revenueConsistency: 'revenue consistency',
        growthTrend: 'growth trend',
        refundRate: 'refund rate',
        settlementTime: 'settlement time'
      };
      
      return `Your credit score is in the ${riskBand} range. To improve, focus on enhancing ${componentNames[lowestComponent.key as keyof typeof componentNames] || 'key metrics'}. This could help you unlock better funding options.`;
    } else {
      return `Your credit score needs attention. Review the improvement tips below and focus on the highest-weighted factors to build better creditworthiness.`;
    }
  };

  // const totalScore = creditData?.score || 0;
  const components = getComponents();
  const explanationText = getExplanationText();
  const recommendation = getRecommendation();

  if (loading && !creditData) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <ErrorState message={error} onRetry={fetchCreditData} />
      </div>
    );
  }

  if (!creditData) {
    return (
      <div className="p-4 lg:p-8">
        <ErrorState message="No credit data available" onRetry={fetchCreditData} />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Credit Readiness</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Credit Health Overview
          </h1>
          <p className="text-[#6B7280] mt-2">
            Last updated: {new Date(creditData.calculatedAt).toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#F15A22] transition-all duration-300 group"
          >
            <svg 
              className={`w-4 h-4 text-[#6B7280] group-hover:text-[#F15A22] transition-all ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium text-[#1F2937]">Refresh</span>
          </button>
          
          <button 
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg hover:shadow-[#F15A22]/20 transition-all duration-300 group"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>
      </div>

      {/* Status Banner - Show only if ready for funding */}
      {creditData.score >= 70 && (
        <div className="bg-gradient-to-r from-[#10B981]/10 to-[#2DAEAA]/10 border border-[#10B981]/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F2937]">Ready for Funding</h3>
              <p className="text-sm text-[#6B7280]">
                Your credit score meets the criteria for instant funding up to {formatCurrency(creditData.estimatedMaxLimit)}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E5E7EB] hover:border-[#F15A22] transition-colors">
            <span className="text-sm font-medium">Apply Now</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      )}

      {/* Section 1: Score Meter and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Score Meter */}
        <div className="lg:col-span-1">
          <CreditScoreMeter 
            score={creditData.score} 
            maxScore={100}
            riskBand={creditData.riskBand}
            readyForFunding={creditData.score >= 70}
          />
        </div>

        {/* Quick Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFF3ED] to-[#FFE5D5] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={24} className="text-[#F15A22]" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                parseFloat(creditData.metrics.growthPercentageMoM) >= 0 
                  ? 'text-[#10B981] bg-[#10B981]/10' 
                  : 'text-[#EF4444] bg-[#EF4444]/10'
              }`}>
                {parseFloat(creditData.metrics.growthPercentageMoM) >= 0 ? '+' : ''}
                {creditData.metrics.growthPercentageMoM}%
              </span>
            </div>
            <p className="text-[#6B7280] text-sm mb-1">Growth Rate (MoM)</p>
            <p className="text-2xl font-bold text-[#1F2937]">{creditData.metrics.growthPercentageMoM}%</p>
            <p className="text-xs text-[#6B7280] mt-2">vs last month</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E0F7F6] to-[#C7EEE8] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock size={24} className="text-[#2DAEAA]" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                parseFloat(creditData.metrics.avgSettlementDays) <= 2 
                  ? 'text-[#10B981] bg-[#10B981]/10' 
                  : 'text-[#F59E0B] bg-[#F59E0B]/10'
              }`}>
                {parseFloat(creditData.metrics.avgSettlementDays) <= 2 ? 'Good' : 'Needs improvement'}
              </span>
            </div>
            <p className="text-[#6B7280] text-sm mb-1">Avg Settlement</p>
            <p className="text-2xl font-bold text-[#1F2937]">{creditData.metrics.avgSettlementDays} days</p>
            <p className="text-xs text-[#6B7280] mt-2">Industry avg: 2.5 days</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFF3ED] to-[#FFE5D5] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield size={24} className="text-[#F15A22]" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                parseFloat(creditData.metrics.refundRatePercentage) <= 3 
                  ? 'text-[#10B981] bg-[#10B981]/10' 
                  : 'text-[#F59E0B] bg-[#F59E0B]/10'
              }`}>
                {parseFloat(creditData.metrics.refundRatePercentage) <= 3 ? 'Excellent' : 'Needs attention'}
              </span>
            </div>
            <p className="text-[#6B7280] text-sm mb-1">Refund Rate</p>
            <p className="text-2xl font-bold text-[#1F2937]">{creditData.metrics.refundRatePercentage}%</p>
            <p className="text-xs text-[#6B7280] mt-2">Target: &lt;3%</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E0F7F6] to-[#C7EEE8] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={24} className="text-[#2DAEAA]" />
              </div>
              <span className="text-xs font-medium text-[#F15A22] bg-[#F15A22]/10 px-2 py-1 rounded-full">
                {formatCurrency(creditData.estimatedMaxLimit)}
              </span>
            </div>
            <p className="text-[#6B7280] text-sm mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-[#1F2937]">{formatCurrency(creditData.metrics.avgMonthlyRevenue)}</p>
            <p className="text-xs text-[#6B7280] mt-2">Based on last 3 months</p>
          </div>
        </div>
      </div>

      {/* Section 2: AI Explanation */}
      <div className="animate-fadeIn">
        <AIExplanation 
          explanation={explanationText}
          recommendation={recommendation}
          score={creditData.score}
        />
      </div>

      {/* Section 3: Score Components Table */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E5E7EB] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">Score Components Breakdown</h2>
              <p className="text-sm text-[#6B7280] mt-1">Detailed analysis of factors affecting your credit score</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-[#F3F4F6] rounded-lg text-sm">
                Total Score: <span className="font-bold text-[#F15A22]">{creditData.score}</span>
              </div>
              <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                <Share2 size={18} className="text-[#6B7280]" />
              </button>
            </div>
          </div>
          <ScoreComponentsTable components={components} totalScore={creditData.score} />
        </div>
      </div>

      {/* Section 4: Improvement Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <ImprovementTips 
            components={components}
            recommendations={explanationText.improvements}
          />
        </div>

        {/* Additional Resources Card */}
        <div className="bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-2xl p-6 text-white animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="font-bold">Need Assistance?</h3>
          </div>
          <p className="text-white/90 text-sm mb-6 leading-relaxed">
            Our credit experts are here to help you improve your score and secure better funding options.
          </p>
          <button className="w-full bg-white text-[#F15A22] py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
            Talk to Expert
            <ChevronRight size={16} />
          </button>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/80 text-xs">Response time: &lt; 5 minutes</p>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
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
        
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}