/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  FileText,
  Printer,
  Share2,
  Package,
  Hash,
  Receipt,
  AlertCircle,
  CreditCard,
  ShoppingBag,
  RefreshCw,
  Loader2
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { transactionApi, type Transaction } from '@/services/api';
import LoadingSpinner from '@/components/loading-spinner';
import ErrorState from '@/components/error-state';
import React from 'react';

// Helper function to format date for API
const formatDateForAPI = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  return date.toISOString();
};

// Helper function to map frontend status to API status
const mapStatusToAPI = (status: string): string | undefined => {
  if (status === 'all') return undefined;
  if (status === 'success') return 'Success';
  if (status === 'pending') return 'Pending';
  if (status === 'processing') return 'Pending';
  if (status === 'failed') return 'Failed';
  if (status === 'refunded') return 'Refunded';
  return undefined;
};

// Helper function to map API status to frontend status
const mapAPIStatusToFrontend = (status: string): 'success' | 'pending' | 'processing' | 'failed' | 'refunded' => {
  switch (status) {
    case 'Success':
      return 'success';
    case 'Pending':
      return 'pending';
    case 'Failed':
      return 'failed';
    case 'Refunded':
      return 'refunded';
    default:
      return 'pending';
  }
};

// Helper function to map payment method to type filter
const mapPaymentMethodToType = (method: string): 'QRIS' | 'CASH' | undefined => {
  if (method === 'QRIS') return 'QRIS';
  if (method === 'CASH') return 'CASH';
  return undefined;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async (page: number = currentPage) => {
  try {
    setLoading(true);
    setError(null);

    const params = {
      page,
      limit: itemsPerPage,
      status: mapStatusToAPI(statusFilter),
      type: mapPaymentMethodToType(typeFilter),
      startDate: formatDateForAPI(startDate),
      endDate: formatDateForAPI(endDate)
    };

    console.log('Fetching with params:', params);
    
    const response = await transactionApi.getTransactions(params);
    console.log('API Response:', response);
    
    if (response.success && response.data) {
      // response.data is the transactions array
      setTransactions(response.data || []);
      // response.pagination is separate
      setPagination(response.pagination || {
        total: 0,
        page: 1,
        limit: 20,
        pages: 0
      });
      console.log('Transactions set:', response.data);
    } else {
      setError(response.message || 'Failed to load transactions');
      setTransactions([]);
    }
  } catch (err: any) {
    console.error('Fetch error:', err);
    setError(err.response?.data?.message || 'Failed to load transactions');
    setTransactions([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [currentPage, itemsPerPage, statusFilter, typeFilter, startDate, endDate]);

  // Fetch transaction details
  const fetchTransactionDetail = async (transactionId: string) => {
    try {
      setLoadingDetail(true);
      const response = await transactionApi.getTransactionDetail(transactionId);
      if (response.success && response.data) {
        setSelectedTransaction(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch transaction details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Load transactions on mount and when filters change
  useEffect(() => {
    fetchTransactions(1);
  }, [statusFilter, typeFilter, startDate, endDate]);

  // Load transactions when page changes
  useEffect(() => {
    if (currentPage !== 1) {
      fetchTransactions(currentPage);
    }
  }, [currentPage]);

  // Handle row expansion
  const handleExpandRow = async (transactionId: string) => {
    if (expandedRow === transactionId) {
      setExpandedRow(null);
      setSelectedTransaction(null);
    } else {
      setExpandedRow(transactionId);
      await fetchTransactionDetail(transactionId);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(currentPage);
  };

  // Handle search (local filtering)
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const productName = transaction.metadata?.productInfo?.name?.toLowerCase() || '';
    const description = transaction.metadata?.description?.toLowerCase() || '';
    const transactionId = transaction.transactionId?.toLowerCase() || '';
    const paymentMethod = transaction.paymentMethod?.toLowerCase() || '';
    
    return (
      transactionId.includes(searchLower) ||
      productName.includes(searchLower) ||
      description.includes(searchLower) ||
      paymentMethod.includes(searchLower)
    );
  });

  // Get unique categories from transactions
  const categories = ['all', ...new Set(
    transactions
      .map(t => t.metadata?.productInfo?.category)
      .filter((category): category is string => category !== undefined && category !== null)
  )];

  // Apply category filter locally
  const displayedTransactions = filteredTransactions.filter(transaction => {
    if (categoryFilter === 'all') return true;
    const category = transaction.metadata?.productInfo?.category;
    return category === categoryFilter;
  });

  // Calculate metrics
  const totalRevenue = displayedTransactions.reduce((sum, t) => {
    const amount = parseFloat(t.amount) || 0;
    return sum + amount;
  }, 0);
  
  const successfulTransactions = displayedTransactions.filter(t => t.status === 'Success').length;
  
  const pendingPayouts = displayedTransactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => {
      const amount = parseFloat(t.amount) || 0;
      return sum + amount;
    }, 0);
  
  const failedTransactions = displayedTransactions.filter(t => t.status === 'Failed').length;
  
  const averageTransactionValue = displayedTransactions.length > 0 
    ? totalRevenue / displayedTransactions.length 
    : 0;

  const getStatusStyles = (status: string) => {
    const frontendStatus = mapAPIStatusToFrontend(status);
    
    switch(frontendStatus) {
      case 'success':
        return {
          bg: 'bg-[#10B981]/10',
          text: 'text-[#10B981]',
          border: 'border-[#10B981]/20',
          icon: CheckCircle
        };
      case 'pending':
        return {
          bg: 'bg-[#F59E0B]/10',
          text: 'text-[#F59E0B]',
          border: 'border-[#F59E0B]/20',
          icon: Clock
        };
      case 'processing':
        return {
          bg: 'bg-[#3B82F6]/10',
          text: 'text-[#3B82F6]',
          border: 'border-[#3B82F6]/20',
          icon: RefreshCw
        };
      case 'failed':
        return {
          bg: 'bg-[#EF4444]/10',
          text: 'text-[#EF4444]',
          border: 'border-[#EF4444]/20',
          icon: XCircle
        };
      case 'refunded':
        return {
          bg: 'bg-[#6B7280]/10',
          text: 'text-[#6B7280]',
          border: 'border-[#6B7280]/20',
          icon: AlertCircle
        };
      default:
        return {
          bg: 'bg-[#6B7280]/10',
          text: 'text-[#6B7280]',
          border: 'border-[#6B7280]/20',
          icon: Clock
        };
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(dateString));
    } catch {
      return 'Invalid Date';
    }
  };

  const handleApplyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowDatePicker(false);
  };

  const handleClearDateFilter = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setMonth(thirtyDaysAgo.getMonth() - 1);
    setStartDate(thirtyDaysAgo);
    setEndDate(new Date());
    setTempStartDate(thirtyDaysAgo);
    setTempEndDate(new Date());
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting ${displayedTransactions.length} transactions as ${format}`);
    alert(`Exporting ${displayedTransactions.length} transactions as ${format} file...`);
  };

  if (loading && !refreshing && transactions.length === 0) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Transaction Overview
          </h1>
          <p className="text-[#6B7280] mt-2">Monitor and manage all your business transactions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#F15A22] transition-all duration-300"
          >
            <RefreshCw size={16} className={`text-[#6B7280] ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm text-[#1F2937]">Refresh</span>
          </button>

          {/* Date Range Picker */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#F15A22] transition-all duration-300"
            >
              <Calendar size={16} className="text-[#6B7280]" />
              <span className="text-sm text-[#1F2937]">
                {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
              </span>
              <ChevronDown size={14} className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-12 z-20 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl p-4 min-w-[300px]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Start Date</label>
                    <DatePicker
                      selected={tempStartDate}
                      onChange={(date: Date | null) => setTempStartDate(date)}
                      selectsStart
                      startDate={tempStartDate}
                      endDate={tempEndDate}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
                      placeholderText="Select start date"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">End Date</label>
                    <DatePicker
                      selected={tempEndDate}
                      onChange={(date: Date | null) => setTempEndDate(date)}
                      selectsEnd
                      startDate={tempStartDate}
                      endDate={tempEndDate}
                      minDate={tempStartDate || undefined}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
                      placeholderText="Select end date"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleApplyDateFilter}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Apply
                    </button>
                    <button
                      onClick={handleClearDateFilter}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all duration-300">
              <Download size={16} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
            
            <div className="absolute right-0 top-12 w-40 bg-white border border-[#E5E7EB] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left px-4 py-2.5 hover:bg-[#F3F4F6] first:rounded-t-xl"
              >
                CSV File
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2.5 hover:bg-[#F3F4F6] last:rounded-b-xl"
              >
                PDF Document
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <ErrorState message={error} onRetry={() => fetchTransactions(currentPage)} />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border-2 border-[#1F2937] rounded-xl p-4 hover:shadow-[8px_8px_0px_0px_#F15A22] transition-all duration-300 brutalist-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7280] text-xs font-medium mb-1">Total Revenue</p>
              <h3 className="text-lg font-bold text-[#1F2937]">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="w-8 h-8 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <DollarSign size={16} className="text-[#F15A22]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#1F2937] rounded-xl p-4 hover:shadow-[8px_8px_0px_0px_#2DAEAA] transition-all duration-300 brutalist-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7280] text-xs font-medium mb-1">Successful</p>
              <h3 className="text-lg font-bold text-[#1F2937]">{successfulTransactions}</h3>
            </div>
            <div className="w-8 h-8 bg-[#E0F7F6] rounded-lg flex items-center justify-center">
              <CheckCircle size={16} className="text-[#2DAEAA]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#1F2937] rounded-xl p-4 hover:shadow-[8px_8px_0px_0px_#F59E0B] transition-all duration-300 brutalist-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7280] text-xs font-medium mb-1">Pending</p>
              <h3 className="text-lg font-bold text-[#1F2937]">{formatCurrency(pendingPayouts)}</h3>
            </div>
            <div className="w-8 h-8 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
              <Clock size={16} className="text-[#F59E0B]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#1F2937] rounded-xl p-4 hover:shadow-[8px_8px_0px_0px_#EF4444] transition-all duration-300 brutalist-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7280] text-xs font-medium mb-1">Failed</p>
              <h3 className="text-lg font-bold text-[#1F2937]">{failedTransactions}</h3>
            </div>
            <div className="w-8 h-8 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
              <XCircle size={16} className="text-[#EF4444]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#1F2937] rounded-xl p-4 hover:shadow-[8px_8px_0px_0px_#8B5CF6] transition-all duration-300 brutalist-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#6B7280] text-xs font-medium mb-1">Avg. Value</p>
              <h3 className="text-lg font-bold text-[#1F2937]">{formatCurrency(averageTransactionValue)}</h3>
            </div>
            <div className="w-8 h-8 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-[#8B5CF6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by ID, product, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
              >
                <Filter size={18} className="text-[#6B7280]" />
                <span>Status</span>
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-xl z-10 p-2">
                  {['all', 'Success', 'Pending', 'Failed', 'Refunded'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status.toLowerCase());
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm capitalize ${
                        statusFilter === status.toLowerCase()
                          ? 'bg-[#F15A22] text-white'
                          : 'hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {status === 'all' ? 'All Status' : status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
            >
              <option value="all">All Payment Types</option>
              <option value="QRIS">QRIS</option>
              <option value="CASH">CASH</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E5E7EB]">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFF3ED] text-[#F15A22] rounded-full text-sm">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E0F7F6] text-[#2DAEAA] rounded-full text-sm">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')}>×</button>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EDE9FE] text-[#8B5CF6] rounded-full text-sm">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter('all')}>×</button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3E8FF] text-[#A855F7] rounded-full text-sm">
                Category: {categoryFilter}
                <button onClick={() => setCategoryFilter('all')}>×</button>
              </span>
            )}
            {(startDate || endDate) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F3F4F6] text-[#1F2937] rounded-full text-sm">
                Date: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
                <button onClick={handleClearDateFilter}>×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B7280]">
          Found <span className="font-semibold text-[#1F2937]">{pagination.total}</span> transactions
          {displayedTransactions.length !== pagination.total && (
            <span> (showing {displayedTransactions.length})</span>
          )}
        </p>
        <p className="text-xs text-[#6B7280]">
          Page {pagination.page} of {pagination.pages}
        </p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#FFF3ED] to-[#E0F7F6]">
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Transaction ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Payment Method</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#1F2937]">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((transaction) => {
                  const statusStyles = getStatusStyles(transaction.status);
                  const StatusIcon = statusStyles.icon;
                  const isExpanded = expandedRow === transaction.transactionId;
                  const productInfo = transaction.metadata?.productInfo;
                  const isLoadingDetail = loadingDetail && expandedRow === transaction.transactionId;

                  return (
                    <React.Fragment key={transaction.transactionId}>
                      <tr
                        className={`border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer ${
                          isExpanded ? 'bg-[#F9FAFB]' : ''
                        }`}
                        onClick={() => handleExpandRow(transaction.transactionId)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Hash size={14} className="text-[#6B7280]" />
                            <span className="font-medium text-[#1F2937] text-sm">
                              {transaction.transactionId ? transaction.transactionId.slice(0, 8) + '...' : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#6B7280]" />
                            <span className="text-sm text-[#4B5563]">
                              {transaction.transactionDate ? formatDate(transaction.transactionDate) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Package size={14} className="text-[#6B7280]" />
                            <span className="text-sm text-[#4B5563]">
                              {productInfo?.name || transaction.metadata?.description || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-[#4B5563] capitalize">
                            {productInfo?.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-[#4B5563]">{transaction.paymentMethod || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-[#1F2937]">
                            {transaction.amount ? formatCurrency(transaction.amount) : 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 ${statusStyles.bg} ${statusStyles.text} rounded-full text-sm font-medium`}>
                            <StatusIcon size={14} />
                            {transaction.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(transaction.transactionId);
                            }}
                            className="flex items-center gap-1 text-[#F15A22] hover:text-[#2DAEAA] transition-colors"
                          >
                            {isLoadingDetail ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <>
                                <Eye size={16} />
                                <span className="text-sm">Details</span>
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Transaction Details */}
                      {isExpanded && selectedTransaction && (
                        <tr className="bg-[#F9FAFB]">
                          <td colSpan={8} className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-[#1F2937] flex items-center gap-2">
                                  <Receipt size={18} className="text-[#F15A22]" />
                                  Transaction Details - {selectedTransaction.transactionId}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                    <Printer size={16} className="text-[#6B7280]" />
                                  </button>
                                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                    <Share2 size={16} className="text-[#6B7280]" />
                                  </button>
                                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                    <FileText size={16} className="text-[#6B7280]" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Items List */}
                                <div className="lg:col-span-2">
                                  <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                                    <table className="w-full">
                                      <thead className="bg-[#F3F4F6]">
                                        <tr>
                                          <th className="text-left py-2 px-4 text-xs font-semibold text-[#6B7280]">Item</th>
                                          <th className="text-left py-2 px-4 text-xs font-semibold text-[#6B7280]">SKU</th>
                                          <th className="text-left py-2 px-4 text-xs font-semibold text-[#6B7280]">Qty</th>
                                          <th className="text-left py-2 px-4 text-xs font-semibold text-[#6B7280]">Unit Price</th>
                                          <th className="text-left py-2 px-4 text-xs font-semibold text-[#6B7280]">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedTransaction.metadata?.productInfo && (
                                          <tr className="border-t border-[#E5E7EB]">
                                            <td className="py-2 px-4">
                                              <div className="flex items-center gap-2">
                                                <Package size={14} className="text-[#6B7280]" />
                                                <span className="text-sm text-[#1F2937]">
                                                  {selectedTransaction.metadata.productInfo.name || 'N/A'}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="py-2 px-4 text-sm text-[#4B5563]">
                                              {selectedTransaction.metadata.productInfo.sku || 'N/A'}
                                            </td>
                                            <td className="py-2 px-4 text-sm text-[#4B5563]">
                                              {selectedTransaction.metadata.productInfo.quantity || 0}
                                            </td>
                                            <td className="py-2 px-4 text-sm text-[#4B5563]">
                                              {selectedTransaction.metadata.productInfo.unitPrice ? 
                                                formatCurrency(selectedTransaction.metadata.productInfo.unitPrice) : 'N/A'}
                                            </td>
                                            <td className="py-2 px-4 text-sm font-medium text-[#1F2937]">
                                              {selectedTransaction.metadata.productInfo.totalPrice ? 
                                                formatCurrency(selectedTransaction.metadata.productInfo.totalPrice) : 'N/A'}
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                      <tfoot className="bg-[#F9FAFB] border-t border-[#E5E7EB]">
                                        <tr>
                                          <td colSpan={4} className="py-2 px-4 text-right font-semibold text-[#1F2937]">
                                            Subtotal:
                                          </td>
                                          <td className="py-2 px-4 font-bold text-[#F15A22]">
                                            {selectedTransaction.amount ? formatCurrency(selectedTransaction.amount) : 'N/A'}
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>

                                {/* Payment Summary */}
                                <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
                                  <h5 className="font-medium text-[#1F2937] mb-3 flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#F15A22]" />
                                    Payment Summary
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-[#6B7280]">Transaction ID</span>
                                      <span className="text-[#1F2937] font-mono text-xs">
                                        {selectedTransaction.transactionId || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-[#6B7280]">Payment Method</span>
                                      <span className="text-[#1F2937] font-medium">
                                        {selectedTransaction.paymentMethod || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-[#6B7280]">Payment Channel</span>
                                      <span className="text-[#1F2937]">
                                        {selectedTransaction.paymentChannel || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-[#6B7280]">Category</span>
                                      <span className="text-[#1F2937] capitalize">
                                        {selectedTransaction.metadata?.productInfo?.category || 'Uncategorized'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-[#6B7280]">Refund Status</span>
                                      <span className={`font-medium ${
                                        selectedTransaction.refundStatus === 'None' 
                                          ? 'text-[#10B981]' 
                                          : 'text-[#F59E0B]'
                                      }`}>
                                        {selectedTransaction.refundStatus || 'None'}
                                      </span>
                                    </div>
                                    {selectedTransaction.refundStatus && selectedTransaction.refundStatus !== 'None' && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-[#6B7280]">Refund Amount</span>
                                        <span className="text-[#EF4444]">
                                          {selectedTransaction.refundAmount ? formatCurrency(selectedTransaction.refundAmount) : 'N/A'}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                      <span className="text-[#6B7280]">Chargeback</span>
                                      <span className={selectedTransaction.chargebackFlag ? 'text-[#EF4444]' : 'text-[#10B981]'}>
                                        {selectedTransaction.chargebackFlag ? 'Yes' : 'No'}
                                      </span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-[#E5E7EB]">
                                      <div className="flex justify-between font-bold">
                                        <span className="text-[#1F2937]">Total Amount</span>
                                        <span className="text-[#F15A22]">
                                          {selectedTransaction.amount ? formatCurrency(selectedTransaction.amount) : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6B7280]">
                    {loading ? 'Loading transactions...' : 'No transactions found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="p-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#F15A22] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  let pageNum = pagination.page;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        pagination.page === pageNum
                          ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white'
                          : 'border border-[#E5E7EB] hover:border-[#F15A22]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-[#E5E7EB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#F15A22] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .brutalist-card {
          box-shadow: 4px 4px 0px 0px #1F2937;
        }
      `}</style>
    </div>
  );
}