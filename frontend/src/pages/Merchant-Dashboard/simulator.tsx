'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Gauge,
  Target,
  Sparkles,
  ChevronRight,
  Info,
  Flame
} from 'lucide-react';

export default function LimitSimulatorPage() {
  // State for simulation controls
  const [revenueTarget, setRevenueTarget] = useState(30);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Current limits
  const currentMinLimit = 50;
  const currentMaxLimit = 80;

  // Risk multipliers
  const riskMultipliers = {
    conservative: 0.8,
    moderate: 1.0,
    aggressive: 1.2
  };

  // Calculate simulated limits
  const calculateSimulatedLimits = () => {
    const multiplier = riskMultipliers[riskTolerance];
    const increaseFactor = 1 + (revenueTarget / 100) * multiplier;
    
    const newMin = Math.round(currentMinLimit * increaseFactor);
    const newMax = Math.round(currentMaxLimit * increaseFactor);
    
    return { min: newMin, max: newMax };
  };

  // Calculate downturn safe limit
  const calculateDownturnLimit = () => {
    return Math.round(currentMinLimit * 0.8);
  };

  const simulated = calculateSimulatedLimits();
  const downturnLimit = calculateDownturnLimit();
  const increasePercentage = Math.round(((simulated.max - currentMaxLimit) / currentMaxLimit) * 100);

  // Scenario calculations
  const scenarios = [
    {
      name: 'Optimistic',
      target: 50,
      min: Math.round(currentMinLimit * (1 + 0.5 * riskMultipliers[riskTolerance])),
      max: Math.round(currentMaxLimit * (1 + 0.5 * riskMultipliers[riskTolerance])),
      description: 'If target exceeded',
      icon: Flame
    },
    {
      name: 'Normal',
      target: revenueTarget,
      min: simulated.min,
      max: simulated.max,
      description: 'Meeting target',
      icon: Target,
      isCurrent: true
    },
    {
      name: 'Conservative',
      target: 0,
      min: currentMinLimit,
      max: currentMaxLimit,
      description: 'No change',
      icon: Shield
    }
  ];

  // Handle slider change with animation
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setIsAnimating(true);
    setRevenueTarget(value);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Reset to defaults
  const handleReset = () => {
    setRevenueTarget(30);
    setRiskTolerance('moderate');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount * 1000000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Limit Simulator</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Interactive Limit Simulator
          </h1>
          <p className="text-[#6B7280] mt-2">Simulate how revenue growth affects your credit limit</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E5E7EB] p-3">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
          <span className="text-sm text-[#6B7280]">Live Simulation</span>
          <Sparkles size={16} className="text-[#F15A22]" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Simulation Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Revenue Target Slider */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#FFF3ED] rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-[#F15A22]" />
              </div>
              <div>
                <h2 className="font-semibold text-[#1F2937]">📈 Revenue Increase Target</h2>
                <p className="text-xs text-[#6B7280]">Slide to adjust target growth</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">0%</span>
                <div className="relative">
                  <span className={`text-2xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent transition-all duration-300 ${isAnimating ? 'scale-125' : ''}`}>
                    {revenueTarget}%
                  </span>
                </div>
                <span className="text-sm text-[#6B7280]">100%</span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={revenueTarget}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #F15A22 0%, #2DAEAA ${revenueTarget}%, #E5E7EB ${revenueTarget}%, #E5E7EB 100%)`
                  }}
                />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 2px solid #F15A22;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                  }
                  input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    border-color: #2DAEAA;
                  }
                `}</style>
              </div>

              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>Conservative</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>

          {/* Risk Tolerance Radio */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#E0F7F6] rounded-xl flex items-center justify-center">
                <Gauge size={20} className="text-[#2DAEAA]" />
              </div>
              <div>
                <h2 className="font-semibold text-[#1F2937]">📉 Risk Tolerance</h2>
                <p className="text-xs text-[#6B7280]">Select your risk preference</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['conservative', 'moderate', 'aggressive'] as const).map((risk) => {
                const isSelected = riskTolerance === risk;
                const colors = {
                  conservative: {
                    bg: isSelected ? 'bg-[#2DAEAA]' : 'bg-[#E0F7F6]',
                    text: isSelected ? 'text-white' : 'text-[#2DAEAA]',
                    hover: 'hover:bg-[#2DAEAA]/90'
                  },
                  moderate: {
                    bg: isSelected ? 'bg-[#F15A22]' : 'bg-[#FFF3ED]',
                    text: isSelected ? 'text-white' : 'text-[#F15A22]',
                    hover: 'hover:bg-[#F15A22]/90'
                  },
                  aggressive: {
                    bg: isSelected ? 'bg-[#EF4444]' : 'bg-[#FEE2E2]',
                    text: isSelected ? 'text-white' : 'text-[#EF4444]',
                    hover: 'hover:bg-[#EF4444]/90'
                  }
                };

                return (
                  <button
                    key={risk}
                    onClick={() => setRiskTolerance(risk)}
                    className={`${colors[risk].bg} ${colors[risk].text} px-4 py-3 rounded-xl font-medium capitalize transition-all duration-300 transform hover:scale-105 ${!isSelected && 'hover:opacity-80'}`}
                  >
                    {risk}
                  </button>
                );
              })}
            </div>

            {/* Risk Description */}
            <div className="mt-4 p-3 bg-[#F9FAFB] rounded-lg">
              <p className="text-xs text-[#6B7280]">
                {riskTolerance === 'conservative' && '🛡️ Lower risk, slower growth - Focus on stability'}
                {riskTolerance === 'moderate' && '⚖️ Balanced approach - Optimal risk-reward ratio'}
                {riskTolerance === 'aggressive' && '🚀 Higher risk, faster growth - Maximize potential'}
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-gradient-to-r from-[#F15A22]/5 to-[#2DAEAA]/5 rounded-2xl border border-[#E5E7EB] p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-[#F15A22] mt-0.5" />
              <p className="text-xs text-[#6B7280]">
                Simulation based on your current credit score and transaction history. 
                Risk multiplier affects how aggressively your limit grows with revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Simulation Results Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Results Card */}
          <div className="bg-gradient-to-br from-[#E0F7F6] to-[#B2EBF2] rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2DAEAA]/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Limit */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={18} className="text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#6B7280]">Current Limit</span>
                </div>
                <p className="text-3xl font-bold text-[#1F2937] mb-1">
                  {formatCurrency(currentMinLimit)} - {formatCurrency(currentMaxLimit)}
                </p>
                <p className="text-xs text-[#6B7280]">Based on your risk score</p>
              </div>

              {/* Simulated Limit */}
              <div className="bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl p-5 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={18} className="text-white/90" />
                  <span className="text-sm font-medium text-white/90">🚀 With {revenueTarget}% revenue increase</span>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {formatCurrency(simulated.min)} - {formatCurrency(simulated.max)}
                </p>
                <p className="text-sm text-white/90 flex items-center gap-1">
                  <TrendingUp size={14} />
                  +{increasePercentage}% increase potential
                </p>
              </div>

              {/* Downturn Scenario */}
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={18} className="text-[#F59E0B]" />
                  <span className="text-sm font-medium text-[#6B7280]">⚠️ Downturn Scenario</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#1F2937]">{formatCurrency(downturnLimit)}</p>
                    <p className="text-xs text-[#6B7280]">If revenue drops 20% → Safe limit</p>
                  </div>
                  <div className="px-3 py-1 bg-[#FEF3C7] text-[#F59E0B] rounded-full text-sm">
                    Protected
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Progress Bar */}
            <div className="mt-6 pt-6 border-t border-white/30">
              <p className="text-sm font-medium text-[#1F2937] mb-3">Limit Comparison</p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                    <span>Current Max</span>
                    <span>{formatCurrency(currentMaxLimit)}</span>
                  </div>
                  <div className="h-4 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#F15A22] rounded-full transition-all duration-500"
                      style={{ width: `${(currentMaxLimit / simulated.max) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                    <span>Simulated Max</span>
                    <span className="text-[#F15A22] font-bold">{formatCurrency(simulated.max)}</span>
                  </div>
                  <div className="h-4 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Scenario Table */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">Scenario Analysis</h2>
                <p className="text-sm text-[#6B7280] mt-1">Compare different growth scenarios</p>
              </div>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[#F15A22] hover:text-[#2DAEAA] transition-colors"
              >
                {showDetails ? 'Hide details' : 'Show details'}
                <ChevronRight size={16} className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Scenario</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Min Limit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Max Limit</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((scenario, idx) => {
                    const Icon = scenario.icon;
                    const impact = ((scenario.max - currentMaxLimit) / currentMaxLimit * 100).toFixed(0);
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors ${
                          scenario.isCurrent ? 'bg-[#FFF3ED]/30' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={scenario.isCurrent ? 'text-[#F15A22]' : 'text-[#6B7280]'} />
                            <span className={`font-medium ${scenario.isCurrent ? 'text-[#F15A22]' : 'text-[#1F2937]'}`}>
                              {scenario.name}
                              {scenario.isCurrent && ' (Current)'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#1F2937]">{formatCurrency(scenario.min)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#1F2937]">{formatCurrency(scenario.max)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-[#6B7280]">{scenario.description}</span>
                        </td>
                        <td className="py-4 px-4">
                          {Number(impact) > 0 ? (
                            <span className="text-[#10B981] text-sm">+{impact}%</span>
                          ) : Number(impact) < 0 ? (
                            <span className="text-[#EF4444] text-sm">{impact}%</span>
                          ) : (
                            <span className="text-[#6B7280] text-sm">0%</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Expanded Details */}
            {showDetails && (
              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                      <span className="text-sm font-medium">Best Case</span>
                    </div>
                    <p className="text-2xl font-bold text-[#10B981]">{formatCurrency(scenarios[0].max)}</p>
                    <p className="text-xs text-[#6B7280] mt-1">50% revenue growth</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#F15A22] rounded-full"></div>
                      <span className="text-sm font-medium">Expected</span>
                    </div>
                    <p className="text-2xl font-bold text-[#F15A22]">{formatCurrency(scenarios[1].max)}</p>
                    <p className="text-xs text-[#6B7280] mt-1">{revenueTarget}% revenue growth</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#6B7280] rounded-full"></div>
                      <span className="text-sm font-medium">Worst Case</span>
                    </div>
                    <p className="text-2xl font-bold text-[#6B7280]">{formatCurrency(scenarios[2].max)}</p>
                    <p className="text-xs text-[#6B7280] mt-1">No growth</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Action Buttons */}
      <div className="bg-gradient-to-r from-[#F3F4F6] to-[#F9FAFB] rounded-2xl p-6 border border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center animate-pulse">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937]">Ready to apply?</h3>
              <p className="text-sm text-[#6B7280]">Use this simulation to guide your application</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border border-[#E5E7EB] bg-white rounded-xl font-medium hover:border-[#F15A22] hover:text-[#F15A22] transition-all duration-300"
            >
              <RefreshCw size={16} />
              Reset to Default
            </button>
            
            <button className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Apply with This Simulation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Calculation Logic Disclosure */}
        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <details className="group">
            <summary className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer hover:text-[#1F2937]">
              <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
              View calculation logic
            </summary>
            <div className="mt-3 p-4 bg-white rounded-lg text-sm text-[#6B7280] space-y-2">
              <p>📊 New limit = Current limit × (1 + (target/100) × risk_multiplier)</p>
              <p>• Conservative multiplier: 0.8</p>
              <p>• Moderate multiplier: 1.0</p>
              <p>• Aggressive multiplier: 1.2</p>
              <p>⚠️ Downturn safe limit = Current limit × 0.8 (20% buffer)</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}