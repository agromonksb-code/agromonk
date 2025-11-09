'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product } from '@/types';
import { Leaf, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/images';
import { useAuthStore } from '@/store/auth-store';
import { ModernNavigation } from '@/components/ui/modern-navigation';
import { ModernFooter } from '@/components/ui/modern-footer';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch category and sub-categories separately to handle errors gracefully
        let categoryData: Category | null = null;
        let subCategoriesData: Category[] = [];
        
        try {
          categoryData = await categoriesApi.getById(categoryId);
        } catch (error: unknown) {
          console.error('Error fetching category:', error);
          // If category not found, check if it might be a sub-category
          // Try to get all categories and check if this ID is a sub-category
          try {
            const allCategories = await categoriesApi.getAll();
            const foundSubCategory = allCategories.find(cat => cat._id === categoryId);
            if (foundSubCategory && foundSubCategory.parentCategory) {
              // This is a sub-category, redirect to its parent category
              const parentId = typeof foundSubCategory.parentCategory === 'object' 
                ? foundSubCategory.parentCategory._id 
                : foundSubCategory.parentCategory;
              if (parentId) {
                window.location.href = `/category/${parentId}`;
                return;
              }
            }
          } catch (e) {
            console.error('Error checking for sub-category:', e);
          }
          // Continue even if category fetch fails - try to get sub-categories anyway
        }
        
        try {
          subCategoriesData = await categoriesApi.getSubCategories(categoryId);
        } catch (error: unknown) {
          console.error('Error fetching sub-categories:', error);
          // Continue even if sub-categories fetch fails
        }
        
        setCategory(categoryData);
        setSubCategories(subCategoriesData);
        
        // Only fetch products if there are no sub-categories
        if (subCategoriesData.length === 0) {
          try {
            const productsData = await productsApi.getAll({ category: categoryId });
            setProducts(productsData);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSubCategory) {
        try {
          const productsData = await productsApi.getAll({ subCategory: selectedSubCategory });
          setProducts(productsData || []);
        } catch (error: unknown) {
          console.error('Error fetching products for sub-category:', error);
          setProducts([]);
          const apiError = error as { message?: string };
          if (apiError.message && apiError.message.includes('Unable to connect')) {
            alert('Unable to connect to server. Please check if the backend server is running.');
          }
        }
      } else if (categoryId && subCategories.length === 0) {
        // Only fetch products if no sub-categories exist
        try {
          const productsData = await productsApi.getAll({ category: categoryId });
          setProducts(productsData || []);
        } catch (error: unknown) {
          console.error('Error fetching products for category:', error);
          setProducts([]);
          const apiError = error as { message?: string };
          if (apiError.message && apiError.message.includes('Unable to connect')) {
            alert('Unable to connect to server. Please check if the backend server is running.');
          }
        }
      } else {
        // Reset products when no sub-category is selected and sub-categories exist
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedSubCategory, categoryId, subCategories.length]);


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show error only if no category and no sub-categories
  if (!category && subCategories.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ModernNavigation onSearch={handleSearch} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <p className="text-gray-600 mb-4">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="text-green-600 hover:text-green-700 underline">
            Go back to home
          </Link>
        </div>
        <ModernFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavigation onSearch={handleSearch} />

      {/* Breadcrumb Navigation */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            {category && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {selectedSubCategory ? (
                  <Link 
                    href={`/category/${category._id}`}
                    onClick={() => setSelectedSubCategory('')}
                    className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
                  >
                    {category.name}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {category.name}
                  </span>
                )}
              </>
            )}
            {selectedSubCategory && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">
                  {subCategories.find(sc => sc._id === selectedSubCategory)?.name || 'Sub-Category'}
                </span>
              </>
            )}
            {!category && subCategories.length > 0 && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">Sub-Categories</span>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* Sub-Categories Section - Show first if sub-categories exist */}
      {!selectedSubCategory && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {subCategories.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {subCategories.map((subCat) => (
                    <button
                      key={subCat._id}
                      onClick={() => setSelectedSubCategory(subCat._id)}
                      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden text-left p-6 border-2 border-transparent hover:border-green-500"
                    >
                      <div className="relative h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {subCat.image ? (
                          <Image
                            src={resolveImageUrl(subCat.image)}
                            alt={subCat.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Leaf className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {subCat.name}
                      </h4>
                      {subCat.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {subCat.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sub-Categories</h3>
                <p className="text-gray-600 mb-4">
                  This category doesn&apos;t have any sub-categories yet.
                </p>
                <p className="text-sm text-gray-500">
                  Products will be shown directly below.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
      


      {/* Products Grid - Show when sub-category is selected or no sub-categories exist */}
      {(selectedSubCategory || subCategories.length === 0) && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
              </h3>
            </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No products found</h4>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search terms' : 'No products available in this category'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <Link href={`/products/${product._id}`}>
                      <Image
                        src={resolveImageUrl(product.images[0])}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                  ) : (
                      <div className="flex items-center justify-center h-full">
                        <Leaf className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product._id}`}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      <ModernFooter />
    </div>
  );
}
