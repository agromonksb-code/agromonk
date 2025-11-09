'use client';

import { useState, useEffect } from 'react';
import { categoriesApi, productsApi, landingApi } from '@/lib/api';
import { Category, Product, LandingContent } from '@/types';
import { 
  Search, 
  Star, 
  ShoppingCart, 
  Leaf, 
  ArrowRight,
  CheckCircle,
  Truck,
  Shield,
  Clock,
  Heart,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/images';
import { useAuthStore } from '@/store/auth-store';
import { ModernNavigation } from '@/components/ui/modern-navigation';
import { ModernFooter } from '@/components/ui/modern-footer';
import { LoadingPage } from '@/components/ui/loading';
import { ProductGrid, CategoryGrid } from '@/components/ui/responsive-grid';

export default function ModernHomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [landing, setLanding] = useState<LandingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated, user, logout } = useAuthStore();

  // Debug useEffect to track state changes
  useEffect(() => {
    // Removed debug logs
  }, [featuredProducts, categories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and products from API
        const [categoriesData, productsData, landingData] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll(),
          landingApi.get()
        ]);
        
        // Filter active categories and products
        const activeCategories = categoriesData.filter(cat => cat.isActive);
        const activeProducts = productsData.filter(prod => prod.isActive);
        
        // Sort by sortOrder
        activeCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        activeProducts.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
        setCategories(activeCategories);
        setFeaturedProducts(activeProducts.slice(0, 8)); // Show first 8 products
        setLanding(landingData);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Set mock data as fallback for testing
        const mockCategories = [
          {
            _id: '1',
            name: 'Fresh Vegetables',
            description: 'Organic vegetables grown naturally',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
            isActive: true,
            sortOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Fresh Fruits',
            description: 'Seasonal fruits from local farms',
            image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
            isActive: true,
            sortOrder: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '3',
            name: 'Organic Grains',
            description: 'Premium quality grains and cereals',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            isActive: true,
            sortOrder: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '4',
            name: 'Fresh Spices',
            description: 'Aromatic spices and herbs',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
            isActive: true,
            sortOrder: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        const mockProducts = [
          {
            _id: '1',
            name: 'Organic Tomatoes',
            description: 'Fresh, juicy organic tomatoes from local farms',
            images: ['https://images.unsplash.com/photo-1546470427-5a0b0b0b0b0b?w=400'],
            price: 80,
            originalPrice: 100,
            stock: 50,
            unit: 'kg',
            subCategory: '1',
            isActive: true,
            sortOrder: 1,
            whatsappMessage: 'Hi! I am interested in Organic Tomatoes. Please provide more details.',
            phoneNumber: '+919799940813',
            tags: ['vegetables', 'organic', 'fresh'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Fresh Mangoes',
            description: 'Sweet, ripe mangoes from our orchards',
            images: ['https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400'],
            price: 120,
            originalPrice: 150,
            stock: 30,
            unit: 'kg',
            subCategory: '2',
            isActive: true,
            sortOrder: 2,
            whatsappMessage: 'Hi! I want to buy Fresh Mangoes. What is the current price?',
            phoneNumber: '+919799940813',
            tags: ['fruits', 'mango', 'sweet'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: '3',
            name: 'Organic Rice',
            description: 'Premium quality organic basmati rice',
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
            price: 200,
            originalPrice: 250,
            stock: 25,
            unit: 'kg',
            subCategory: '3',
            isActive: true,
            sortOrder: 3,
            whatsappMessage: 'Hi! I am interested in Organic Rice. Is it available?',
            phoneNumber: '+919799940813',
            tags: ['grains', 'rice', 'organic'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        
        setCategories(mockCategories);
        setFeaturedProducts(mockProducts);
        setLanding({
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  if (loading) {
    return <LoadingPage title="Loading fresh products..." message="Please wait while we fetch the latest organic products for you." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ModernNavigation onSearch={handleSearch} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-green-800"></div>
        {landing?.hero.backgroundImage && (
          <div className="absolute inset-0">
            <Image 
              src={resolveImageUrl(landing.hero.backgroundImage)} 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-20" 
            />
          </div>
        )}
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative container section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Leaf className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Fresh Organic Products</span>
                </div>
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  {landing?.hero.title || 'Fresh Organic Products'}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-yellow-200">
                    Farm to Doorstep
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-green-100 leading-relaxed">
                  {landing?.hero.subtitle || 'Direct from farm to your doorstep with guaranteed quality and freshness'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {landing?.hero.secondaryCtaText && (
                  <Link 
                    href={landing?.hero.secondaryCtaHref || '#'} 
                    className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-sm sm:text-base lg:text-lg px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 rounded-2xl font-semibold transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto"
                  >
                    {landing.hero.secondaryCtaText}
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-sm text-green-200">Products Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-green-200">Support</div>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative animate-scale-in">
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                {landing?.hero.backgroundImage ? (
                  <Image 
                    src={resolveImageUrl(landing.hero.backgroundImage)} 
                    alt="Fresh Organic Products" 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Leaf className="h-32 w-32 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-large animate-bounce-gentle">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Certified Organic</div>
                    <div className="text-sm text-gray-600">100% Natural</div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">AGROMONK</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to providing fresh organic agricultural products with farm-to-doorstep delivery 
              for maximum freshness and quality assurance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fresh Daily Delivery</h3>
              <p className="text-gray-600">Farm-fresh organic products delivered directly to your doorstep with guaranteed freshness.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Organic</h3>
              <p className="text-gray-600">Certified organic products with no harmful chemicals or pesticides.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
              <p className="text-gray-600">24/7 customer support and expert guidance for all your organic product needs.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Care</h3>
              <p className="text-gray-600">Dedicated customer service ensuring your satisfaction with every order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete range of professional agricultural equipment for every farming operation from tillage to post-harvest.
            </p>
          </div>

          <CategoryGrid>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/category/${category._id}`}
                  className="group card-hover p-6 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {category.image ? (
                      <Image
                        src={resolveImageUrl(category.image)}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Leaf className="h-8 w-8 text-green-600" />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Available</h3>
                <p className="text-gray-600">Categories will appear here once they are added to the system.</p>
              </div>
            )}
          </CategoryGrid>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured <span className="text-gradient">Equipment</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional agricultural equipment trusted by farmers across the region for maximum productivity.
            </p>
          </div>


          <ProductGrid>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="group card-hover overflow-hidden"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Link href={`/products/${product._id}`}>
                        <Image
                          src={resolveImageUrl(product.images[0])}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Leaf className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Link href={`/products/${product._id}`}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
                <p className="text-gray-600">Products will appear here once they are added to the system.</p>
              </div>
            )}
          </ProductGrid>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary text-sm sm:text-base lg:text-lg px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 rounded-2xl group inline-flex items-center justify-center w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container relative text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Experience Fresh Organic Products?
          </h2>
          <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust AgroMonk for their daily organic needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-sm sm:text-base lg:text-lg px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 rounded-2xl font-semibold transition-all duration-300 inline-flex items-center justify-center w-full sm:w-auto">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}