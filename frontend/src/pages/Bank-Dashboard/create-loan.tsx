/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  DollarSign,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  FileText
} from 'lucide-react';
import { bankApi, type CreateLoanApplicationRequest } from '@/services/api';

// Sample merchant list
const sampleMerchants = [
  { 
    id: 'MRC-1772300671201-674', 
    name: 'PT Mega Jaya Commerce', 
    category: 'Retail',
    creditScore: 73,
    riskBand: 'Medium',
    monthlyRevenue: 119663333
  },
  { 
    id: 'MRC-1772300674990-350', 
    name: 'CV Maju Bersama', 
    category: 'Retail',
    creditScore: 59,
    riskBand: 'High',
    monthlyRevenue: 85000000
  },
  { 
    id: 'MRC-1772300676603-278', 
    name: 'UD Sederhana', 
    category: 'Retail',
    creditScore: 54,
    riskBand: 'High',
    monthlyRevenue: 45000000
  },
];

// Sample banks
const banks = [
  { id: 'BANK001', name: 'Bank ABC', interestRate: '8.5%' },
  { id: 'BANK002', name: 'Bank XYZ', interestRate: '9.0%' },
  { id: 'BANK003', name: 'Bank Mandiri', interestRate: '8.75%' },
  { id: 'BANK004', name: 'Bank BNI', interestRate: '8.25%' },
  { id: 'BANK005', name: 'Bank BRI', interestRate: '8.5%' },
];

// Tenor options
const tenorOptions = [6, 12, 18, 24, 36, 48, 60];

