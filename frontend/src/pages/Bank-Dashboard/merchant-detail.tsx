/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Shield,
  FileText,
  Printer,
  Share2,
  MoreVertical,
  ChevronRight,
  Zap,
  Building2,
  Activity
} from 'lucide-react';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

import GaugeChart from '@/components/bank/gauge-chart';

// Dummy merchant data
const merchantData = {
  id: 1,
  name: 'Warung Budi',
  category: 'Food & Beverage',
  joinedDate: 'Jan 15, 2024',
  location: 'South Jakarta',
  phone: '0812-xxxx-xxxx',
  email: 'warungbudi@email.com',
  businessType: 'Food & Beverage',
  status: 'Active',
  
  // Credit info
  creditScore: 92,
  riskBand: 'Low Risk',
  minLimit: 70,
  maxLimit: 105,
  
  // Transaction data (12 months)
  monthlyTransactions: [
    { month: 'Jan', amount: 45 },
    { month: 'Feb', amount: 48 },
    { month: 'Mar', amount: 52 },
    { month: 'Apr', amount: 55 },
    { month: 'May', amount: 58 },
    { month: 'Jun', amount: 60 },
    { month: 'Jul', amount: 62 },
    { month: 'Aug', amount: 65 },
    { month: 'Sep', amount: 68 },
    { month: 'Oct', amount: 70 },
    { month: 'Nov', amount: 72 },
    { month: 'Dec', amount: 75 }
  ],
  
  // Early warning
  earlyWarning: {
    active: true,
    detected: 'Feb 25, 2026',
    type: '15% Revenue Drop in last 2 weeks',
    analysis: 'Decline may be seasonal. Monitor.',
  },
  
  // Recent transactions
  recentTransactions: [
    { date: '25/02/26', amount: 2.5, method: 'QRIS', status: 'Success' },
    { date: '24/02/26', amount: 1.8, method: 'VA', status: 'Success' },
    { date: '23/02/26', amount: 3.2, method: 'Credit Card', status: 'Success' },
    { date: '22/02/26', amount: 1.5, method: 'QRIS', status: 'Pending' },
    { date: '21/02/26', amount: 2.1, method: 'Bank Transfer', status: 'Success' },
  ],
  
  // Additional stats
  growthRate: 15,
  refundRate: 0.3,
  avgSettlement: 1.2,
  totalTransactions: 1245,
  totalRevenue: 750
};

