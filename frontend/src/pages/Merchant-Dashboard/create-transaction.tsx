/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Wallet,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Clock,
  ChevronRight,
  Package,
  Tag,
  FileText,
  Building2,
  Sparkles,
  Download,
  X,
  Check
} from 'lucide-react';
import { transactionApi } from '@/services/api';
import {QRCodeSVG} from 'qrcode.react';

// Types
interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
  url: string;
}

interface TransactionResponse {
  transactionId: string;
  amount: string;
  status: string;
  qrCode: string;
  qrisUrl: string;
  expiredTime: string;
  productInfo: ProductItem[];
}

type PaymentType = 'QRIS' | 'CASH';

export default function CreateTransactionPage() {
  const navigate = useNavigate();
  
  // Form state
  const [paymentType, setPaymentType] = useState<PaymentType>('QRIS');
  const [description, setDescription] = useState('');
  const [productItems, setProductItems] = useState<ProductItem[]>([
        {
            id: `ITEM${Date.now().toString().slice(-5)}1`, // Shorter ID
            name: '',
            price: 0,
            quantity: 1,
            type: 'General',
            url: 'https://paybaba.id'
        }
    ]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Calculate total amount
  const totalAmount = productItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add new product item
  const addProductItem = () => {
    setProductItems([
        ...productItems,
        {
        id: `ITEM${Date.now().toString().slice(-5)}${productItems.length + 1}`, // Shorter ID
        name: '',
        price: 0,
        quantity: 1,
        type: 'General',
        url: 'https://paybaba.id'
        }
    ]);
    };

  // Remove product item
  const removeProductItem = (index: number) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter((_, i) => i !== index));
    }
  };

  // Update product item
  const updateProductItem = (index: number, field: keyof ProductItem, value: any) => {
    const updated = [...productItems];
    updated[index] = { ...updated[index], [field]: value };
    setProductItems(updated);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }

    for (const item of productItems) {
      if (!item.name.trim()) {
        setError('All product names are required');
        return false;
      }
      if (item.price <= 0) {
        setError('All product prices must be greater than 0');
        return false;
      }
      if (item.quantity <= 0) {
        setError('All product quantities must be greater than 0');
        return false;
      }
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
      const response = await transactionApi.createTransaction({
        type: paymentType,
        amount: totalAmount,
        description,
        productName: productItems[0].name, // Use first product as main product name
        productInfo: productItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          url: item.url
        }))
      });

      if (response.success && response.data) {
        setTransactionResult(response.data);
        setSuccess(true);
        if (paymentType === 'QRIS') {
          setShowQRModal(true);
        }
      } else {
        setError(response.message || 'Failed to create transaction');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // Format date from API response
  const formatExpiryTime = (expiryTime: string) => {
    if (!expiryTime) return 'N/A';
    const year = expiryTime.substring(0, 4);
    const month = expiryTime.substring(4, 6);
    const day = expiryTime.substring(6, 8);
    const hour = expiryTime.substring(8, 10);
    const minute = expiryTime.substring(10, 12);
    const second = expiryTime.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  // Reset form
  const handleReset = () => {
    setPaymentType('QRIS');
    setDescription('');
    setProductItems([
      {
        id: `ITEM-${Date.now()}-1`,
        name: '',
        price: 0,
        quantity: 1,
        type: 'General',
        url: 'https://paybaba.id'
      }
    ]);
    setSuccess(false);
    setTransactionResult(null);
    setShowQRModal(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <button
              onClick={() => navigate('/merchant/dashboard')}
              className="hover:text-[#F15A22] transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Dashboard
            </button>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Create Transaction</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            Create New Transaction
          </h1>
          <p className="text-[#6B7280] mt-2">Generate payment QR or create cash transaction for your customers</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && transactionResult && !showQRModal && (
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Transaction Created Successfully!</h2>
                <p className="text-white/90 mb-2">Transaction ID: {transactionResult.transactionId}</p>
                <p className="text-white/80 text-sm">Amount: {formatCurrency(parseFloat(transactionResult.amount))}</p>
                {paymentType === 'QRIS' && (
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-white text-[#10B981] rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <QrCode size={16} />
                    View QR Code
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section - Left */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            {/* Payment Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1F2937] mb-3">
                Payment Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentType('QRIS')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentType === 'QRIS'
                      ? 'border-[#F15A22] bg-gradient-to-r from-[#FFF3ED] to-[#FFE5D5]'
                      : 'border-[#E5E7EB] hover:border-[#F15A22]/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentType === 'QRIS' ? 'bg-[#F15A22]' : 'bg-[#F3F4F6]'
                  }`}>
                    <QrCode size={20} className={paymentType === 'QRIS' ? 'text-white' : 'text-[#6B7280]'} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${paymentType === 'QRIS' ? 'text-[#F15A22]' : 'text-[#1F2937]'}`}>
                      QRIS Payment
                    </p>
                    <p className="text-xs text-[#6B7280]">Generate QR code for customer</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('CASH')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentType === 'CASH'
                      ? 'border-[#2DAEAA] bg-gradient-to-r from-[#E0F7F6] to-[#C7EEE8]'
                      : 'border-[#E5E7EB] hover:border-[#2DAEAA]/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentType === 'CASH' ? 'bg-[#2DAEAA]' : 'bg-[#F3F4F6]'
                  }`}>
                    <Wallet size={20} className={paymentType === 'CASH' ? 'text-white' : 'text-[#6B7280]'} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${paymentType === 'CASH' ? 'text-[#2DAEAA]' : 'text-[#1F2937]'}`}>
                      Cash Payment
                    </p>
                    <p className="text-xs text-[#6B7280]">Record cash transaction</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-[#1F2937] mb-2">
                Transaction Description <span className="text-[#F15A22]">*</span>
              </label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Payment for order #INV-001"
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] transition-colors"
                />
              </div>
            </div>

            {/* Product Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-[#1F2937]">
                  Product Items <span className="text-[#F15A22]">*</span>
                </label>
                <button
                  type="button"
                  onClick={addProductItem}
                  className="flex items-center gap-1 text-sm text-[#F15A22] hover:text-[#2DAEAA] transition-colors"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {productItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] relative group"
                  >
                    {productItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductItem(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Product Name */}
                      <div>
                        <label className="block text-xs text-[#6B7280] mb-1">Product Name</label>
                        <div className="relative">
                          <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateProductItem(index, 'name', e.target.value)}
                            placeholder="Product name"
                            className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] text-sm"
                          />
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-xs text-[#6B7280] mb-1">Price (IDR)</label>
                        <div className="relative">
                          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                          <input
                            type="number"
                            min="0"
                            value={item.price || ''}
                            onChange={(e) => updateProductItem(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full pl-9 pr-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] text-sm"
                          />
                        </div>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-xs text-[#6B7280] mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateProductItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F15A22] text-sm"
                        />
                      </div>

                      {/* Subtotal (read-only) */}
                      <div>
                        <label className="block text-xs text-[#6B7280] mb-1">Subtotal</label>
                        <div className="px-3 py-2 bg-[#F3F4F6] rounded-lg text-sm font-medium text-[#1F2937]">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
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
                  Creating Transaction...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Create {paymentType} Transaction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Summary Section - Right */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-[#F15A22]/10 to-[#2DAEAA]/10 rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-[#F15A22]" />
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              {productItems.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-[#1F2937]">{item.name || `Item ${index + 1}`}</p>
                    <p className="text-xs text-[#6B7280]">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-semibold text-[#1F2937]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB]">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1F2937]">Total Amount</span>
                <span className="text-2xl font-bold text-[#F15A22]">{formatCurrency(totalAmount)}</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-2">
                {paymentType === 'QRIS' ? 'Customer will scan QR code to pay' : 'Record as cash payment'}
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-[#F15A22]" />
              <h3 className="font-semibold text-[#1F2937]">Quick Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>QRIS transactions generate a QR code for customer to scan</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>Cash transactions are recorded immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>You can add multiple items to a single transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-[#10B981] mt-0.5" />
                <span>All transactions will appear in your transaction history</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && transactionResult && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <QrCode size={20} className="text-[#F15A22]" />
                  <h2 className="text-xl font-bold text-[#1F2937]">QRIS Payment</h2>
                </div>
                <button onClick={() => setShowQRModal(false)} className="text-[#6B7280] hover:text-[#1F2937]">✕</button>
              </div>

              <div className="flex flex-col items-center">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                  <QRCodeSVG
                    value={transactionResult.qrCode}
                    size={200}
                    level="H"
                    includeMargin={true}
                    className="rounded-lg"
                  />
                </div>

                {/* Transaction Info */}
                <div className="w-full space-y-3 mb-4">
                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Transaction ID</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-[#1F2937]">{transactionResult.transactionId}</p>
                      <button
                        onClick={() => handleCopy(transactionResult.transactionId)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        {copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} className="text-[#6B7280]" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Amount</p>
                    <p className="text-xl font-bold text-[#F15A22]">{formatCurrency(parseFloat(transactionResult.amount))}</p>
                  </div>

                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">Expiry Time</p>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#F59E0B]" />
                      <p className="text-sm text-[#1F2937]">{formatExpiryTime(transactionResult.expiredTime)}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F9FAFB] rounded-lg">
                    <p className="text-xs text-[#6B7280] mb-1">QR String</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono text-[#1F2937] truncate max-w-[200px]">{transactionResult.qrCode}</p>
                      <button
                        onClick={() => handleCopy(transactionResult.qrCode)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Copy size={14} className="text-[#6B7280]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <a
                    href={transactionResult.qrisUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <ExternalLink size={16} />
                    Open Payment Page
                  </a>
                  <button
                    onClick={() => {
                      const canvas = document.querySelector('canvas');
                      if (canvas) {
                        const link = document.createElement('a');
                        link.download = `qris-${transactionResult.transactionId}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                    className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg font-medium hover:bg-[#F3F4F6] transition-all"
                  >
                    <Download size={16} />
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