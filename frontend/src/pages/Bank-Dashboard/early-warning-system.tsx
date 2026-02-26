/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  Flame,
  Users,
  Bell,
  BellRing,
  BellOff,
  RotateCcw
} from 'lucide-react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

// Types
interface Alert {
  id: number;
  severity: 'Critical' | 'Medium' | 'Low';
  type: 'Revenue Drop' | 'Refund Spike' | 'Settlement Delay' | 'Score Drop';
  merchant: string;
  merchantCategory: string;
  value: string;
  threshold: string;
  detected: string;
  status: 'Active' | 'Monitoring' | 'Resolved';
  description: string;
  affectedDays: number;
}

// Generate dummy alerts
const generateAlerts = (): Alert[] => {
  const merchants = [
    { name: 'Warung Sari', category: 'Food' },
    { name: 'Toko Buku', category: 'Retail' },
    { name: 'Ayam Geprek', category: 'Food' },
    { name: 'Bakso Pakde', category: 'Food' },
    { name: 'Sate Khas', category: 'Food' },
    { name: 'Toko Elektronik', category: 'Electronics' },
    { name: 'Fashion Muslim', category: 'Fashion' },
    { name: 'Batik Modern', category: 'Fashion' },
    { name: 'Smartphone Gallery', category: 'Electronics' },
    { name: 'Furniture Home', category: 'Home & Living' },
    { name: 'Klinik Kecantikan', category: 'Health' },
    { name: 'Bengkel Mobil', category: 'Automotive' },
    { name: 'Laundry Kiloan', category: 'Services' },
    { name: 'Bimbingan Belajar', category: 'Education' }
  ];

  const alertTypes = [
    { name: 'Revenue Drop', values: ['-15%', '-22%', '-25%', '-18%', '-30%'], thresholds: ['-10%', '-15%', '-20%'] },
    { name: 'Refund Spike', values: ['+8%', '+12%', '+15%', '+6%', '+20%'], thresholds: ['+5%', '+8%', '+10%'] },
    { name: 'Settlement Delay', values: ['+5 hr', '+8 hr', '+12 hr', '+4 hr', '+24 hr'], thresholds: ['+3 hr', '+6 hr', '+12 hr'] },
    { name: 'Score Drop', values: ['-15 pts', '-22 pts', '-30 pts', '-12 pts', '-25 pts'], thresholds: ['-10 pts', '-20 pts', '-25 pts'] }
  ];

  const severities: ('Critical' | 'Medium' | 'Low')[] = ['Critical', 'Medium', 'Low'];
  const statuses: ('Active' | 'Monitoring' | 'Resolved')[] = ['Active', 'Monitoring', 'Resolved'];

  const alerts: Alert[] = [];

  for (let i = 1; i <= 35; i++) {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Adjust probability for realistic distribution
    let finalStatus = status;
    if (severity === 'Critical' && Math.random() > 0.7) {
      finalStatus = 'Active';
    }

    alerts.push({
      id: i,
      severity,
      type: alertType.name as any,
      merchant: merchant.name,
      merchantCategory: merchant.category,
      value: alertType.values[Math.floor(Math.random() * alertType.values.length)],
      threshold: alertType.thresholds[Math.floor(Math.random() * alertType.thresholds.length)],
      detected: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 2) + 1).padStart(2, '0')}/26`,
      status: finalStatus,
      description: `${alertType.name} detected for ${merchant.name}`,
      affectedDays: Math.floor(Math.random() * 14) + 1
    });
  }

  // Sort by severity (Critical first)
  return alerts.sort((a, b) => {
    const severityOrder = { Critical: 0, Medium: 1, Low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};

// Generate weekly trend data
const generateWeeklyTrend = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  return weeks.map((week) => ({
    week,
    Critical: Math.floor(Math.random() * 5) + 1,
    Medium: Math.floor(Math.random() * 6) + 2,
    Low: Math.floor(Math.random() * 7) + 3,
    total: 0 // Will calculate after
  })).map(item => ({
    ...item,
    total: item.Critical + item.Medium + item.Low
  }));
};

export default function EarlyWarningPage() {
  const [alerts] = useState<Alert[]>(generateAlerts);
  const [weeklyTrend] = useState(generateWeeklyTrend());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All Alerts');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Alert; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Calculate stats
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'Critical').length,
    medium: alerts.filter(a => a.severity === 'Medium').length,
    low: alerts.filter(a => a.severity === 'Low').length,
    active: alerts.filter(a => a.status === 'Active').length,
    monitoring: alerts.filter(a => a.status === 'Monitoring').length,
    resolved: alerts.filter(a => a.status === 'Resolved').length
  };

  // Find top problematic merchant
  const merchantAlertCount = alerts.reduce((acc, alert) => {
    acc[alert.merchant] = (acc[alert.merchant] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMerchant = Object.entries(merchantAlertCount)
    .sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  // Most common alert type
  const alertTypeCount = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonAlert = Object.entries(alertTypeCount)
    .sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];

  // Resolved rate
  const resolvedRate = Math.round((stats.resolved / stats.total) * 100);

  // Tabs
  const tabs = [
    { id: 'All Alerts', label: 'All Alerts', icon: Bell, count: stats.total },
    { id: 'Revenue Drop', label: 'Revenue Drop', icon: TrendingDown, count: alerts.filter(a => a.type === 'Revenue Drop').length },
    { id: 'Refund Spike', label: 'Refund Spike', icon: TrendingUp, count: alerts.filter(a => a.type === 'Refund Spike').length },
    { id: 'Settlement Delay', label: 'Settlement Delay', icon: Clock, count: alerts.filter(a => a.type === 'Settlement Delay').length },
    { id: 'Score Drop', label: 'Score Drop', icon: Activity, count: alerts.filter(a => a.type === 'Score Drop').length }
  ];

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = 
        alert.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === 'All Alerts' || alert.type === activeTab;
      const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
      const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;
      
      return matchesSearch && matchesTab && matchesSeverity && matchesStatus;
    });
  }, [alerts, searchTerm, activeTab, severityFilter, statusFilter]);

  // Sort alerts
  const sortedAlerts = useMemo(() => {
    let sortableAlerts = [...filteredAlerts];
    if (sortConfig !== null) {
      sortableAlerts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAlerts;
  }, [filteredAlerts, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAlerts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, severityFilter, statusFilter]);

  const requestSort = (key: keyof Alert) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Alert) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="text-[#6B7280]" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={14} className="text-[#F15A22]" /> : 
      <ChevronDown size={14} className="text-[#F15A22]" />;
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Critical':
        return <Flame size={16} className="text-[#EF4444]" />;
      case 'Medium':
        return <AlertCircle size={16} className="text-[#F59E0B]" />;
      case 'Low':
        return <AlertTriangle size={16} className="text-[#3B82F6]" />;
      default:
        return <AlertCircle size={16} className="text-[#6B7280]" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'Critical':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      case 'Medium':
        return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'Low':
        return 'bg-[#3B82F6]/10 text-[#3B82F6]';
      default:
        return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active':
        return {
          bg: 'bg-[#EF4444]/10',
          text: 'text-[#EF4444]',
          icon: BellRing
        };
      case 'Monitoring':
        return {
          bg: 'bg-[#F59E0B]/10',
          text: 'text-[#F59E0B]',
          icon: Bell
        };
      case 'Resolved':
        return {
          bg: 'bg-[#10B981]/10',
          text: 'text-[#10B981]',
          icon: BellOff
        };
      default:
        return {
          bg: 'bg-[#6B7280]/10',
          text: 'text-[#6B7280]',
          icon: Bell
        };
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch(type) {
      case 'Revenue Drop':
        return <TrendingDown size={14} className="text-[#EF4444]" />;
      case 'Refund Spike':
        return <TrendingUp size={14} className="text-[#F59E0B]" />;
      case 'Settlement Delay':
        return <Clock size={14} className="text-[#3B82F6]" />;
      case 'Score Drop':
        return <Activity size={14} className="text-[#8B5CF6]" />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveTab('All Alerts');
    setSeverityFilter('All');
    setStatusFilter('All');
    setSortConfig(null);
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log('Exporting alerts...');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E7EB]">
          <p className="font-semibold text-[#1F2937] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#6B7280]">{entry.name}:</span>
              <span className="font-medium text-[#1F2937]">{entry.value}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Total:</span>
              <span className="font-bold text-[#1F2937]">
                {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)}
              </span>
            </div>
          </div>
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
            Early Warning System
          </h1>
          <p className="text-[#6B7280] mt-2">Monitor and manage merchant risk alerts in real-time</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 border border-[#E5E7EB] rounded-xl hover:border-[#F15A22] transition-colors"
          >
            <RefreshCw size={18} className="text-[#6B7280]" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Header Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Active Alerts</p>
              <h3 className="text-2xl font-bold text-[#1F2937]">{stats.active}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-[#F15A22]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Critical Alerts</p>
              <h3 className="text-2xl font-bold text-[#EF4444]">{stats.critical}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
              <Flame size={20} className="text-[#EF4444]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Medium Alerts</p>
              <h3 className="text-2xl font-bold text-[#F59E0B]">{stats.medium}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-[#F59E0B]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Low Alerts</p>
              <h3 className="text-2xl font-bold text-[#3B82F6]">{stats.low}</h3>
            </div>
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-[#3B82F6]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Resolved Rate</p>
              <h3 className="text-2xl font-bold text-[#10B981]">{resolvedRate}%</h3>
            </div>
            <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-[#10B981]" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search merchant, alert type, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || activeTab !== 'All Alerts' || severityFilter !== 'All' || statusFilter !== 'All') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF3ED] text-[#F15A22] rounded-full text-sm">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {activeTab !== 'All Alerts' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F7F6] text-[#2DAEAA] rounded-full text-sm">
                Type: {activeTab}
                <button onClick={() => setActiveTab('All Alerts')}>×</button>
              </span>
            )}
            {severityFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FEF3C7] text-[#F59E0B] rounded-full text-sm">
                Severity: {severityFilter}
                <button onClick={() => setSeverityFilter('All')}>×</button>
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D1FAE5] text-[#10B981] rounded-full text-sm">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Alerts Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6B7280]">
              Showing <span className="font-semibold text-[#1F2937]">{currentItems.length}</span> of{' '}
              <span className="font-semibold text-[#1F2937]">{sortedAlerts.length}</span> alerts
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('severity')}>
                  <div className="flex items-center gap-1">
                    Severity {getSortIcon('severity')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('type')}>
                  <div className="flex items-center gap-1">
                    Alert Type {getSortIcon('type')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('merchant')}>
                  <div className="flex items-center gap-1">
                    Merchant {getSortIcon('merchant')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Value</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Threshold</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('detected')}>
                  <div className="flex items-center gap-1">
                    Detected {getSortIcon('detected')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('status')}>
                  <div className="flex items-center gap-1">
                    Status {getSortIcon('status')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((alert) => {
                const statusStyle = getStatusBadge(alert.status);
                const StatusIcon = statusStyle.icon;
                
                return (
                  <tr 
                    key={alert.id} 
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(alert.severity)}
                        <span className={`text-sm font-medium ${getSeverityBadge(alert.severity)} px-2 py-0.5 rounded-full`}>
                          {alert.severity}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getAlertTypeIcon(alert.type)}
                        <span className="text-sm text-[#4B5563]">{alert.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[#1F2937]">{alert.merchant}</p>
                        <p className="text-xs text-[#6B7280]">{alert.merchantCategory}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        alert.type.includes('Drop') ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                      }`}>
                        {alert.value}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[#6B7280]">{alert.threshold}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[#4B5563]">{alert.detected}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <StatusIcon size={12} />
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg text-sm hover:shadow-lg transition-all"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-[#6B7280] mb-4" />
            <h3 className="font-semibold text-[#1F2937] mb-2">No alerts found</h3>
            <p className="text-[#6B7280]">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {sortedAlerts.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#F15A22] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = currentPage;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white'
                        : 'border border-[#E5E7EB] hover:border-[#F15A22]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#F15A22] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Alert Trend Chart */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
          <BarChart3 size={18} className="text-[#F15A22]" />
          Alert Trend (Last 6 Weeks)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={weeklyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="week" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Critical" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Medium" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Low" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="total" stroke="#F15A22" strokeWidth={2} dot={{ fill: '#F15A22', r: 4 }} name="Total" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Section 4: Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#F15A22]/10 to-[#2DAEAA]/10 rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Users size={20} className="text-[#F15A22]" />
            </div>
            <span className="text-xs text-[#6B7280]">Top Risk</span>
          </div>
          <p className="text-sm text-[#6B7280] mb-1">Top Problematic Merchant</p>
          <p className="text-xl font-bold text-[#1F2937]">{topMerchant[0]}</p>
          <p className="text-xs text-[#F15A22] mt-2">{topMerchant[1]} active alerts</p>
        </div>

        <div className="bg-gradient-to-br from-[#F15A22]/10 to-[#2DAEAA]/10 rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <PieChart size={20} className="text-[#2DAEAA]" />
            </div>
            <span className="text-xs text-[#6B7280]">Most Common</span>
          </div>
          <p className="text-sm text-[#6B7280] mb-1">Most Common Alert</p>
          <p className="text-xl font-bold text-[#1F2937]">{mostCommonAlert[0]}</p>
          <p className="text-xs text-[#2DAEAA] mt-2">{Math.round((mostCommonAlert[1] / stats.total) * 100)}% of all alerts</p>
        </div>

        <div className="bg-gradient-to-br from-[#F15A22]/10 to-[#2DAEAA]/10 rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-[#10B981]" />
            </div>
            <span className="text-xs text-[#6B7280]">Performance</span>
          </div>
          <p className="text-sm text-[#6B7280] mb-1">Resolved Rate</p>
          <p className="text-xl font-bold text-[#1F2937]">{resolvedRate}%</p>
          <p className="text-xs text-[#10B981] mt-2">within 7 days</p>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAlert(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedAlert.severity === 'Critical' ? 'bg-[#FEE2E2]' :
                    selectedAlert.severity === 'Medium' ? 'bg-[#FEF3C7]' :
                    'bg-[#DBEAFE]'
                  }`}>
                    {getSeverityIcon(selectedAlert.severity)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1F2937]">{selectedAlert.merchant}</h2>
                    <p className="text-sm text-[#6B7280]">{selectedAlert.merchantCategory}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="text-[#6B7280] hover:text-[#1F2937]">✕</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Alert Type</p>
                    <p className="font-medium text-[#1F2937]">{selectedAlert.type}</p>
                  </div>
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Severity</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(selectedAlert.severity)}`}>
                      {selectedAlert.severity}
                    </span>
                  </div>
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Value</p>
                    <p className="font-medium text-[#1F2937]">{selectedAlert.value}</p>
                  </div>
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Threshold</p>
                    <p className="font-medium text-[#1F2937]">{selectedAlert.threshold}</p>
                  </div>
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Detected</p>
                    <p className="font-medium text-[#1F2937]">{selectedAlert.detected}</p>
                  </div>
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusBadge(selectedAlert.status).bg
                    } ${getStatusBadge(selectedAlert.status).text}`}>
                      {selectedAlert.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-xs text-[#6B7280] mb-1">Description</p>
                  <p className="text-sm text-[#1F2937]">{selectedAlert.description}</p>
                </div>

                <div className="p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-xs text-[#6B7280] mb-1">Affected Days</p>
                  <p className="font-medium text-[#1F2937]">{selectedAlert.affectedDays} days</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    View Merchant
                  </button>
                  <button className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-medium hover:bg-[#F3F4F6] transition-all">
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}