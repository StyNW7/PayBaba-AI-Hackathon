/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Cloud,
  HardDrive,
  Code,
  FileText,
  MoreVertical,
  Bell,
  BellOff,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Types
interface ServiceStatus {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  uptime?: string;
  used?: string;
  total?: string;
  latency?: string;
  responseTime?: string;
  successRate?: string;
  requestsPerMin?: string;
  tokensPerMin?: string;
  icon: any;
  color: string;
}

interface ModelPerformance {
  model: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
  latency: string;
  lastTrain: string;
  status: 'Active' | 'Training' | 'Inactive';
  color: string;
}

interface PipelineJob {
  jobName: string;
  schedule: string;
  lastRun: string;
  duration: string;
  records: string;
  status: 'Success' | 'Failed' | 'Pending' | 'Running';
}

interface APIEndpoint {
  endpoint: string;
  calls: string;
  avgLatency: string;
  errorRate: string;
  p95Latency: string;
  trend: 'up' | 'down' | 'stable';
}

// Dummy data
const serviceStatuses: ServiceStatus[] = [
  {
    name: 'OSS Storage',
    status: 'Healthy',
    uptime: '99.9%',
    used: '45.2GB',
    total: '100GB',
    latency: '45ms',
    icon: HardDrive,
    color: '#F15A22'
  },
  {
    name: 'PAI Model',
    status: 'Healthy',
    responseTime: '150ms',
    successRate: '98.5%',
    requestsPerMin: '245',
    icon: Brain,
    color: '#2DAEAA'
  },
  {
    name: 'Qwen API',
    status: 'Healthy',
    responseTime: '450ms',
    successRate: '97.8%',
    tokensPerMin: '12.5k',
    icon: Cloud,
    color: '#8B5CF6'
  }
];

const modelPerformance: ModelPerformance[] = [
  {
    model: 'Credit Scoring',
    accuracy: '92%',
    precision: '91%',
    recall: '93%',
    f1: '0.92',
    latency: '85ms',
    lastTrain: '24/02/26',
    status: 'Active',
    color: '#F15A22'
  },
  {
    model: 'Fraud Detection',
    accuracy: '88%',
    precision: '86%',
    recall: '89%',
    f1: '0.87',
    latency: '120ms',
    lastTrain: '20/02/26',
    status: 'Active',
    color: '#2DAEAA'
  },
  {
    model: 'Early Warning',
    accuracy: '90%',
    precision: '89%',
    recall: '91%',
    f1: '0.90',
    latency: '95ms',
    lastTrain: '22/02/26',
    status: 'Active',
    color: '#8B5CF6'
  },
  {
    model: 'Risk Assessment',
    accuracy: '89%',
    precision: '88%',
    recall: '90%',
    f1: '0.89',
    latency: '110ms',
    lastTrain: '23/02/26',
    status: 'Active',
    color: '#F59E0B'
  }
];

const pipelineJobs: PipelineJob[] = [
  {
    jobName: 'Daily Scoring',
    schedule: '01:00 AM',
    lastRun: '01:03 AM',
    duration: '3min',
    records: '1,234',
    status: 'Success'
  },
  {
    jobName: 'Data Sync',
    schedule: 'Every hour',
    lastRun: '09:00 AM',
    duration: '45s',
    records: '45,234',
    status: 'Success'
  },
  {
    jobName: 'Model Retrain',
    schedule: 'Weekly',
    lastRun: '-',
    duration: '-',
    records: '-',
    status: 'Pending'
  },
  {
    jobName: 'Feature Store Update',
    schedule: 'Every 6 hours',
    lastRun: '08:30 AM',
    duration: '2min',
    records: '12,456',
    status: 'Success'
  },
  {
    jobName: 'Data Validation',
    schedule: 'Every 2 hours',
    lastRun: '10:00 AM',
    duration: '30s',
    records: '89,234',
    status: 'Success'
  }
];

