'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Camera,
  Save,
  Bell,
  Shield,
  Eye,
  EyeOff,
  CreditCard,
  Clock,
  Languages,
  Sun,
  Lock,
  Smartphone,
  Laptop,
  LogOut,
  ChevronRight,
  Edit2,
  X,
  Plus,
  Download,
  Upload,
  RefreshCw,
  FileText
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  // Mock merchant data
  const [merchantData, ] = useState({
    companyName: 'Acme Industries',
    legalName: 'Acme Industries Pvt Ltd',
    email: 'contact@acmeindustries.com',
    phone: '+62 21 5555 1234',
    mobile: '+62 812 3456 7890',
    address: 'Jl. Sudirman No. 123',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    postalCode: '12930',
    country: 'Indonesia',
    website: 'www.acmeindustries.com',
    established: '2018',
    employeeCount: '50-100',
    taxId: '12.345.678.9-012.345',
    businessType: 'Technology & Software',
    description: 'Leading provider of enterprise software solutions and digital transformation services.'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Settings</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-[#6B7280] mt-2">Manage your account preferences and business information</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] bg-white rounded-xl hover:border-[#F15A22] transition-all duration-300">
            <RefreshCw size={16} className="text-[#6B7280]" />
            <span className="text-sm">Sync</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white shadow-lg'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}

          {/* Logout Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#EF4444] hover:bg-[#FEE2E2] transition-all duration-300 mt-6">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 shadow-xl">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#1F2937]">Profile Information</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Update your personal information and contact details</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
                >
                  {isEditing ? (
                    <>
                      <X size={16} className="text-[#F15A22]" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} className="text-[#F15A22]" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                    {merchantData.companyName.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:border-[#F15A22] transition-colors shadow-lg">
                      <Camera size={16} className="text-[#6B7280]" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F2937]">{merchantData.companyName}</h3>
                  <p className="text-sm text-[#6B7280]">Member since {merchantData.established}</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={merchantData.legalName}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB] disabled:text-[#6B7280]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Display Name</label>
                  <input
                    type="text"
                    value={merchantData.companyName}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB] disabled:text-[#6B7280]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="email"
                      value={merchantData.email}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="tel"
                      value={merchantData.phone}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Mobile Number</label>
                  <div className="relative">
                    <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="tel"
                      value={merchantData.mobile}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Website</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="url"
                      value={merchantData.website}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <h3 className="font-semibold text-[#1F2937] mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Street Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                      <input
                        type="text"
                        value={merchantData.address}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">City</label>
                    <input
                      type="text"
                      value={merchantData.city}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Province</label>
                    <input
                      type="text"
                      value={merchantData.province}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={merchantData.postalCode}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Country</label>
                    <input
                      type="text"
                      value={merchantData.country}
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] disabled:bg-[#F9FAFB]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Business Information</h2>
                <p className="text-sm text-[#6B7280] mt-1">Manage your business details and tax information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Business Type</label>
                  <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                    <option>Technology & Software</option>
                    <option>Retail & E-commerce</option>
                    <option>Manufacturing</option>
                    <option>Services</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Year Established</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="text"
                      value={merchantData.established}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Employee Count</label>
                  <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>50-100</option>
                    <option>100-500</option>
                    <option>500+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Tax ID / NPWP</label>
                  <input
                    type="text"
                    value={merchantData.taxId}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#6B7280] mb-2">Business Description</label>
                  <textarea
                    rows={4}
                    value={merchantData.description}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] resize-none"
                  />
                </div>
              </div>

              {/* Documents Section */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <h3 className="font-semibold text-[#1F2937] mb-4">Business Documents</h3>
                <div className="space-y-3">
                  {['Business License', 'Tax Registration', 'Bank Statement'].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#F15A22]" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-white rounded transition-colors">
                          <Eye size={14} className="text-[#6B7280]" />
                        </button>
                        <button className="p-1 hover:bg-white rounded transition-colors">
                          <Download size={14} className="text-[#6B7280]" />
                        </button>
                        <button className="p-1 hover:bg-white rounded transition-colors">
                          <Upload size={14} className="text-[#6B7280]" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="flex items-center gap-2 text-[#F15A22] hover:text-[#2DAEAA] transition-colors">
                    <Plus size={16} />
                    <span className="text-sm">Add Document</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Security Settings</h2>
                <p className="text-sm text-[#6B7280] mt-1">Manage your password and security preferences</p>
              </div>

              {/* Password Change */}
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <h3 className="font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <Lock size={16} className="text-[#F15A22]" />
                  Change Password
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Current Password"
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg hover:shadow-lg transition-all">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1F2937] flex items-center gap-2">
                      <Shield size={16} className="text-[#F15A22]" />
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-[#6B7280] mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#F15A22] peer-checked:to-[#2DAEAA]"></div>
                  </label>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <h3 className="font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <Laptop size={16} className="text-[#F15A22]" />
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Laptop size={16} className="text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Chrome on Windows</p>
                        <p className="text-xs text-[#6B7280]">Jakarta, Indonesia • Current session</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#10B981]">Active now</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Smartphone size={16} className="text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">iPhone 14 Pro</p>
                        <p className="text-xs text-[#6B7280]">Jakarta, Indonesia • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-xs text-[#EF4444] hover:text-[#F15A22]">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Notification Preferences</h2>
                <p className="text-sm text-[#6B7280] mt-1">Choose how you want to be notified</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
                  { id: 'sms', label: 'SMS Notifications', description: 'Get text messages for important alerts', icon: Smartphone },
                  { id: 'push', label: 'Push Notifications', description: 'Browser push notifications', icon: Bell },
                  { id: 'marketing', label: 'Marketing Communications', description: 'Promotional offers and updates', icon: Mail }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-[#F9FAFB] rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Icon size={16} className="text-[#F15A22]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937]">{item.label}</p>
                          <p className="text-xs text-[#6B7280]">{item.description}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications[item.id as keyof typeof notifications]}
                          onChange={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#F15A22] peer-checked:to-[#2DAEAA]"></div>
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Quiet Hours */}
              <div className="p-4 bg-[#F9FAFB] rounded-xl">
                <h3 className="font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-[#F15A22]" />
                  Quiet Hours
                </h3>
                <div className="flex items-center gap-4">
                  <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                    <option>22:00</option>
                    <option>23:00</option>
                    <option>00:00</option>
                  </select>
                  <span>to</span>
                  <select className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                    <option>06:00</option>
                    <option>07:00</option>
                    <option>08:00</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Payment Methods</h2>
                <p className="text-sm text-[#6B7280] mt-1">Manage your payment and payout settings</p>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[#1F2937]">Bank Accounts</h3>
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Building2 size={20} className="text-[#F15A22]" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Mandiri</p>
                        <p className="text-sm text-[#6B7280]">**** 1234 • Jakarta Pusat</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-xs rounded-full">Primary</span>
                  </div>
                </div>
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Building2 size={20} className="text-[#2DAEAA]" />
                      </div>
                      <div>
                        <p className="font-medium">BCA</p>
                        <p className="text-sm text-[#6B7280]">**** 5678 • Jakarta Selatan</p>
                      </div>
                    </div>
                    <button className="text-xs text-[#6B7280] hover:text-[#EF4444]">Remove</button>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[#F15A22] hover:text-[#2DAEAA] transition-colors">
                  <Plus size={16} />
                  <span>Add Bank Account</span>
                </button>
              </div>

              {/* Payout Schedule */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <h3 className="font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-[#F15A22]" />
                  Payout Schedule
                </h3>
                <select className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                  <option>Daily</option>
                  <option>Weekly (Every Monday)</option>
                  <option>Bi-weekly</option>
                  <option>Monthly (1st of month)</option>
                </select>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1F2937]">Preferences</h2>
                <p className="text-sm text-[#6B7280] mt-1">Customize your experience</p>
              </div>

              <div className="space-y-4">
                {/* Language */}
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Languages size={16} className="text-[#F15A22]" />
                      </div>
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-xs text-[#6B7280]">Choose your preferred language</p>
                      </div>
                    </div>
                    <select className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                      <option>English</option>
                      <option>Indonesian</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                </div>

                {/* Timezone */}
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Clock size={16} className="text-[#F15A22]" />
                      </div>
                      <div>
                        <p className="font-medium">Timezone</p>
                        <p className="text-xs text-[#6B7280]">Set your local timezone</p>
                      </div>
                    </div>
                    <select className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                      <option>Asia/Jakarta (WIB)</option>
                      <option>Asia/Makassar (WITA)</option>
                      <option>Asia/Jayapura (WIT)</option>
                    </select>
                  </div>
                </div>

                {/* Date Format */}
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Calendar size={16} className="text-[#F15A22]" />
                      </div>
                      <div>
                        <p className="font-medium">Date Format</p>
                        <p className="text-xs text-[#6B7280]">How dates should be displayed</p>
                      </div>
                    </div>
                    <select className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22]">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                {/* Theme */}
                <div className="p-4 bg-[#F9FAFB] rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Sun size={16} className="text-[#F15A22]" />
                      </div>
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-xs text-[#6B7280]">Light mode only</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-[#F15A22] text-white rounded-lg text-sm">Light</div>
                      <div className="px-3 py-1.5 bg-[#F3F4F6] text-[#6B7280] rounded-lg text-sm">Dark</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}