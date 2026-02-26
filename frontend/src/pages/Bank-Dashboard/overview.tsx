/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  PieChart,
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowUpDown,
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Types
interface Merchant {
  id: number;
  name: string;
  category: string;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  monthlyRevenue: number;
  status: 'Ready' | 'In Process' | 'Approved';
  avatar?: string;
  location: string;
  joinDate: string;
  lastActive: string;
}

// Generate dummy data
const generateMerchants = (): Merchant[] => {
  const categories = ['Food', 'Fashion', 'Electronics', 'Home & Living', 'Health & Beauty', 'Automotive', 'Education', 'Services'];
  const names = [
    'Warung Budi', 'Toko Sari', 'Ayam Gepuk', 'Bakso Pakde', 'Sate Khas', 'Nasi Goreng',
    'Toko Elektronik', 'Fashion Muslim', 'Batik Modern', 'Tas & Sepatu', 'Pakaian Anak',
    'Smartphone Gallery', 'Komputer Center', 'Camera Store', 'Audio Pro', 'Gaming Zone',
    'Furniture Home', 'Dekorasi Rumah', 'Peralatan Dapur', 'Spring Bed', 'Lemari Minimalis',
    'Klinik Kecantikan', 'Salon & Spa', 'Fitness Center', 'Obat Herbal', 'Vitamin Shop',
    'Bengkel Mobil', 'Cuci Motor', 'Spare Part', 'Aksesoris Mobil', 'Service Center',
    'Bimbingan Belajar', 'Kursus Bahasa', 'Les Privat', 'Sekolah Musik', 'Pelatihan Kerja',
    'Laundry Kiloan', 'Jasa Kebersihan', 'Fotografi', 'Event Organizer', 'Wedding Planner'
  ];
  
  const statuses: ('Ready' | 'In Process' | 'Approved')[] = ['Ready', 'In Process', 'Approved'];
  const risks: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const locations = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Denpasar'];

  const merchants: Merchant[] = [];

  for (let i = 1; i <= 50; i++) {
    const randomRisk = risks[Math.floor(Math.random() * risks.length)];
    let score: number;
    
    // Score based on risk
    if (randomRisk === 'Low') score = Math.floor(Math.random() * 15) + 85; // 85-100
    else if (randomRisk === 'Medium') score = Math.floor(Math.random() * 15) + 70; // 70-84
    else score = Math.floor(Math.random() * 20) + 50; // 50-69

    const monthlyRevenue = Math.floor(Math.random() * 100) + 10; // 10-110 million
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    merchants.push({
      id: i,
      name: names[Math.floor(Math.random() * names.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      score,
      risk: randomRisk,
      monthlyRevenue,
      status,
      avatar: names[i % names.length].substring(0, 2).toUpperCase(),
      location: locations[Math.floor(Math.random() * locations.length)],
      joinDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      lastActive: `${Math.floor(Math.random() * 24)} hours ago`
    });
  }

  // Sort by score descending
  return merchants.sort((a, b) => b.score - a.score);
};

export default function BankDashboardPage() {
  const [merchants] = useState<Merchant[]>(generateMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Merchant; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // Calculate stats
  const stats = {
    total: merchants.length,
    ready: merchants.filter(m => m.status === 'Ready').length,
    inProcess: merchants.filter(m => m.status === 'In Process').length,
    approved: merchants.filter(m => m.status === 'Approved').length,
    totalPotential: merchants.reduce((sum, m) => sum + (m.monthlyRevenue * 0.8), 0) // 80% of monthly revenue as potential loan
  };

  // Risk distribution
  const riskDistribution = [
    { 
      name: 'Low Risk', 
      value: merchants.filter(m => m.risk === 'Low').length,
      count: merchants.filter(m => m.risk === 'Low').length,
      percentage: Math.round((merchants.filter(m => m.risk === 'Low').length / merchants.length) * 100),
      color: '#10B981'
    },
    { 
      name: 'Medium Risk', 
      value: merchants.filter(m => m.risk === 'Medium').length,
      count: merchants.filter(m => m.risk === 'Medium').length,
      percentage: Math.round((merchants.filter(m => m.risk === 'Medium').length / merchants.length) * 100),
      color: '#F59E0B'
    },
    { 
      name: 'High Risk', 
      value: merchants.filter(m => m.risk === 'High').length,
      count: merchants.filter(m => m.risk === 'High').length,
      percentage: Math.round((merchants.filter(m => m.risk === 'High').length / merchants.length) * 100),
      color: '#EF4444'
    }
  ];

  // Get unique categories for filter
  const categories = ['All', ...new Set(merchants.map(m => m.category))];

  // Filter merchants
  const filteredMerchants = useMemo(() => {
    return merchants.filter(merchant => {
      const matchesSearch = 
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRisk = riskFilter === 'All' || merchant.risk === riskFilter;
      const matchesStatus = statusFilter === 'All' || merchant.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || merchant.category === categoryFilter;
      const matchesRiskLegend = !selectedRisk || merchant.risk === selectedRisk;
      
      return matchesSearch && matchesRisk && matchesStatus && matchesCategory && matchesRiskLegend;
    });
  }, [merchants, searchTerm, riskFilter, statusFilter, categoryFilter, selectedRisk]);

  // Sort merchants
  const sortedMerchants = useMemo(() => {
    let sortableMerchants = [...filteredMerchants];
    if (sortConfig !== null) {
      sortableMerchants.sort((a, b) => {
        const aValue = a[sortConfig!.key];
        const bValue = b[sortConfig!.key];
        if (aValue == null || bValue == null) {
          return 0;
        }
        if (aValue < bValue) {
          return sortConfig!.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig!.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMerchants;
  }, [filteredMerchants, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedMerchants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedMerchants.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, riskFilter, statusFilter, categoryFilter, selectedRisk]);

  const requestSort = (key: keyof Merchant) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Merchant) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="text-[#6B7280]" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={14} className="text-[#F15A22]" /> : 
      <ChevronDown size={14} className="text-[#F15A22]" />;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Ready':
        return {
          bg: 'bg-[#10B981]/10',
          text: 'text-[#10B981]',
          icon: CheckCircle
        };
      case 'In Process':
        return {
          bg: 'bg-[#F59E0B]/10',
          text: 'text-[#F59E0B]',
          icon: Clock
        };
      case 'Approved':
        return {
          bg: 'bg-[#3B82F6]/10',
          text: 'text-[#3B82F6]',
          icon: CheckCircle
        };
      default:
        return {
          bg: 'bg-[#6B7280]/10',
          text: 'text-[#6B7280]',
          icon: AlertCircle
        };
    }
  };

  const getRiskBadge = (risk: string) => {
    switch(risk) {
      case 'Low':
        return 'bg-[#10B981]/10 text-[#10B981]';
      case 'Medium':
        return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'High':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      default:
        return 'bg-[#6B7280]/10 text-[#6B7280]';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount * 1000000);
  };

  const handleExport = () => {
    // Implement export logic
    console.log('Exporting data...');
  };

  const handleRefresh = () => {
    // Implement refresh logic
    window.location.reload();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E7EB]">
          <p className="font-semibold text-[#1F2937]">{data.name}</p>
          <p className="text-sm text-[#6B7280]">Count: {data.count} merchants</p>
          <p className="text-sm" style={{ color: data.color }}>Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            onClick={() => setSelectedRisk(selectedRisk === entry.payload.name ? null : entry.payload.name)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all ${
              selectedRisk === entry.payload.name ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{ 
              backgroundColor: `${entry.color}10`,
              '--ring-color': entry.color
            } as React.CSSProperties}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium">{entry.value}</span>
            <span className="text-xs text-[#6B7280]">({entry.payload.percentage}%)</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Bank Dashboard
          </h1>
          <p className="text-[#6B7280] mt-2">Merchant Portfolio Overview & Risk Analysis</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Merchants */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Merchants</p>
              <h3 className="text-2xl font-bold text-[#1F2937]">{stats.total.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <Users size={20} className="text-[#F15A22]" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#10B981]">
            <TrendingUp size={12} />
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Ready to Submit */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Ready to Submit</p>
              <h3 className="text-2xl font-bold text-[#1F2937]">{stats.ready.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-[#E0F7F6] rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-[#2DAEAA]" />
            </div>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-xs rounded-full">
            Ready for processing
          </span>
        </div>

        {/* In Process */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">In Process</p>
              <h3 className="text-2xl font-bold text-[#1F2937]">{stats.inProcess.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-[#F59E0B]" />
            </div>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-full">
            Under review
          </span>
        </div>

        {/* Total Potential Loan */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Total Potential Loan</p>
              <h3 className="text-2xl font-bold text-[#1F2937]">{formatCurrency(stats.totalPotential)}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <CreditCard size={20} className="text-[#F15A22]" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#F15A22]">
            <TrendingUp size={12} />
            <span>Avg. Rp 37M per merchant</span>
          </div>
        </div>
      </div>

      {/* Section 1: Risk Distribution & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#1F2937]">Risk Distribution</h2>
            <PieChart size={18} className="text-[#6B7280]" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => setSelectedRisk(selectedRisk === data.name ? null : data.name)}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Total */}
          <div className="text-center mt-2">
            <p className="text-2xl font-bold text-[#1F2937]">{merchants.length}</p>
            <p className="text-xs text-[#6B7280]">Total Merchants</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-lg">
          <h2 className="font-semibold text-[#1F2937] mb-4">Search & Filters</h2>
          
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search merchant by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Risk Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
              >
                <option value="All">All Status</option>
                <option value="Ready">Ready</option>
                <option value="In Process">In Process</option>
                <option value="Approved">Approved</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Active Filters */}
            {(searchTerm || riskFilter !== 'All' || statusFilter !== 'All' || categoryFilter !== 'All' || selectedRisk) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF3ED] text-[#F15A22] rounded-full text-sm">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')}>×</button>
                  </span>
                )}
                {riskFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F7F6] text-[#2DAEAA] rounded-full text-sm">
                    Risk: {riskFilter}
                    <button onClick={() => setRiskFilter('All')}>×</button>
                  </span>
                )}
                {statusFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FEF3C7] text-[#F59E0B] rounded-full text-sm">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('All')}>×</button>
                  </span>
                )}
                {categoryFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EDE9FE] text-[#8B5CF6] rounded-full text-sm">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter('All')}>×</button>
                  </span>
                )}
                {selectedRisk && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F4F6] text-[#1F2937] rounded-full text-sm">
                    Chart Filter: {selectedRisk} Risk
                    <button onClick={() => setSelectedRisk(null)}>×</button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Merchants Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-lg overflow-hidden">
        {/* Table Header with Results Count */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#6B7280]">
              Showing <span className="font-semibold text-[#1F2937]">{currentItems.length}</span> of{' '}
              <span className="font-semibold text-[#1F2937]">{sortedMerchants.length}</span> merchants
            </p>
            
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B7280]">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937]">No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('name')}>
                  <div className="flex items-center gap-1">
                    Merchant {getSortIcon('name')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('category')}>
                  <div className="flex items-center gap-1">
                    Category {getSortIcon('category')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('score')}>
                  <div className="flex items-center gap-1">
                    Score {getSortIcon('score')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('risk')}>
                  <div className="flex items-center gap-1">
                    Risk {getSortIcon('risk')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#1F2937] cursor-pointer" onClick={() => requestSort('monthlyRevenue')}>
                  <div className="flex items-center gap-1">
                    Monthly Rev {getSortIcon('monthlyRevenue')}
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
              {currentItems.map((merchant, index) => {
                const statusStyle = getStatusBadge(merchant.status);
                const StatusIcon = statusStyle.icon;
                
                return (
                  <tr 
                    key={merchant.id} 
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{indexOfFirstItem + index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                          {merchant.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937]">{merchant.name}</p>
                          <p className="text-xs text-[#6B7280]">{merchant.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[#4B5563]">{merchant.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          merchant.score >= 85 ? 'text-[#10B981]' : 
                          merchant.score >= 70 ? 'text-[#F59E0B]' : 
                          'text-[#EF4444]'
                        }`}>
                          {merchant.score}
                        </span>
                        <div className="w-16 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              merchant.score >= 85 ? 'bg-[#10B981]' : 
                              merchant.score >= 70 ? 'bg-[#F59E0B]' : 
                              'bg-[#EF4444]'
                            }`}
                            style={{ width: `${merchant.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(merchant.risk)}`}>
                        {merchant.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#1F2937]">{formatCurrency(merchant.monthlyRevenue)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <StatusIcon size={12} />
                        {merchant.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedMerchant(merchant)}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg text-sm hover:shadow-lg transition-all"
                      >
                        <Eye size={14} />
                        View
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
            <Users size={48} className="mx-auto text-[#6B7280] mb-4" />
            <h3 className="font-semibold text-[#1F2937] mb-2">No merchants found</h3>
            <p className="text-[#6B7280]">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {sortedMerchants.length > 0 && (
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

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMerchant(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                    {selectedMerchant.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1F2937]">{selectedMerchant.name}</h2>
                    <p className="text-[#6B7280]">{selectedMerchant.category} • {selectedMerchant.location}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMerchant(null)} className="text-[#6B7280] hover:text-[#1F2937]">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Credit Score</p>
                  <p className="text-2xl font-bold" style={{
                    color: selectedMerchant.score >= 85 ? '#10B981' : selectedMerchant.score >= 70 ? '#F59E0B' : '#EF4444'
                  }}>{selectedMerchant.score}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Risk Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(selectedMerchant.risk)}`}>
                    {selectedMerchant.risk}
                  </span>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Monthly Revenue</p>
                  <p className="text-xl font-bold text-[#1F2937]">{formatCurrency(selectedMerchant.monthlyRevenue)}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusBadge(selectedMerchant.status).bg
                  } ${getStatusBadge(selectedMerchant.status).text}`}>
                    {selectedMerchant.status}
                  </span>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Join Date</p>
                  <p className="font-medium">{selectedMerchant.joinDate}</p>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-sm text-[#6B7280] mb-1">Last Active</p>
                  <p className="font-medium">{selectedMerchant.lastActive}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
                  Message
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg hover:shadow-lg transition-all">
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}