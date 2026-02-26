'use client';

import { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Mail,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Clock,
  ChevronRight,
  CheckCheck,
  Trash2,
  Archive,
  Settings
} from 'lucide-react';

// Dummy notifications data
const notificationsData = [
  {
    id: 1,
    title: 'Credit Score Updated',
    message: 'Your credit score has increased by 25 points. Great job maintaining consistent transactions!',
    time: '2 minutes ago',
    date: '2024-01-15T10:30:00',
    type: 'success',
    category: 'credit',
    read: false,
    icon: TrendingUp,
    action: 'View Details',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Team Member Added',
    message: 'Sarah Johnson has been added to the Finance team by admin.',
    time: '15 minutes ago',
    date: '2024-01-15T10:15:00',
    type: 'info',
    category: 'team',
    read: false,
    icon: Users,
    action: 'View Team',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Security Alert',
    message: 'New login detected from Chrome browser on Windows. If this wasn\'t you, please secure your account.',
    time: '1 hour ago',
    date: '2024-01-15T09:45:00',
    type: 'warning',
    category: 'security',
    read: false,
    icon: Shield,
    action: 'Review Activity',
    priority: 'high'
  },
  {
    id: 4,
    title: 'Monthly Report Ready',
    message: 'Your December 2023 financial report is now available for download.',
    time: '3 hours ago',
    date: '2024-01-15T07:30:00',
    type: 'info',
    category: 'report',
    read: true,
    icon: Mail,
    action: 'Download',
    priority: 'low'
  },
  {
    id: 5,
    title: 'Payment Received',
    message: 'Payment of ₹2,50,000 received from Acme Corp. Transaction ID: TXN123456',
    time: '5 hours ago',
    date: '2024-01-15T05:20:00',
    type: 'success',
    category: 'payment',
    read: true,
    icon: CheckCircle,
    action: 'View Transaction',
    priority: 'medium'
  },
  {
    id: 6,
    title: 'Refund Alert',
    message: 'High refund rate detected (4.2%). Review recent transactions to identify issues.',
    time: '1 day ago',
    date: '2024-01-14T15:45:00',
    type: 'warning',
    category: 'alert',
    read: true,
    icon: AlertCircle,
    action: 'Review',
    priority: 'high'
  },
  {
    id: 7,
    title: 'New Feature Available',
    message: 'Try our new AI-powered credit insights feature to get personalized recommendations.',
    time: '2 days ago',
    date: '2024-01-13T11:20:00',
    type: 'info',
    category: 'feature',
    read: true,
    icon: Star,
    action: 'Try Now',
    priority: 'low'
  },
  {
    id: 8,
    title: 'Document Expiring Soon',
    message: 'Your business license will expire in 30 days. Please upload renewed document.',
    time: '2 days ago',
    date: '2024-01-13T09:10:00',
    type: 'warning',
    category: 'document',
    read: false,
    icon: AlertCircle,
    action: 'Upload',
    priority: 'high'
  },
  {
    id: 9,
    title: 'Limit Increase Approved',
    message: 'Your credit limit has been increased to ₹7.5L. Congratulations!',
    time: '3 days ago',
    date: '2024-01-12T14:30:00',
    type: 'success',
    category: 'credit',
    read: true,
    icon: CheckCircle,
    action: 'View Limit',
    priority: 'high'
  },
  {
    id: 10,
    title: 'Settlement Delay Notice',
    message: 'Settlement for transaction TXN789012 is delayed by 24 hours due to bank maintenance.',
    time: '3 days ago',
    date: '2024-01-12T10:15:00',
    type: 'warning',
    category: 'payment',
    read: true,
    icon: Clock,
    action: 'Track',
    priority: 'medium'
  }
];

