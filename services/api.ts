const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Types ───────────────────────────────────────────────────────────

export interface SellerRegistrationData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SellerProfile {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  gstNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'seller' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
  label: string;
}

export interface Ingredient {
  name: string;
  benefit?: string;
}

export interface Product {
  _id: string;
  handle: string;
  title: string;
  subtitle: string;
  benefit: string;
  price: number;
  mrpPerUnit: number;
  imageUrl: string;
  category: 'shampoo' | 'conditioner' | 'oil' | 'serum' | 'kit';
  tags: string[];
  description: string;
  howToUse: string[];
  ingredients: { name: string; benefit: string }[];
  faqs: { q: string; a: string }[];
  moq: number;
  isB2BOnly: boolean;
  bulkPricing: BulkPricingTier[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  status?: string;
}

// ─── Token Management ────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem('seller_token');

export const setToken = (token: string): void => localStorage.setItem('seller_token', token);

export const removeToken = (): void => localStorage.removeItem('seller_token');

export const getStoredRole = (): string | null => localStorage.getItem('seller_role');

export const setStoredRole = (role: string): void => localStorage.setItem('seller_role', role);

export const removeStoredRole = (): void => localStorage.removeItem('seller_role');

export const isAuthenticated = (): boolean => !!getToken();

export const logout = (): void => {
  removeToken();
  removeStoredRole();
};

// ─── HTTP Helper ─────────────────────────────────────────────────────

const cleanBody = (data: any) => {
  if (typeof data !== 'object' || data === null) return data;
  const clean = { ...data };
  delete clean._id;
  delete clean.__v;
  delete clean.createdAt;
  delete clean.updatedAt;
  return clean;
};

const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();

  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'Something went wrong',
        status: response.status,
        data,
      };
    }

    return data;
  } catch (error: any) {
    if (error.message && error.status) {
      throw error; // Re-throw API errors
    }
    throw {
      message: 'Network error. Please check your connection and try again.',
      status: 0,
    };
  }
};

// ─── Seller API ──────────────────────────────────────────────────────

export const registerSeller = (data: SellerRegistrationData) =>
  apiRequest('/api/seller/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const loginSeller = (credentials: LoginCredentials) =>
  apiRequest<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    token: string;
  }>('/api/seller/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const getSellerProfile = () =>
  apiRequest<SellerProfile>('/api/seller/me');

// ─── Admin API ───────────────────────────────────────────────────────

export const getAllSellers = (status?: string, search?: string) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<SellerProfile[]>(`/api/admin/sellers${query}`);
};

export const getSellerByIdAdmin = (id: string) =>
  apiRequest<SellerProfile>(`/api/admin/sellers/${id}`);

export const approveSeller = (id: string) =>
  apiRequest<SellerProfile>(`/api/admin/approve/${id}`, {
    method: 'PUT',
  });

export const rejectSeller = (id: string) =>
  apiRequest<SellerProfile>(`/api/admin/reject/${id}`, {
    method: 'PUT',
  });

// ─── Order API ───────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface PlacedOrder {
  _id: string;
  seller: string;
  items: {
    productId: string;
    handle: string;
    title: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  totalUnits: number;
  status: OrderStatus;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface AdminOrder extends Omit<PlacedOrder, 'seller' | 'status'> {
  seller: {
    _id: string;
    name: string;
    email: string;
    businessName: string;
  };
  status: OrderStatus;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const placeOrder = (items: OrderItem[], shippingAddress: ShippingAddress, notes?: string) =>
  apiRequest<{
    order: PlacedOrder;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ items, shippingAddress, notes: notes || '' }),
  });

export const verifyPayment = (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) =>
  apiRequest<PlacedOrder>('/api/orders/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getOrders = (status?: string) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<PlacedOrder[]>(`/api/orders${query}`);
};

export const getOrderById = (id: string) =>
  apiRequest<PlacedOrder>(`/api/orders/${id}`);

export const getAllOrdersAdmin = (status?: OrderStatus | 'all', search?: string) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<AdminOrder[]>(`/api/orders/admin/all${query}`);
};

export const updateOrderStatusAdmin = (orderId: string, status: OrderStatus) =>
  apiRequest<AdminOrder>(`/api/orders/admin/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

// ─── Product API ─────────────────────────────────────────────────────

export const getProducts = (category?: string, search?: string) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<Product[]>(`/api/products${query}`);
};

export const getProductByHandle = (handle: string) =>
  apiRequest<Product>(`/api/products/${handle}`);

export const getAllProductsAdmin = () =>
  apiRequest<Product[]>('/api/products/admin/all');

export const uploadImageAdmin = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  return apiRequest<{ url: string; filename: string }>('/api/products/upload', {
    method: 'POST',
    body: formData,
  });
};

export const createProductAdmin = (data: Partial<Product>) =>
  apiRequest<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(cleanBody(data)),
  });

export const updateProductAdmin = (id: string, data: Partial<Product>) =>
  apiRequest<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cleanBody(data)),
  });

export const deleteProductAdmin = (id: string) =>
  apiRequest<Product>(`/api/products/${id}`, {
    method: 'DELETE',
  });

export const bulkUpdatePriceAdmin = (data: { type: 'percentage' | 'fixed'; value: number; action: 'increase' | 'decrease' }) =>
  apiRequest('/api/products/admin/bulk-price', {
    method: 'POST',
    body: JSON.stringify(data),
  });
