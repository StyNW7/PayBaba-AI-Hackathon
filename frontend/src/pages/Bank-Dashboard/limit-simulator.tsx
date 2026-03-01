/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  ChevronRight,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Shield,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  RefreshCw,
  Building2,
  XCircle,
  Minus
} from 'lucide-react';
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';

// Types
interface MerchantBaseline {
  id: string;
  name: string;
  category: string;
  avgMonthlyRevenue: number;
  transactionVolume: number;
  revenueVolatility: number;
  refundRate: number;
  settlementSpeed: number;
  creditScore: number;
  riskBand: 'Low' | 'Medium' | 'High';
  scoreHistory: { month: string; score: number }[];
}

interface SimulationResult {
  scenario: string;
  adjustedRevenue: number;
  exposureMin: number;
  exposureMax: number;
  riskDelta: 'Stable' | 'Elevated' | 'High';
  volatilityImpact: number;
  refundRateImpact: number;
  settlementImpact: number;
  confidenceScore: number;
}

// Sample merchant data
const sampleMerchants: MerchantBaseline[] = [
  {
    id: 'MRC-1772300671201-674',
    name: 'PT Mega Jaya Commerce',
    category: 'Retail',
    avgMonthlyRevenue: 119663333,
    transactionVolume: 768,
    revenueVolatility: 21.79,
    refundRate: 3.00,
    settlementSpeed: 2.0,
    creditScore: 73,
    riskBand: 'Medium',
    scoreHistory: [
      { month: 'Jan', score: 68 },
      { month: 'Feb', score: 70 },
      { month: 'Mar', score: 71 },
      { month: 'Apr', score: 73 },
      { month: 'May', score: 72 },
      { month: 'Jun', score: 73 },
    ]
  },
  {
    id: 'MRC-1772300674990-350',
    name: 'CV Maju Bersama',
    category: 'Retail',
    avgMonthlyRevenue: 85000000,
    transactionVolume: 450,
    revenueVolatility: 32.50,
    refundRate: 5.20,
    settlementSpeed: 3.5,
    creditScore: 59,
    riskBand: 'High',
    scoreHistory: [
      { month: 'Jan', score: 62 },
      { month: 'Feb', score: 60 },
      { month: 'Mar', score: 58 },
      { month: 'Apr', score: 59 },
      { month: 'May', score: 57 },
      { month: 'Jun', score: 59 },
    ]
  },
  {
    id: 'MRC-1772300676603-278',
    name: 'UD Sederhana',
    category: 'Retail',
    avgMonthlyRevenue: 45000000,
    transactionVolume: 230,
    revenueVolatility: 15.20,
    refundRate: 1.50,
    settlementSpeed: 1.2,
    creditScore: 84,
    riskBand: 'Low',
    scoreHistory: [
      { month: 'Jan', score: 80 },
      { month: 'Feb', score: 81 },
      { month: 'Mar', score: 82 },
      { month: 'Apr', score: 83 },
      { month: 'May', score: 84 },
      { month: 'Jun', score: 84 },
    ]
  }
];

// Revenue adjustment options
const revenueAdjustments = [
  { value: -30, label: '-30% (Severe Downturn)', icon: TrendingDown, color: '#EF4444' },
  { value: -20, label: '-20% (Downturn)', icon: TrendingDown, color: '#F59E0B' },
  { value: -10, label: '-10% (Mild Downturn)', icon: TrendingDown, color: '#F59E0B' },
  { value: 0, label: 'Baseline (No Change)', icon: Minus, color: '#6B7280' },
  { value: 10, label: '+10% (Mild Growth)', icon: TrendingUp, color: '#10B981' },
  { value: 20, label: '+20% (Growth)', icon: TrendingUp, color: '#10B981' },
  { value: 30, label: '+30% (Aggressive Growth)', icon: TrendingUp, color: '#10B981' },
];

// Risk stance options
const riskStances = [
  { 
    value: 'conservative', 
    label: 'Conservative', 
    description: 'Larger haircut, prioritize stability',
    haircut: 0.5,
    color: '#3B82F6',
    icon: ShieldCheck
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    description: 'Balanced approach',
    haircut: 0.65,
    color: '#F59E0B',
    icon: Shield
  },
  { 
    value: 'aggressive', 
    label: 'Aggressive', 
    description: 'Smaller haircut, higher exposure',
    haircut: 0.8,
    color: '#F15A22',
    icon: ShieldAlert
  },
];