export default function CreateLoanApplicationPage() {
  const navigate = useNavigate();
  
  // Form state
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(sampleMerchants[0].id);
  const [selectedBankId, setSelectedBankId] = useState<string>(banks[0].id);
  const [amount, setAmount] = useState<string>('');
  const [tenor, setTenor] = useState<number>(12);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Get selected merchant details
  const selectedMerchant = sampleMerchants.find(m => m.id === selectedMerchantId);
  
  // Get selected bank details
  const selectedBank = banks.find(b => b.id === selectedBankId);

  // Calculate recommended max amount (based on credit score and monthly revenue)
  const calculateRecommendedMax = () => {
    if (!selectedMerchant) return 0;
    
    const baseAmount = selectedMerchant.monthlyRevenue * 3; // 3x monthly revenue
    const scoreMultiplier = selectedMerchant.creditScore >= 80 ? 1.5 :
                           selectedMerchant.creditScore >= 70 ? 1.2 :
                           selectedMerchant.creditScore >= 60 ? 1.0 : 0.8;
    
    return Math.round(baseAmount * scoreMultiplier);
  };

  // Validate form
  const validateForm = (): boolean => {
    const amountNum = parseFloat(amount);
    
    if (!selectedMerchantId) {
      setError('Please select a merchant');
      return false;
    }
    
    if (!selectedBankId) {
      setError('Please select a bank');
      return false;
    }
    
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid loan amount');
      return false;
    }
    
    const maxRecommended = calculateRecommendedMax();
    if (amountNum > maxRecommended * 1.5) {
      setError(`Amount seems too high. Recommended maximum is ${formatCurrency(maxRecommended)}`);
      return false;
    }
    
    if (!tenor) {
      setError('Please select a loan tenor');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData: CreateLoanApplicationRequest = {
        merchantId: selectedMerchantId,
        bankId: selectedBankId,
        amount: parseFloat(amount),
        tenor: tenor,
        status: 'Draft'
      };

      const response = await bankApi.createLoanApplication(requestData);
      
      if (response.success && response.data) {
        setResult(response.data);
        setSuccess(true);
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          navigate('/bank/loans');
        }, 3000);
      } else {
        setError(response.message || 'Failed to create loan application');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create loan application');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get risk badge color
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'text-[#10B981] bg-[#10B981]/10';
      case 'Medium': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'High': return 'text-[#EF4444] bg-[#EF4444]/10';
      default: return 'text-[#6B7280] bg-[#6B7280]/10';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <button
              onClick={() => navigate('/bank/loan-applications')}
              className="hover:text-[#F15A22] transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Loan Applications
            </button>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Create Application</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            New Loan Application
          </h1>
          <p className="text-[#6B7280] mt-2">Create a new loan application for a merchant</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && result && (
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 text-white shadow-xl animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Loan Application Created Successfully!</h2>
              <p className="text-white/90 mb-2">Application ID: {result.applicationId}</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-white/80 text-sm">Amount</p>
                  <p className="font-semibold">{formatCurrency(parseFloat(result.amount))}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Tenor</p>
                  <p className="font-semibold">{result.tenor} months</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Credit Score</p>
                  <p className="font-semibold">{result.creditScoreAtApplication}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Risk Band</p>
                  <p className="font-semibold">{result.riskBandAtApplication}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm mt-3">Redirecting to applications list...</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section - Left */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            {/* Merchant Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Select Merchant <span className="text-[#F15A22]">*</span>
              </label>
              <select
                value={selectedMerchantId}
                onChange={(e) => setSelectedMerchantId(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
                disabled={loading || success}
              >
                {sampleMerchants.map(merchant => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.name} - {merchant.category} (Score: {merchant.creditScore})
                  </option>
                ))}
              </select>
            </div>

            {/* Bank Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Select Bank <span className="text-[#F15A22]">*</span>
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => setSelectedBankId(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
                disabled={loading || success}
              >
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name} - Interest Rate: {bank.interestRate}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-semibold text-[#1F2937] mb-2">
                Loan Amount (IDR) <span className="text-[#F15A22]">*</span>
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="amount"
                  type="number"
                  min="1000000"
                  step="1000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 500000000"
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
                  disabled={loading || success}
                />
              </div>
              {selectedMerchant && (
                <p className="text-xs text-[#6B7280] mt-2">
                  Recommended max: {formatCurrency(calculateRecommendedMax())} based on credit score and revenue
                </p>
              )}
            </div>

            {/* Tenor Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                Loan Tenor (Months) <span className="text-[#F15A22]">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {tenorOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTenor(option)}
                    className={`py-3 px-2 rounded-lg border-2 transition-all ${
                      tenor === option
                        ? 'border-[#F15A22] bg-gradient-to-r from-[#FFF3ED] to-[#FFE5D5] text-[#F15A22] font-semibold'
                        : 'border-[#E5E7EB] hover:border-[#F15A22]/50 text-[#1F2937]'
                    }`}
                    disabled={loading || success}
                  >
                    {option}m
                  </button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Application...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={18} />
                  Application Created!
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Create Loan Application
                </>
              )}
            </button>
          </form>
        </div>

        {/* Summary Section - Right */}
        <div className="space-y-6">
          {/* Merchant Info */}
          {selectedMerchant && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-[#F15A22]" />
                Merchant Information
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#6B7280]">Company Name</p>
                  <p className="font-medium text-[#1F2937]">{selectedMerchant.name}</p>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280]">Category</p>
                  <p className="text-sm text-[#4B5563]">{selectedMerchant.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280]">Credit Score</p>
                    <p className={`font-bold ${
                      selectedMerchant.creditScore >= 85 ? 'text-[#10B981]' : 
                      selectedMerchant.creditScore >= 70 ? 'text-[#F59E0B]' : 
                      'text-[#EF4444]'
                    }`}>
                      {selectedMerchant.creditScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Risk Band</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedMerchant.riskBand)}`}>
                      {selectedMerchant.riskBand}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#6B7280]">Monthly Revenue</p>
                  <p className="font-semibold text-[#1F2937]">{formatCurrency(selectedMerchant.monthlyRevenue)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bank Info */}
          {selectedBank && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-[#2DAEAA]" />
                Bank Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#6B7280]">Bank Name</p>
                  <p className="font-medium text-[#1F2937]">{selectedBank.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Interest Rate</p>
                  <p className="text-lg font-bold text-[#2DAEAA]">{selectedBank.interestRate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-[#F15A22]/10 to-[#2DAEAA]/10 rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#F15A22]" />
              <h3 className="font-semibold text-[#1F2937]">Application Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>Applications start as Draft - you can review before submitting</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>Loan amount is based on merchant's credit score and revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>Longer tenors may have higher interest rates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>You can track application status in the list view</span>
              </li>
            </ul>
          </div>

          {/* Loan Summary Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#F15A22]" />
                Loan Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#6B7280]">Principal Amount</span>
                  <span className="font-semibold text-[#1F2937]">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#6B7280]">Tenor</span>
                  <span className="font-semibold text-[#1F2937]">{tenor} months</span>
                </div>
                {selectedBank && (
                  <div className="flex justify-between">
                    <span className="text-sm text-[#6B7280]">Interest Rate</span>
                    <span className="font-semibold text-[#2DAEAA]">{selectedBank.interestRate}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-[#E5E7EB]">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-[#1F2937]">Estimated Monthly Payment</span>
                    <span className="text-lg font-bold text-[#F15A22]">
                      {formatCurrency(parseFloat(amount) / tenor * 1.08)}*
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">*Includes estimated interest, subject to final approval</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}