const apiEndpoints: APIEndpoint[] = [
  {
    endpoint: '/api/score',
    calls: '5,432',
    avgLatency: '95ms',
    errorRate: '0.2%',
    p95Latency: '120ms',
    trend: 'up'
  },
  {
    endpoint: '/api/explain',
    calls: '3,221',
    avgLatency: '450ms',
    errorRate: '0.5%',
    p95Latency: '580ms',
    trend: 'stable'
  },
  {
    endpoint: '/api/timing',
    calls: '2,109',
    avgLatency: '120ms',
    errorRate: '0.1%',
    p95Latency: '150ms',
    trend: 'down'
  },
  {
    endpoint: '/api/risk',
    calls: '1,876',
    avgLatency: '180ms',
    errorRate: '0.3%',
    p95Latency: '220ms',
    trend: 'stable'
  }
];

// Resource usage data for chart
const resourceData = [
  { time: '00:00', cpu: 45, memory: 52, requests: 120 },
  { time: '04:00', cpu: 32, memory: 48, requests: 80 },
  { time: '08:00', cpu: 68, memory: 72, requests: 320 },
  { time: '12:00', cpu: 85, memory: 88, requests: 520 },
  { time: '16:00', cpu: 78, memory: 82, requests: 480 },
  { time: '20:00', cpu: 56, memory: 64, requests: 280 },
];

