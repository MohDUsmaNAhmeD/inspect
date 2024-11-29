// API Configuration
export const API_BASE_URL = 'http://localhost:3000';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/admin/login`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/api/admin/orders`,
  UPDATE_ORDER: (id: string) => `${API_BASE_URL}/api/admin/orders/${id}`,
  
  // Settings
  PRICES: `${API_BASE_URL}/api/admin/settings/prices`,
  EMAIL: `${API_BASE_URL}/api/admin/settings/email`,
  PAYPAL: `${API_BASE_URL}/api/admin/settings/paypal`,
} as const;

// API Headers with credentials
export const getAuthHeaders = (token: string | null) => ({
  'Content-Type': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
  'Accept': 'application/json',
});

// Enhanced fetch with timeout and credentials
export const fetchWithCredentials = async (
  url: string,
  options: RequestInit = {}
) => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(localStorage.getItem('adminToken')),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        throw new Error('Unauthorized access. Please login again.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'An error occurred',
        response.status,
        errorData.code
      );
    }

    return response;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
};

// Error Handling
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface OrdersResponse extends APIResponse {
  orders: Array<{
    id: string;
    customerName: string;
    customerPhone: string;
    vinNumber: string;
    amount: number;
    items: Array<{
      title: string;
      price: number;
    }>;
    createdAt: string;
    status: 'pending' | 'completed' | 'cancelled';
  }>;
  totalPages: number;
}

export interface SettingsResponse extends APIResponse {
  prices: {
    basicReport: number;
    fullReport: number;
    premiumReport: number;
    motorcycleReport: number;
    truckReport: number;
  };
  email: {
    adminEmail: string;
    emailSignature: string;
    notificationEnabled: boolean;
  };
  paypal?: {
    enabled: boolean;
  };
}

// Helper function to handle API responses
export async function handleAPIResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      throw new APIError('Session expired. Please login again.', 401);
    }
    
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred'
    }));
    
    throw new APIError(
      error.message || `HTTP error! status: ${response.status}`,
      response.status,
      error.code
    );
  }
  
  try {
    const data = await response.json();
    if (!data.success) {
      throw new APIError(data.error?.message || 'Operation failed', response.status, data.error?.code);
    }
    return data as T;
  } catch (err) {
    throw new APIError('Failed to parse response', response.status);
  }
}
