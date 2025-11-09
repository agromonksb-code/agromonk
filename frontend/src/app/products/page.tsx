'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Category, Product } from '@/types';
import { productsApi, categoriesApi } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Star, Search, Leaf } from 'lucide-react';
import { resolveImageUrl } from '@/lib/images';
import { ModernNavigation } from '@/components/ui/modern-navigation';
import { ModernFooter } from '@/components/ui/modern-footer';
import Link from 'next/link';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();

  // Initialize category from URL if present and fetch categories
  useEffect(() => {
    const init = async () => {
      try {
        const [cats] = await Promise.all([
          categoriesApi.getAll(),
        ]);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    const urlCategory = searchParams.get('category');
    if (urlCategory) setSelectedCategory(urlCategory);
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch sub-categories when category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory) {
        try {
          const subCats = await categoriesApi.getSubCategories(selectedCategory);
          setSubCategories(subCats);
          setSelectedSubCategory(''); // Reset sub-category when category changes
        } catch (err) {
          console.error('Failed to load sub-categories', err);
          setSubCategories([]);
        }
      } else {
        setSubCategories([]);
        setSelectedSubCategory('');
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ...(searchQuery ? { search: searchQuery } : {}),
          ...(selectedSubCategory ? { subCategory: selectedSubCategory } : {}),
          ...(selectedCategory && !selectedSubCategory ? { category: selectedCategory } : {}),
        };
        const data = await productsApi.getAll(params);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };


  const { isAuthenticated, user, logout } = useAuthStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {subCategories.length > 0 && (
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">All Sub-Categories</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Results count */}
          <p className="text-muted-foreground mb-6">
            {loading ? 'Loading...' : `${products.length} ${products.length !== 1 ? 'products' : 'product'} found`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setSelectedSubCategory('');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="group hover:shadow-lg transition-shadow rounded-lg overflow-hidden bg-white">
                <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                  {product.images && product.images.length > 0 ? (
                    <Link href={`/products/${product._id}`}>
                      <img
                        src={resolveImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default function ProductsPage() {
  const handleSearch = (query: string) => {
    // Search is handled inside ProductsContent
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavigation onSearch={handleSearch} />
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
      <ModernFooter />
    </div>
  );
}
