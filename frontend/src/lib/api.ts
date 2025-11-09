import axios from 'axios';
import { Category, Product, AuthResponse, LandingContent } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Check both token locations for compatibility
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors - redirect to login or clear token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens from both locations
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      // If we're in the browser and not already on login, we could redirect
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin')) {
        // Only redirect if we're not already on a page that handles auth
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (
    emailOrBody: string | { email: string; password: string },
    passwordOpt?: string
  ): Promise<AuthResponse> => {
    const body =
      typeof emailOrBody === 'string'
        ? { email: emailOrBody, password: passwordOpt as string }
        : emailOrBody;
    const response = await api.post('/auth/login', body);
    return response.data;
  },
  initAdmin: async (): Promise<{ message: string }> => {
    const response = await api.get('/auth/init-admin');
    return response.data;
  },
  register: async (body: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', body);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  getSubCategories: async (parentId: string): Promise<Category[]> => {
    const response = await api.get(`/categories/subcategories/${parentId}`);
    return response.data;
  },
  create: async (category: Partial<Category>): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },
  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// Products API
export const productsApi = {
  getAll: async (
    categoryOrOpts?: string | { category?: string; subCategory?: string; search?: string }
  ): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      if (typeof categoryOrOpts === 'string') {
        if (categoryOrOpts) params.append('category', categoryOrOpts);
      } else if (categoryOrOpts && typeof categoryOrOpts === 'object') {
        if (categoryOrOpts.category) params.append('category', categoryOrOpts.category);
        if (categoryOrOpts.subCategory) params.append('subCategory', categoryOrOpts.subCategory);
        if (categoryOrOpts.search) params.append('search', categoryOrOpts.search);
      }

      const qs = params.toString();
      const url = `/products${qs ? `?${qs}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
      const networkError = error as { code?: string; message?: string };
      if (networkError.code === 'ERR_NETWORK' || networkError.message === 'Network Error') {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        console.error('Network error - check if backend server is running on', apiUrl);
        throw new Error('Unable to connect to server. Please check if the backend server is running.');
      }
      throw error;
    }
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, product);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export default api;

// Landing content API (localStorage-backed for now)
export const landingApi = {
  get: async (): Promise<LandingContent> => {
    const raw = (typeof window !== 'undefined') ? localStorage.getItem('landing_content') : null;
    if (raw) return JSON.parse(raw);
    // default content
    return {
      hero: {
        title: 'Fresh Organic Products',
        subtitle: 'Direct from farm to your doorstep',
        primaryCtaText: '',
        primaryCtaHref: '',
        secondaryCtaText: 'Learn More',
        secondaryCtaHref: '/about',
        backgroundImage: '',
      },
      banners: [],
      featuredCategoryIds: [],
      featuredProductIds: [],
    };
  },
  save: async (content: LandingContent): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('landing_content', JSON.stringify(content));
    }
  },
};