export default function MerchantDetailPage() {
    
  const [copied, setCopied] = useState(false);
  const [warningResolved, setWarningResolved] = useState(false);

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memoContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    // Implement PDF download
    console.log('Downloading PDF...');
  };

  const handleApprove = () => {
    // Implement approve logic
    console.log('Loan approved');
  };

  const handleReject = () => {
    // Implement reject logic
    console.log('Loan rejected');
  };

  const handleRequestDocs = () => {
    // Implement request documents logic
    console.log('Requesting documents');
  };

  const handleResolveWarning = () => {
    setWarningResolved(true);
    console.log('Warning resolved');
  };

  const handleIgnoreWarning = () => {
    console.log('Warning ignored');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount * 1000000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Success': return 'text-[#10B981] bg-[#10B981]/10';
      case 'Pending': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'Failed': return 'text-[#EF4444] bg-[#EF4444]/10';
      default: return 'text-[#6B7280] bg-[#6B7280]/10';
    }
  };

  const memoContent = `To: Credit Team, Bank ABC

Credit analysis for:

Merchant: Warung Budi
Industry: Culinary
Data Period: 1 Year (Feb 2025 - Feb 2026)

Summary:
Merchant shows excellent financial performance with
${merchantData.growthRate}% consistent monthly growth. 
Refund ratio is very low (${merchantData.refundRate}%)
and settlement is timely (${merchantData.avgSettlement} days).

Recommended Limit: Rp ${merchantData.minLimit}-${merchantData.maxLimit} Million

Regards,
PayBaba AI System`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E7EB]">
          <p className="text-sm font-medium text-[#1F2937]">{label} 2026</p>
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
      {/* Header with Back Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a
            href="/bank/dashboard"
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#F15A22] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Portfolio</span>
          </a>
          <div className="w-px h-6 bg-[#E5E7EB]"></div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">{merchantData.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[#FFF3ED] text-[#F15A22] text-xs rounded-full">
                {merchantData.category}
              </span>
              <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-xs rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors">
            <Printer size={18} className="text-[#6B7280]" />
          </button>
          <button className="p-2 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors">
            <Share2 size={18} className="text-[#6B7280]" />
          </button>
          <button className="p-2 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors">
            <MoreVertical size={18} className="text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Section 1: Two-Column Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Merchant Info */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
            <Building2 size={18} className="text-[#F15A22]" />
            Merchant Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-[#6B7280] mt-1" />
              <div>
                <p className="text-xs text-[#6B7280]">Joined</p>
                <p className="text-sm font-medium text-[#1F2937]">{merchantData.joinedDate}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#6B7280] mt-1" />
              <div>
                <p className="text-xs text-[#6B7280]">Location</p>
                <p className="text-sm font-medium text-[#1F2937]">{merchantData.location}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone size={16} className="text-[#6B7280] mt-1" />
              <div>
                <p className="text-xs text-[#6B7280]">Phone</p>
                <p className="text-sm font-medium text-[#1F2937]">{merchantData.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-[#6B7280] mt-1" />
              <div>
                <p className="text-xs text-[#6B7280]">Email</p>
                <p className="text-sm font-medium text-[#1F2937]">{merchantData.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Briefcase size={16} className="text-[#6B7280] mt-1" />
              <div>
                <p className="text-xs text-[#6B7280]">Business</p>
                <p className="text-sm font-medium text-[#1F2937]">{merchantData.businessType}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Activity size={16} className="text-[#6B7280] mt-1" />
              <div>
                <p className="text-xs text-[#6B7280]">Status</p>
                <span className="inline-block px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-xs rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
            <div>
              <p className="text-xs text-[#6B7280]">Total Transactions</p>
              <p className="text-lg font-bold text-[#1F2937]">{merchantData.totalTransactions}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Total Revenue</p>
              <p className="text-lg font-bold text-[#1F2937]">{formatCurrency(merchantData.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Avg Settlement</p>
              <p className="text-lg font-bold text-[#1F2937]">{merchantData.avgSettlement} days</p>
            </div>
          </div>
        </div>

        {/* Right - Credit Score */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
            <Shield size={18} className="text-[#F15A22]" />
            Credit Overview
          </h2>

          <div className="flex flex-col items-center">
            {/* Gauge Chart */}
            <div className="relative w-40 h-40 mb-4">
              <GaugeChart score={merchantData.creditScore} />
            </div>

            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-sm font-medium mb-2">
                {merchantData.riskBand}
              </span>
              <p className="text-2xl font-bold text-[#1F2937]">{merchantData.creditScore}/100</p>
            </div>

            <div className="w-full p-3 bg-[#F9FAFB] rounded-lg mb-4">
              <p className="text-xs text-[#6B7280] mb-1">Estimated Credit Limit</p>
              <p className="text-lg font-bold text-[#F15A22]">
                Rp {merchantData.minLimit}-{merchantData.maxLimit} Million
              </p>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Download size={16} />
              Download Credit Memo
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Automated Credit Memo Card */}
      <div className="bg-gradient-to-br from-[#F3F4F6] to-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1F2937]">
                AUTOMATED CREDIT MEMORANDUM - Qwen Generated
              </h2>
              <p className="text-xs text-[#6B7280]">AI-powered credit analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Download PDF"
            >
              <Download size={16} className="text-[#6B7280]" />
            </button>
            <button
              onClick={handleCopyMemo}
              className="p-2 hover:bg-white rounded-lg transition-colors relative"
              title="Copy Text"
            >
              {copied ? (
                <Check size={16} className="text-[#10B981]" />
              ) : (
                <Copy size={16} className="text-[#6B7280]" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 font-mono text-sm text-[#4B5563] whitespace-pre-line border border-[#E5E7EB]">
          {memoContent}
        </div>

        {copied && (
          <div className="mt-2 text-xs text-[#10B981] flex items-center gap-1">
            <Check size={12} />
            Copied to clipboard!
          </div>
        )}
      </div>

      {/* Section 3: 12-Month Transaction Chart */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1F2937]">12-Month Transaction History</h2>
            <p className="text-sm text-[#6B7280] mt-1">Monthly revenue trend</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-full">
              +{merchantData.growthRate}% growth
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={merchantData.monthlyTransactions} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F15A22" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F15A22" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" tickFormatter={(value) => `Rp${value}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#F15A22"
              strokeWidth={3}
              fill="url(#colorAmount)"
              dot={{ fill: '#F15A22', r: 6, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, stroke: '#F15A22', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Section 4: Early Warning (if active) */}
      {merchantData.earlyWarning.active && !warningResolved && (
        <div className="bg-gradient-to-r from-[#EF4444] to-[#F97316] rounded-2xl p-6 text-white shadow-xl animate-pulse-slow">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">⚠️ EARLY WARNING DETECTED</h3>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {merchantData.earlyWarning.detected}
                  </span>
                </div>
                <p className="text-white/90 mb-2">{merchantData.earlyWarning.type}</p>
                <p className="text-white/80 text-sm">{merchantData.earlyWarning.analysis}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleResolveWarning}
                className="px-4 py-2 bg-white text-[#EF4444] rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Resolve
              </button>
              <button
                onClick={handleIgnoreWarning}
                className="px-4 py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                Ignore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Recent Transactions</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Method</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Action</th>
              </tr>
            </thead>
            <tbody>
              {merchantData.recentTransactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-4 text-sm text-[#4B5563]">{tx.date}</td>
                  <td className="py-3 px-4 font-medium text-[#1F2937]">{formatCurrency(tx.amount)}</td>
                  <td className="py-3 px-4 text-sm text-[#4B5563]">{tx.method}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status === 'Success' && <CheckCircle size={12} />}
                      {tx.status === 'Pending' && <Clock size={12} />}
                      {tx.status === 'Failed' && <XCircle size={12} />}
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#F15A22] hover:text-[#2DAEAA] transition-colors text-sm flex items-center gap-1">
                      View <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-right">
          <button className="text-[#F15A22] hover:text-[#2DAEAA] text-sm font-medium">
            View All Transactions →
          </button>
        </div>
      </div>

      {/* Section 6: Action Buttons */}
      <div className="bg-gradient-to-r from-[#F3F4F6] to-[#F9FAFB] rounded-2xl p-6 border border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-[#F15A22]" />
            <span className="text-sm text-[#6B7280]">
              Take action on this loan application
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRequestDocs}
              className="px-6 py-2.5 border-2 border-[#F59E0B] text-[#F59E0B] rounded-xl font-medium hover:bg-[#F59E0B]/10 transition-all"
            >
              REQUEST DOCUMENTS
            </button>
            
            <button
              onClick={handleReject}
              className="px-6 py-2.5 border-2 border-[#EF4444] text-[#EF4444] rounded-xl font-medium hover:bg-[#EF4444]/10 transition-all"
            >
              REJECT
            </button>
            
            <button
              onClick={handleApprove}
              className="px-8 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              APPROVE LOAN
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}