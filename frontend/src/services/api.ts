/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// AUTH

export interface RegisterRequest {
  email: string;
  password: string;
  companyName: string;
  fullName: string;
  city: string;
  address: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  userId: string;
  merchantId: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return response.data;
  },
  
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
  
  refreshToken: async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    const response = await api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data);
    return response.data;
  },
  
  requestPasswordReset: async (data: RequestPasswordResetRequest): Promise<ApiResponse<RequestPasswordResetResponse>> => {
    const response = await api.post<ApiResponse<RequestPasswordResetResponse>>('/auth/request-password-reset', data);
    return response.data;
  },
  
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> => {
    const response = await api.post<ApiResponse<ResetPasswordResponse>>('/auth/reset-password', data);
    return response.data;
  },
};




// Dashboard Overview

export interface MerchantProfile {
  user: {
    id: string;
    email: string;
    fullName: string;
    companyName: string;
    phoneNumber: string;
    city: string;
    address: string;
  };
  merchant: {
    merchantId: string;
    businessCategory: string;
    businessScale: string;
    joinDate: string;
  };
}

export interface DashboardData {
  merchantId: string;
  companyName: string;
  currentCreditScore: number;
  riskBand: string;
  estimatedMinLimit: string;
  estimatedMaxLimit: string;
  monthlyTransactionVolume: number;
  monthlyGrowth: number;
  refundRate: number;
  totalTransactions: number;
  avgDailyTransaction: number;
  scoreHistory: Array<{
    date: string;
    score: number;
  }>;
}

export interface ProductInsights {
  performance_summary: string;
  top_trending_products: Array<{
    name: string;
    reason: string;
  }>;
  inventory_advice: string;
  growth_opportunity: string;
}

// Add to your authApi object
export const merchantApi = {
  getProfile: async (): Promise<ApiResponse<MerchantProfile>> => {
    const response = await api.get<ApiResponse<MerchantProfile>>('/merchant/profile');
    return response.data;
  },
  
  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    const response = await api.get<ApiResponse<DashboardData>>('/merchant/dashboard');
    return response.data;
  },
  
  getProductInsights: async (): Promise<ApiResponse<ProductInsights>> => {
    const response = await api.get<ApiResponse<ProductInsights>>('/merchant/product-insights');
    return response.data;
  },
};



// Transactions

// Add these interfaces and functions to your existing api.ts

export interface TransactionMetadata {
  description: string;
  productInfo: {
    sku: string;
    name: string;
    details: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  };
}

export interface Transaction {
  transactionId: string;
  merchantId: string;
  transactionDate: string;
  amount: string;
  paymentMethod: 'QRIS' | 'CASH' | string;
  paymentChannel: string | null;
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded' | string;
  refundStatus: 'None' | 'Partial' | 'Full' | string;
  refundAmount: string;
  chargebackFlag: boolean;
  settlementDate: string | null;
  settlementTime: string | null;
  feeAmount: string | null;
  netAmount: string | null;
  customerId: string | null;
  metadata: TransactionMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionDetail extends Transaction {}

export interface TransactionsResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  status?: 'Success' | 'Pending' | 'Failed' | 'Refunded' | string;
  type?: 'QRIS' | 'CASH' | string;
  startDate?: string;
  endDate?: string;
}

// Update the transactionApi.getTransactions method
// Update the transactionApi response types
export const transactionApi = {
  
  // To this:
  getTransactions: async (params?: TransactionsQueryParams): Promise<{
    success: boolean;
    message?: string;
    data: Transaction[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },
  
  getTransactionDetail: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data;
  },
};



export default api;