export default function BankLimitSimulatorPage() {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(sampleMerchants[0].id);
  const [selectedAdjustment, setSelectedAdjustment] = useState<number>(0);
  const [selectedRiskStance, setSelectedRiskStance] = useState<string>('moderate');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  // Get selected merchant
  const selectedMerchant = sampleMerchants.find(m => m.id === selectedMerchantId) || sampleMerchants[0];

  // Run simulation
  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const adjustment = revenueAdjustments.find(a => a.value === selectedAdjustment)!;
      const riskStance = riskStances.find(r => r.value === selectedRiskStance)!;
      
      // Calculate adjusted revenue
      const adjustmentMultiplier = 1 + (selectedAdjustment / 100);
      const adjustedRevenue = selectedMerchant.avgMonthlyRevenue * adjustmentMultiplier;
      
      // Calculate exposure range based on risk stance and credit score
      const baseExposure = adjustedRevenue * 3; // 3x monthly revenue as base
      const scoreMultiplier = selectedMerchant.creditScore / 100;
      const riskMultiplier = riskStance.haircut;
      
      const exposureMin = Math.round(baseExposure * scoreMultiplier * 0.8 * riskMultiplier);
      const exposureMax = Math.round(baseExposure * scoreMultiplier * 1.2 * riskMultiplier);
      
      // Calculate risk delta
      const volatilityImpact = selectedMerchant.revenueVolatility * (1 + Math.abs(selectedAdjustment) / 200);
      const refundRateImpact = selectedMerchant.refundRate * (1 + (selectedAdjustment > 0 ? 0.1 : 0.2));
      const settlementImpact = selectedMerchant.settlementSpeed * (1 + Math.abs(selectedAdjustment) / 300);
      
      // Determine risk delta
      let riskDelta: 'Stable' | 'Elevated' | 'High';
      const totalRisk = (volatilityImpact / 20) + (refundRateImpact / 3) + (settlementImpact / 2);
      
      if (totalRisk < 2) riskDelta = 'Stable';
      else if (totalRisk < 3.5) riskDelta = 'Elevated';
      else riskDelta = 'High';
      
      // Confidence score based on data quality and volatility
      const confidenceScore = Math.max(60, Math.min(95, 
        100 - (selectedMerchant.revenueVolatility / 2) - (selectedMerchant.refundRate * 2)
      ));
      
      const result: SimulationResult = {
        scenario: adjustment.label,
        adjustedRevenue,
        exposureMin,
        exposureMax,
        riskDelta,
        volatilityImpact,
        refundRateImpact,
        settlementImpact,
        confidenceScore: Math.round(confidenceScore)
      };
      
      setSimulationResult(result);
      
      // Generate comparison data for chart
      setComparisonData([
        {
          name: 'Baseline',
          revenue: selectedMerchant.avgMonthlyRevenue / 1000000,
          exposure: Math.round(selectedMerchant.avgMonthlyRevenue * 3 * (selectedMerchant.creditScore / 100) * 0.65 / 1000000),
          risk: 'Moderate'
        },
        {
          name: adjustment.label,
          revenue: adjustedRevenue / 1000000,
          exposure: Math.round((exposureMin + exposureMax) / 2 / 1000000),
          risk: riskDelta
        }
      ]);
      
      setIsSimulating(false);
    }, 800);
  };

  // Run simulation when parameters change
  useEffect(() => {
    runSimulation();
  }, [selectedMerchantId, selectedAdjustment, selectedRiskStance]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCurrencyMillions = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E7EB]">
          <p className="font-semibold text-[#1F2937] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#6B7280]">{entry.name}:</span>
              <span className="font-medium text-[#1F2937]">
                {entry.name.includes('Revenue') ? formatCurrencyMillions(entry.value * 1000000) : 
                 entry.name.includes('Exposure') ? formatCurrencyMillions(entry.value * 1000000) : 
                 entry.value}
              </span>
            </div>
          ))}
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
            <span>Bank</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Limit Simulator</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Bank Limit Simulator
          </h1>
          <p className="text-[#6B7280] mt-2">Scenario-based credit capacity analysis for internal bank use only</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSimulating ? 'animate-spin' : ''} />
            <span>Run Simulation</span>
          </button>
        </div>
      </div>

      {/* Disclaimer Banner */}
      {showDisclaimer && (
        <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#F15A22]/10 border border-[#F59E0B]/20 rounded-2xl p-4 relative">
          <button
            onClick={() => setShowDisclaimer(false)}
            className="absolute top-4 right-4 text-[#6B7280] hover:text-[#1F2937]"
          >
            <XCircle size={18} />
          </button>
          <div className="flex items-start gap-3 pr-8">
            <div className="w-8 h-8 bg-[#F59E0B]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info size={18} className="text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F2937] mb-1">Important Disclaimer</h3>
              <p className="text-sm text-[#6B7280]">
                This is an internal analytical tool for scenario-based credit capacity analysis. 
                All outputs are indicative only, not final approval, not binding, and do not constitute 
                an official offer. Final credit decisions rest entirely with the bank following internal 
                policies and regulations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input Parameters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Merchant Selection */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-[#F15A22]" />
              Select Merchant
            </h2>
            
            <select
              value={selectedMerchantId}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white mb-4"
            >
              {sampleMerchants.map(merchant => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name} - {merchant.riskBand} Risk
                </option>
              ))}
            </select>

            {/* Merchant Baseline Summary */}
            <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Baseline Data (Read-Only)</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-[#6B7280]">Credit Score</p>
                  <p className={`font-bold ${
                    selectedMerchant.creditScore >= 80 ? 'text-[#10B981]' :
                    selectedMerchant.creditScore >= 60 ? 'text-[#F59E0B]' :
                    'text-[#EF4444]'
                  }`}>
                    {selectedMerchant.creditScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Risk Band</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedMerchant.riskBand === 'Low' ? 'bg-[#10B981]/10 text-[#10B981]' :
                    selectedMerchant.riskBand === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                    'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    {selectedMerchant.riskBand}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#6B7280]">Avg Monthly Revenue</p>
                <p className="font-semibold text-[#1F2937]">{formatCurrency(selectedMerchant.avgMonthlyRevenue)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-[#6B7280]">Transaction Volume</p>
                  <p className="font-medium text-[#1F2937]">{selectedMerchant.transactionVolume}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Volatility</p>
                  <p className="font-medium text-[#1F2937]">{selectedMerchant.revenueVolatility}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-[#6B7280]">Refund Rate</p>
                  <p className={`font-medium ${selectedMerchant.refundRate > 4 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                    {selectedMerchant.refundRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Settlement</p>
                  <p className="font-medium text-[#1F2937]}">{selectedMerchant.settlementSpeed} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Parameters */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#F15A22]" />
              Scenario Parameters
              <span className="text-xs font-normal text-[#6B7280] ml-2">(Bank-Controlled)</span>
            </h2>

            {/* Revenue Adjustment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#1F2937] mb-3">
                Revenue Adjustment
              </label>
              <div className="space-y-2">
                {revenueAdjustments.map((adj) => {
                  const Icon = adj.icon;
                  return (
                    <button
                      key={adj.value}
                      onClick={() => setSelectedAdjustment(adj.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedAdjustment === adj.value
                          ? 'border-[#F15A22] bg-gradient-to-r from-[#FFF3ED] to-[#FFE5D5]'
                          : 'border-[#E5E7EB] hover:border-[#F15A22]/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedAdjustment === adj.value ? 'bg-[#F15A22]' : 'bg-[#F3F4F6]'
                      }`}>
                        <Icon size={16} className={selectedAdjustment === adj.value ? 'text-white' : 'text-[#6B7280]'} />
                      </div>
                      <span className={`text-sm font-medium ${
                        selectedAdjustment === adj.value ? 'text-[#F15A22]' : 'text-[#1F2937]'
                      }`}>
                        {adj.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Risk Stance */}
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-3">
                Risk Stance / Appetite
              </label>
              <div className="space-y-2">
                {riskStances.map((stance) => {
                  const Icon = stance.icon;
                  return (
                    <button
                      key={stance.value}
                      onClick={() => setSelectedRiskStance(stance.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedRiskStance === stance.value
                          ? 'border-[#F15A22] bg-gradient-to-r from-[#FFF3ED] to-[#FFE5D5]'
                          : 'border-[#E5E7EB] hover:border-[#F15A22]/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedRiskStance === stance.value ? 'bg-[#F15A22]' : 'bg-[#F3F4F6]'
                      }`}>
                        <Icon size={16} className={selectedRiskStance === stance.value ? 'text-white' : 'text-[#6B7280]'} />
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-medium ${
                          selectedRiskStance === stance.value ? 'text-[#F15A22]' : 'text-[#1F2937]'
                        }`}>
                          {stance.label}
                        </p>
                        <p className="text-xs text-[#6B7280]">{stance.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loading State */}
          {isSimulating && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#F15A22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#6B7280]">Running simulation...</p>
              </div>
            </div>
          )}

          {/* Simulation Results */}
          {!isSimulating && simulationResult && (
            <>
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Simulation Result</h2>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {simulationResult.scenario}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Indicative Exposure Range */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">Indicative Exposure Range</p>
                    <p className="text-3xl font-bold mb-1">
                      {formatCurrencyMillions(simulationResult.exposureMin)} - {formatCurrencyMillions(simulationResult.exposureMax)}
                    </p>
                    <p className="text-white/60 text-xs">Estimated financing capacity</p>
                  </div>

                  {/* Risk Delta */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-white/80 text-sm mb-1">Risk Delta Indicator</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        simulationResult.riskDelta === 'Stable' ? 'bg-[#10B981] text-white' :
                        simulationResult.riskDelta === 'Elevated' ? 'bg-[#F59E0B] text-white' :
                        'bg-[#EF4444] text-white'
                      }`}>
                        {simulationResult.riskDelta}
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">Risk level under this scenario</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-white/80 text-xs">Adjusted Revenue</p>
                    <p className="font-semibold">{formatCurrencyMillions(simulationResult.adjustedRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-xs">Volatility Impact</p>
                    <p className="font-semibold">{simulationResult.volatilityImpact.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-xs">Confidence Score</p>
                    <p className="font-semibold">{simulationResult.confidenceScore}%</p>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#F15A22]" />
                  Scenario Comparison
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis yAxisId="left" stroke="#6B7280" tickFormatter={(value) => `Rp${value}M`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" tickFormatter={(value) => `Rp${value}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Monthly Revenue" fill="#F15A22" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="exposure" name="Est. Exposure" fill="#2DAEAA" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#F15A22" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Impact Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-[#F15A22]" />
                    <h3 className="font-semibold text-[#1F2937]">Volatility Impact</h3>
                  </div>
                  <p className={`text-2xl font-bold ${
                    simulationResult.volatilityImpact > 25 ? 'text-[#EF4444]' :
                    simulationResult.volatilityImpact > 18 ? 'text-[#F59E0B]' :
                    'text-[#10B981]'
                  }`}>
                    {simulationResult.volatilityImpact.toFixed(1)}%
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {simulationResult.volatilityImpact > 25 ? 'High volatility' :
                     simulationResult.volatilityImpact > 18 ? 'Moderate volatility' :
                     'Low volatility'}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-[#F15A22]" />
                    <h3 className="font-semibold text-[#1F2937]">Refund Rate Impact</h3>
                  </div>
                  <p className={`text-2xl font-bold ${
                    simulationResult.refundRateImpact > 4 ? 'text-[#EF4444]' :
                    simulationResult.refundRateImpact > 2.5 ? 'text-[#F59E0B]' :
                    'text-[#10B981]'
                  }`}>
                    {simulationResult.refundRateImpact.toFixed(1)}%
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {simulationResult.refundRateImpact > 4 ? 'High risk' :
                     simulationResult.refundRateImpact > 2.5 ? 'Moderate risk' :
                     'Low risk'}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#F15A22]" />
                    <h3 className="font-semibold text-[#1F2937]">Settlement Impact</h3>
                  </div>
                  <p className={`text-2xl font-bold ${
                    simulationResult.settlementImpact > 3 ? 'text-[#EF4444]' :
                    simulationResult.settlementImpact > 2 ? 'text-[#F59E0B]' :
                    'text-[#10B981]'
                  }`}>
                    {simulationResult.settlementImpact.toFixed(1)} days
                  </p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {simulationResult.settlementImpact > 3 ? 'Slow settlement' :
                     simulationResult.settlementImpact > 2 ? 'Average' :
                     'Fast settlement'}
                  </p>
                </div>
              </div>

              {/* Credit Score Trend */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <PieChart size={18} className="text-[#F15A22]" />
                  Credit Score History (6 Months)
                </h2>

                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={selectedMerchant.scoreHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F15A22" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F15A22" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis domain={[40, 100]} stroke="#6B7280" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#F15A22"
                      strokeWidth={2}
                      fill="url(#colorScore)"
                      dot={{ fill: '#F15A22', r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-[#6B7280] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#6B7280]">
            <span className="font-semibold">Important:</span> This simulator is for internal bank use only. 
            All outputs are indicative and not binding. The final credit decision rests entirely with the bank 
            following internal policies, applicable regulations, and risk management processes. Paylabs provides 
            data only and does not participate in credit decisions.
          </p>
        </div>
      </div>
    </div>
  );
}