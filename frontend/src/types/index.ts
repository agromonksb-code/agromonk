export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parentCategory?: string | Category | null;
  subCategories?: Category[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  subCategory: string | Category;
  isActive: boolean;
  stock: number;
  unit: string;
  sortOrder: number;
  whatsappMessage?: string;
  phoneNumber?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LandingContent {
  hero: {
    title: string;
    subtitle?: string;
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    backgroundImage?: string;
  };
  banners: { image: string; href?: string }[];
  featuredCategoryIds: string[];
  featuredProductIds: string[];
}