const categories = ['All', 'credit', 'team', 'security', 'report', 'payment', 'alert', 'feature', 'document'];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'read', 'unread'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState<typeof notificationsData[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' ? true :
      filterType === 'read' ? notif.read :
      filterType === 'unread' ? !notif.read : true;
    
    const matchesCategory = selectedCategory === 'All' || notif.category === selectedCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-[#10B981]/10',
          text: 'text-[#10B981]',
          border: 'border-[#10B981]/20'
        };
      case 'warning':
        return {
          bg: 'bg-[#F59E0B]/10',
          text: 'text-[#F59E0B]',
          border: 'border-[#F59E0B]/20'
        };
      case 'info':
        return {
          bg: 'bg-[#3B82F6]/10',
          text: 'text-[#3B82F6]',
          border: 'border-[#3B82F6]/20'
        };
      default:
        return {
          bg: 'bg-[#6B7280]/10',
          text: 'text-[#6B7280]',
          border: 'border-[#6B7280]/20'
        };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-[#6B7280]/10 text-[#6B7280] text-xs rounded-full">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-[#6B7280] mt-2">Stay updated with your latest activities and alerts</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#F15A22] transition-all duration-300"
          >
            <CheckCheck size={16} className="text-[#6B7280]" />
            <span className="text-sm font-medium">Mark all as read</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all duration-300">
            <Settings size={16} />
            <span className="text-sm font-medium">Preferences</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-[#F15A22]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Total</p>
              <p className="text-xl font-bold text-[#1F2937]">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E0F7F6] rounded-lg flex items-center justify-center">
              <Mail size={20} className="text-[#2DAEAA]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Unread</p>
              <p className="text-xl font-bold text-[#1F2937]">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-[#F15A22]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">High Priority</p>
              <p className="text-xl font-bold text-[#1F2937]">{notifications.filter(n => n.priority === 'high' && !n.read).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E0F7F6] rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-[#2DAEAA]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">This Week</p>
              <p className="text-xl font-bold text-[#1F2937]">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {/* Filter Tabs */}
            <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'all'
                    ? 'bg-white text-[#F15A22] shadow-md'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'unread'
                    ? 'bg-white text-[#F15A22] shadow-md'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilterType('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'read'
                    ? 'bg-white text-[#F15A22] shadow-md'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                Read
              </button>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
              >
                <Filter size={18} className="text-[#6B7280]" />
                <span className="text-sm">Category</span>
              </button>

              {showFilters && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-xl z-10 p-2 max-h-64 overflow-y-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm capitalize ${
                        selectedCategory === cat
                          ? 'bg-[#F15A22] text-white'
                          : 'hover:bg-[#F3F4F6]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E5E7EB]">
            <Bell size={48} className="mx-auto text-[#6B7280] mb-4" />
            <h3 className="text-lg font-semibold text-[#1F2937] mb-2">No notifications</h3>
            <p className="text-[#6B7280]">You're all caught up! Check back later.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            const typeStyles = getTypeStyles(notification.type);

            return (
              <div
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                  setSelectedNotification(notification);
                }}
                className={`group bg-white rounded-xl border border-[#E5E7EB] p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  !notification.read ? 'border-l-4 border-l-[#F15A22]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${typeStyles.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={typeStyles.text} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-semibold ${!notification.read ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getPriorityBadge(notification.priority)}
                        <span className="text-xs text-[#6B7280] whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${typeStyles.bg} ${typeStyles.text} capitalize`}>
                          {notification.category}
                        </span>
                        {notification.action && (
                          <button className="text-xs text-[#F15A22] hover:text-[#2DAEAA] transition-colors flex items-center gap-1">
                            {notification.action}
                            <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
                            title="Mark as read"
                          >
                            <CheckCheck size={14} className="text-[#6B7280]" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-[#EF4444]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Archive functionality
                          }}
                          className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
                          title="Archive"
                        >
                          <Archive size={14} className="text-[#6B7280]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 ${getTypeStyles(selectedNotification.type).bg} rounded-xl flex items-center justify-center`}>
                    <selectedNotification.icon size={28} className={getTypeStyles(selectedNotification.type).text} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1F2937]">{selectedNotification.title}</h2>
                    <p className="text-sm text-[#6B7280]">{selectedNotification.time}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="text-[#6B7280] hover:text-[#1F2937]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#F9FAFB] rounded-lg">
                  <p className="text-[#1F2937] leading-relaxed">{selectedNotification.message}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${getTypeStyles(selectedNotification.type).bg} ${getTypeStyles(selectedNotification.type).text} capitalize`}>
                    {selectedNotification.category}
                  </span>
                  {getPriorityBadge(selectedNotification.priority)}
                  <span className="text-[#6B7280]">
                    {new Date(selectedNotification.date).toLocaleDateString()}
                  </span>
                </div>

                {selectedNotification.action && (
                  <button className="w-full py-3 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    {selectedNotification.action}
                  </button>
                )}

                <div className="flex gap-2 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => markAsRead(selectedNotification.id)}
                    className="flex-1 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => deleteNotification(selectedNotification.id)}
                    className="flex-1 py-2 border border-[#EF4444] text-[#EF4444] rounded-lg hover:bg-[#FEE2E2] transition-colors"
                  >
                    Delete
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