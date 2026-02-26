'use client';

import { useState } from 'react';
import {
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  ChevronRight,
  Search,
  BookOpen,
  Video,
  FileText,
  Users,
  Shield,
  CreditCard,
  TrendingUp,
  Zap,
  Download,
  PlayCircle,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Sparkles,
  Brain,
  Award
} from 'lucide-react';

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // FAQ Data
  const faqs = [
    {
      id: 'general1',
      category: 'general',
      question: 'What is PayBaba?',
      answer: 'PayBaba is a comprehensive financial platform designed for merchants to manage their business payments, access credit, and optimize their financial operations. We provide real-time transaction monitoring, credit scoring, and smart lending solutions.'
    },
    {
      id: 'general2',
      category: 'general',
      question: 'How does PayBaba work?',
      answer: 'PayBaba integrates with your business payment systems to analyze transaction patterns, calculate credit scores, and provide funding recommendations. Our AI-powered platform processes your transaction data to offer personalized insights and loan timing recommendations.'
    },
    {
      id: 'general3',
      category: 'general',
      question: 'Is PayBaba safe and secure?',
      answer: 'Yes! PayBaba uses bank-level encryption and security measures to protect your data. We are PCI-DSS compliant and never store sensitive payment information. Your transactions and business data are always encrypted and secure.'
    },
    {
      id: 'account1',
      category: 'account',
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking the "Sign Up" button on our homepage. You\'ll need to provide your business details, contact information, and verify your email address. The process takes about 5-10 minutes.'
    },
    {
      id: 'account2',
      category: 'account',
      question: 'What documents do I need to register?',
      answer: 'You\'ll need your business registration certificate, tax ID (NPWP), bank account details, and identification documents of the business owner. All documents should be clear and valid.'
    },
    {
      id: 'account3',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and enter your registered email. You\'ll receive a password reset link within a few minutes. If you don\'t see it, check your spam folder.'
    },
    {
      id: 'credit1',
      category: 'credit',
      question: 'How is my credit score calculated?',
      answer: 'Your credit score is calculated based on multiple factors including transaction volume, revenue consistency, growth trends, refund rates, and settlement times. Our AI analyzes your 6-month transaction history to generate a comprehensive score.'
    },
    {
      id: 'credit2',
      category: 'credit',
      question: 'What affects my credit limit?',
      answer: 'Your credit limit is determined by your credit score, monthly transaction volume, business history, and repayment performance. Higher transaction volumes and consistent growth typically result in higher limits.'
    },
    {
      id: 'credit3',
      category: 'credit',
      question: 'How long does loan approval take?',
      answer: 'Most loan applications are approved within 24-48 hours after submitting all required documents. Funds are typically disbursed within 1-2 business days after approval.'
    },
    {
      id: 'payments1',
      category: 'payments',
      question: 'How do I receive payouts?',
      answer: 'Payouts are sent directly to your registered bank account. You can choose your payout schedule (daily, weekly, or monthly) in the Payment Settings section. Processing times vary by bank.'
    },
    {
      id: 'payments2',
      category: 'payments',
      question: 'What payment methods are supported?',
      answer: 'We support bank transfers, credit cards, debit cards, UPI, and various e-wallets. For payouts, we support all major banks in Indonesia through our banking partners.'
    },
    {
      id: 'payments3',
      category: 'payments',
      question: 'Why was my transaction declined?',
      answer: 'Transactions may be declined due to insufficient funds, incorrect payment details, bank restrictions, or security flags. Check your transaction details and contact support if the issue persists.'
    }
  ];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    { id: 'all', name: 'All FAQs', icon: HelpCircle, count: faqs.length },
    { id: 'general', name: 'General', icon: BookOpen, count: faqs.filter(f => f.category === 'general').length },
    { id: 'account', name: 'Account', icon: Users, count: faqs.filter(f => f.category === 'account').length },
    { id: 'credit', name: 'Credit', icon: CreditCard, count: faqs.filter(f => f.category === 'credit').length },
    { id: 'payments', name: 'Payments', icon: TrendingUp, count: faqs.filter(f => f.category === 'payments').length }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <span>Pages</span>
            <ChevronRight size={14} />
            <span className="text-[#1F2937] font-medium">Help & Support</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-[#6B7280] mt-2">Search our help center or browse frequently asked questions</p>
        </div>
      </div>

      {/* Hero Search */}
      <div className="bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Find answers fast</h2>
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* About PayBaba Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#F15A22] to-[#2DAEAA] rounded-xl flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">About PayBaba</h2>
            <p className="text-[#6B7280]">Your trusted financial partner for business growth</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-[#F9FAFB] rounded-xl hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center mb-3">
              <Brain size={20} className="text-[#F15A22]" />
            </div>
            <h3 className="font-semibold text-[#1F2937] mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-[#6B7280]">Advanced algorithms analyze your transaction patterns to provide personalized credit recommendations and optimal loan timing.</p>
          </div>

          <div className="p-4 bg-[#F9FAFB] rounded-xl hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-[#E0F7F6] rounded-lg flex items-center justify-center mb-3">
              <Shield size={20} className="text-[#2DAEAA]" />
            </div>
            <h3 className="font-semibold text-[#1F2937] mb-2">Secure & Reliable</h3>
            <p className="text-sm text-[#6B7280]">Bank-level security with end-to-end encryption. Your data is protected with the highest industry standards.</p>
          </div>

          <div className="p-4 bg-[#F9FAFB] rounded-xl hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-[#FFF3ED] rounded-lg flex items-center justify-center mb-3">
              <Zap size={20} className="text-[#F15A22]" />
            </div>
            <h3 className="font-semibold text-[#1F2937] mb-2">Fast Funding</h3>
            <p className="text-sm text-[#6B7280]">Get approved for credit within 24 hours and receive funds in as little as 1-2 business days.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-[#F3F4F6] to-[#F9FAFB] rounded-2xl p-6 lg:p-8 border border-[#E5E7EB]">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-2">
          <PlayCircle size={24} className="text-[#F15A22]" />
          How PayBaba Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-[#F15A22] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">1</div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-xs text-[#6B7280]">Link your business accounts securely</p>
            </div>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="hidden md:block absolute top-1/2 -right-4 text-[#F15A22]">→</div>
            ))}
          </div>
          <div className="relative">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-[#2DAEAA] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">2</div>
              <h3 className="font-semibold mb-2">Analyze</h3>
              <p className="text-xs text-[#6B7280]">AI processes your transaction data</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-[#F15A22] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">3</div>
              <h3 className="font-semibold mb-2">Get Score</h3>
              <p className="text-xs text-[#6B7280]">Receive your credit score instantly</p>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-[#2DAEAA] rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">4</div>
              <h3 className="font-semibold mb-2">Access Funds</h3>
              <p className="text-xs text-[#6B7280]">Get approved and receive funding</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Frequently Asked Questions</h2>
            <p className="text-sm text-[#6B7280] mt-1">Find answers to common questions</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#F15A22] to-[#2DAEAA] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.id ? 'bg-white/20' : 'bg-white'
                }`}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-[#E5E7EB] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F9FAFB] transition-colors"
              >
                <span className="font-medium text-[#1F2937]">{faq.question}</span>
                <ChevronRight
                  size={16}
                  className={`text-[#6B7280] transform transition-transform ${
                    activeFaq === faq.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
              
              {activeFaq === faq.id && (
                <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
                  <p className="text-[#4B5563] text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle size={48} className="mx-auto text-[#6B7280] mb-4" />
            <h3 className="font-semibold text-[#1F2937] mb-2">No results found</h3>
            <p className="text-[#6B7280]">Try searching with different keywords</p>
          </div>
        )}
      </div>

      {/* Contact & Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Chat */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-[#FFF3ED] rounded-xl flex items-center justify-center mb-4">
            <MessageCircle size={24} className="text-[#F15A22]" />
          </div>
          <h3 className="font-semibold text-[#1F2937] mb-2">Live Chat</h3>
          <p className="text-sm text-[#6B7280] mb-4">Chat with our support team in real-time</p>
          <p className="text-xs text-[#10B981] mb-3">🟢 Online - Usually reply in 5 mins</p>
          <button className="w-full py-2 border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors">
            Start Chat
          </button>
        </div>

        {/* Email Support */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-[#E0F7F6] rounded-xl flex items-center justify-center mb-4">
            <Mail size={24} className="text-[#2DAEAA]" />
          </div>
          <h3 className="font-semibold text-[#1F2937] mb-2">Email Support</h3>
          <p className="text-sm text-[#6B7280] mb-4">Send us an email and we'll get back to you</p>
          <p className="text-xs text-[#6B7280] mb-3">Response within 24 hours</p>
          <a 
            href="mailto:support@paybaba.com"
            className="block w-full py-2 text-center border border-[#E5E7EB] rounded-lg hover:border-[#2DAEAA] transition-colors"
          >
            support@paybaba.com
          </a>
        </div>

        {/* Phone Support */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-xl transition-all">
          <div className="w-12 h-12 bg-[#FFF3ED] rounded-xl flex items-center justify-center mb-4">
            <Phone size={24} className="text-[#F15A22]" />
          </div>
          <h3 className="font-semibold text-[#1F2937] mb-2">Phone Support</h3>
          <p className="text-sm text-[#6B7280] mb-4">Speak directly with a support specialist</p>
          <p className="text-xs text-[#6B7280] mb-3">Mon-Fri, 9am-6pm</p>
          <a 
            href="tel:+622155551234"
            className="block w-full py-2 text-center border border-[#E5E7EB] rounded-lg hover:border-[#F15A22] transition-colors"
          >
            +62 21 5555 1234
          </a>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-gradient-to-r from-[#F15A22]/5 to-[#2DAEAA]/5 rounded-2xl p-6 border border-[#E5E7EB]">
        <h2 className="text-xl font-bold text-[#1F2937] mb-4">Helpful Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all">
            <Video size={20} className="text-[#F15A22]" />
            <span className="text-sm font-medium">Video Tutorials</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all">
            <FileText size={20} className="text-[#2DAEAA]" />
            <span className="text-sm font-medium">Documentation</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all">
            <Download size={20} className="text-[#F15A22]" />
            <span className="text-sm font-medium">API Guides</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all">
            <Award size={20} className="text-[#2DAEAA]" />
            <span className="text-sm font-medium">Best Practices</span>
          </a>
        </div>
      </div>

      {/* Community & Social */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-[#F15A22]" />
            <div>
              <h3 className="font-semibold text-[#1F2937]">Join our community</h3>
              <p className="text-sm text-[#6B7280]">Connect with other merchants and share insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center hover:bg-[#F15A22] hover:text-white transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center hover:bg-[#2DAEAA] hover:text-white transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center hover:bg-[#F15A22] hover:text-white transition-all">
              <Linkedin size={18} />
            </a>
            <a href="#" className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center hover:bg-[#2DAEAA] hover:text-white transition-all">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}