export default function AIOpsDashboardPage() {
  const [, setSelectedService] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Healthy':
      case 'Active':
      case 'Success':
        return <CheckCircle size={16} className="text-[#10B981]" />;
      case 'Degraded':
      case 'Warning':
        return <AlertCircle size={16} className="text-[#F59E0B]" />;
      case 'Down':
      case 'Failed':
        return <XCircle size={16} className="text-[#EF4444]" />;
      case 'Pending':
        return <Clock size={16} className="text-[#6B7280]" />;
      case 'Running':
        return <RefreshCw size={16} className="text-[#3B82F6] animate-spin" />;
      default:
        return <CheckCircle size={16} className="text-[#6B7280]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Healthy':
      case 'Active':
      case 'Success':
        return 'text-[#10B981] bg-[#10B981]/10';
      case 'Degraded':
      case 'Warning':
        return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'Down':
      case 'Failed':
        return 'text-[#EF4444] bg-[#EF4444]/10';
      case 'Pending':
        return 'text-[#6B7280] bg-[#6B7280]/10';
      case 'Running':
        return 'text-[#3B82F6] bg-[#3B82F6]/10';
      default:
        return 'text-[#6B7280] bg-[#6B7280]/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up':
        return <TrendingUp size={14} className="text-[#10B981]" />;
      case 'down':
        return <TrendingDown size={14} className="text-[#EF4444]" />;
      default:
        return null;
    }
  };

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => setIsRetraining(false), 3000);
  };

  const handleClearCache = () => {
    alert('Cache cleared successfully!');
  };

  const handleViewLogs = () => {
    setShowLogs(!showLogs);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E7EB]">
          <p className="text-sm font-medium text-[#1F2937] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#6B7280]">{entry.name}:</span>
              <span className="font-medium text-[#1F2937]">{entry.value}{entry.name === 'requests' ? '' : '%'}</span>
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
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            AI Ops Dashboard
          </h1>
          <p className="text-[#6B7280] mt-2">Monitor service health, model performance, and pipeline operations</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              autoRefresh 
                ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white' 
                : 'bg-white border border-[#E5E7EB] text-[#6B7280]'
            }`}
          >
            {autoRefresh ? <Bell size={16} /> : <BellOff size={16} />}
            <span className="text-sm">Auto-refresh {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>

          <button className="p-2.5 border border-[#E5E7EB] rounded-xl hover:border-[#F15A22] transition-colors">
            <RefreshCw size={18} className="text-[#6B7280]" />
          </button>

          <button className="p-2.5 border border-[#E5E7EB] rounded-xl hover:border-[#F15A22] transition-colors">
            <Download size={18} className="text-[#6B7280" />
          </button>
        </div>
      </div>

      {/* Section 1: Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceStatuses.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setSelectedService(service.name)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${service.color}20` }}>
                    <Icon size={20} style={{ color: service.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2937]">{service.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {getStatusIcon(service.status)}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} className="text-[#6B7280]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {service.uptime && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Uptime</p>
                    <p className="font-medium text-[#1F2937]">{service.uptime}</p>
                  </div>
                )}
                {service.used && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Storage</p>
                    <p className="font-medium text-[#1F2937]">{service.used}/{service.total}</p>
                  </div>
                )}
                {service.latency && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Latency</p>
                    <p className="font-medium text-[#1F2937]">{service.latency}</p>
                  </div>
                )}
                {service.responseTime && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Response Time</p>
                    <p className="font-medium text-[#1F2937]">{service.responseTime}</p>
                  </div>
                )}
                {service.successRate && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Success Rate</p>
                    <p className="font-medium text-[#1F2937]">{service.successRate}</p>
                  </div>
                )}
                {service.requestsPerMin && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Requests/min</p>
                    <p className="font-medium text-[#1F2937]">{service.requestsPerMin}</p>
                  </div>
                )}
                {service.tokensPerMin && (
                  <div>
                    <p className="text-xs text-[#6B7280]">Tokens/min</p>
                    <p className="font-medium text-[#1F2937]">{service.tokensPerMin}</p>
                  </div>
                )}
              </div>

              {/* Mini progress bar for storage */}
              {service.used && (
                <div className="mt-4">
                  <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${(parseInt(service.used) / parseInt(service.total!)) * 100}%`,
                        backgroundColor: service.color
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resource Usage Chart */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
              <Activity size={18} className="text-[#F15A22]" />
              Resource Usage (24h)
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">CPU, Memory, and Request load</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#F15A22] rounded-full"></div>
              <span className="text-xs text-[#6B7280]">CPU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2DAEAA] rounded-full"></div>
              <span className="text-xs text-[#6B7280]">Memory</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#8B5CF6] rounded-full"></div>
              <span className="text-xs text-[#6B7280]">Requests</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="time" stroke="#6B7280" />
            <YAxis yAxisId="left" stroke="#6B7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="left" type="monotone" dataKey="cpu" stackId="1" stroke="#F15A22" fill="#F15A22" fillOpacity={0.2} />
            <Area yAxisId="left" type="monotone" dataKey="memory" stackId="1" stroke="#2DAEAA" fill="#2DAEAA" fillOpacity={0.2} />
            <Area yAxisId="right" type="monotone" dataKey="requests" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Section 2: Model Performance Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2 mb-6">
          <Brain size={18} className="text-[#F15A22]" />
          Model Performance Metrics
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Model</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Accuracy</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Precision</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Recall</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">F1 Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Latency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Last Train</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Status</th>
              </tr>
            </thead>
            <tbody>
              {modelPerformance.map((model, idx) => (
                <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                      <span className="font-medium text-[#1F2937]">{model.model}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#1F2937]">{model.accuracy}</span>
                  </td>
                  <td className="py-3 px-4 text-[#4B5563]">{model.precision}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{model.recall}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parseFloat(model.f1) >= 0.9 ? 'bg-[#10B981]/10 text-[#10B981]' :
                      parseFloat(model.f1) >= 0.8 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {model.f1}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#4B5563]">{model.latency}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{model.lastTrain}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(model.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Pipeline Monitoring Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2 mb-6">
          <RefreshCw size={18} className="text-[#F15A22]" />
          Pipeline Monitoring
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Job Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Schedule</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Last Run</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Records</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Action</th>
              </tr>
            </thead>
            <tbody>
              {pipelineJobs.map((job, idx) => (
                <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#1F2937]">{job.jobName}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{job.schedule}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{job.lastRun}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{job.duration}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{job.records}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(job.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-[#F15A22] hover:text-[#2DAEAA] transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: API Usage Statistics */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2 mb-6">
          <Code size={18} className="text-[#F15A22]" />
          API Usage Statistics (24h)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Endpoint</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Calls</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Avg Latency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Error Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">P95 Latency</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Trend</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((api, idx) => (
                <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-[#F3F4F6] px-2 py-1 rounded text-[#F15A22]">
                      {api.endpoint}
                    </code>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1F2937]">{api.calls}</td>
                  <td className="py-3 px-4 text-[#4B5563]">{api.avgLatency}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parseFloat(api.errorRate) < 0.3 ? 'bg-[#10B981]/10 text-[#10B981]' :
                      parseFloat(api.errorRate) < 0.7 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      {api.errorRate}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#4B5563]">{api.p95Latency}</td>
                  <td className="py-3 px-4">
                    {getTrendIcon(api.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Quick Actions */}
      <div className="bg-gradient-to-r from-[#F3F4F6] to-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F2937]">Quick Actions</h3>
              <p className="text-sm text-[#6B7280]">Manage your AI operations</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRetrain}
              disabled={isRetraining}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isRetraining ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Retraining...
                </>
              ) : (
                <>
                  <Brain size={16} />
                  Retrain Model
                </>
              )}
            </button>

            <button
              onClick={handleClearCache}
              className="flex items-center gap-2 px-6 py-2.5 border border-[#E5E7EB] bg-white rounded-xl font-medium hover:border-[#F15A22] transition-all"
            >
              <Trash2 size={16} className="text-[#6B7280]" />
              Clear Cache
            </button>

            <button
              onClick={handleViewLogs}
              className="flex items-center gap-2 px-6 py-2.5 border border-[#E5E7EB] bg-white rounded-xl font-medium hover:border-[#2DAEAA] transition-all"
            >
              <FileText size={16} className="text-[#6B7280]" />
              View Logs
            </button>
          </div>
        </div>

        {/* Log Viewer (Conditional) */}
        {showLogs && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <div className="bg-[#1F2937] rounded-lg p-4 font-mono text-sm text-[#E5E7EB]">
              <p className="text-[#F15A22] mb-2">$ tail -f /var/log/ai-ops.log</p>
              <p>[2026-02-26 10:15:23] INFO: Daily scoring job completed successfully</p>
              <p>[2026-02-26 10:12:45] INFO: Model retraining scheduled for 02:00 AM</p>
              <p>[2026-02-26 10:08:12] WARNING: High latency detected on /api/explain</p>
              <p>[2026-02-26 10:05:34] INFO: Data sync completed: 45,234 records</p>
              <p className="animate-pulse">_</p>
            </div>
          </div>
        )}
      </div>

      {/* System Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-3">
          <p className="text-xs text-[#6B7280]">Overall System Health</p>
          <div className="flex items-center gap-2 mt-1">
            <CheckCircle size={16} className="text-[#10B981]" />
            <span className="font-semibold text-[#1F2937]">98.7% Uptime</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] p-3">
          <p className="text-xs text-[#6B7280]">Active Models</p>
          <div className="flex items-center gap-2 mt-1">
            <Brain size={16} className="text-[#F15A22]" />
            <span className="font-semibold text-[#1F2937]">4/4 Online</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] p-3">
          <p className="text-xs text-[#6B7280]">Pipeline Success</p>
          <div className="flex items-center gap-2 mt-1">
            <Activity size={16} className="text-[#2DAEAA]" />
            <span className="font-semibold text-[#1F2937]">98.5% Success</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E5E7EB] p-3">
          <p className="text-xs text-[#6B7280]">Avg Response</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock size={16} className="text-[#8B5CF6]" />
            <span className="font-semibold text-[#1F2937]">187ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}