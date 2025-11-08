'use client';

import { useState, useEffect } from 'react';
import { categoriesApi, productsApi, authApi, landingApi } from '@/lib/api';
import { Category, Product, User, LandingContent } from '@/types';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, LogOut, Leaf } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { resolveImageUrl } from '@/lib/images';

export default function AdminPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories' | 'products' | 'landing'>('categories');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [landing, setLanding] = useState<LandingContent | null>(null);
  const [selectedCategoryForProduct, setSelectedCategoryForProduct] = useState<string>('');

  useEffect(() => {
    // Check both token locations
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    // Sync token to both locations if only one exists
    if (localStorage.getItem('auth_token') && !localStorage.getItem('token')) {
      localStorage.setItem('token', localStorage.getItem('auth_token')!);
    }
    if (localStorage.getItem('token') && !localStorage.getItem('auth_token')) {
      localStorage.setItem('auth_token', localStorage.getItem('token')!);
    }
    
    // Do not set dummy user; rely on authenticated admin role
    const fetchData = async () => {
      try {
        const currentToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
        // Fetch all categories (including sub-categories) for admin
        const allCategoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/categories/admin`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        });
        const categoriesData = await allCategoriesResponse.json();
        
        const [productsData, landingData] = await Promise.all([
          productsApi.getAll(),
          landingApi.get(),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
        setLanding(landingData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If API call fails, user might not be authenticated
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminUser]); // Re-run when local admin state changes

  // Effect to ensure dropdowns are properly set when editing
  useEffect(() => {
    if (editingItem && showForm) {
      // For sub-categories, ensure parentCategory is set correctly
      if (activeTab === 'subcategories' && editingItem.parentCategory) {
        const parentId = typeof editingItem.parentCategory === 'object' && editingItem.parentCategory
          ? editingItem.parentCategory._id 
          : editingItem.parentCategory;
        setFormData(prev => {
          if (prev.parentCategory !== parentId) {
            return {
              ...prev,
              parentCategory: parentId || null,
            };
          }
          return prev;
        });
      }
      
      // For products, ensure category and subCategory are set correctly
      if (activeTab === 'products' && editingItem.subCategory) {
        const subCategoryId = typeof editingItem.subCategory === 'object' && editingItem.subCategory
          ? editingItem.subCategory._id 
          : editingItem.subCategory;
        
        if (subCategoryId) {
          // Find the sub-category to get its parent
          const subCat = categories.find(c => c._id === subCategoryId);
          if (subCat && subCat.parentCategory) {
            const parentId = typeof subCat.parentCategory === 'object' && subCat.parentCategory
              ? subCat.parentCategory._id 
              : subCat.parentCategory;
            setSelectedCategoryForProduct(parentId || '');
          }
          
          // Ensure subCategory is set in formData
          setFormData(prev => {
            if (prev.subCategory !== subCategoryId) {
              return {
                ...prev,
                subCategory: subCategoryId || '',
              };
            }
            return prev;
          });
        }
      }
    }
  }, [editingItem, showForm, activeTab, categories]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login(formData.email, formData.password);
      // Store token in both places for compatibility
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('token', response.access_token);
      // Update auth store
      const { setAuth } = useAuthStore.getState();
      setAuth(response.user, response.access_token);
      setAdminUser(response.user);
      // Clear form data
      setFormData({});
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    const { logout } = useAuthStore.getState();
    logout();
    setAdminUser(null);
    setCategories([]);
    setProducts([]);
  };

  // Helper function to remove MongoDB-specific fields
  const cleanFormData = (data: any) => {
    const { _id, createdAt, updatedAt, __v, ...cleaned } = data;
    return cleaned;
  };

  const handleSave = async () => {
    try {
      if (activeTab === 'categories' || activeTab === 'subcategories') {
        if (editingItem) {
          const cleanedData = cleanFormData(formData);
          await categoriesApi.update(editingItem._id, cleanedData);
          setCategories(categories.map(cat => cat._id === editingItem._id ? { ...cat, ...cleanedData } : cat));
        } else {
          const cleanedData = cleanFormData(formData);
          const newCategory = await categoriesApi.create(cleanedData);
          setCategories([...categories, newCategory]);
        }
      } else if (activeTab === 'products') {
        if (editingItem) {
          const cleanedData = cleanFormData(formData);
          await productsApi.update(editingItem._id, cleanedData);
          setProducts(products.map(prod => prod._id === editingItem._id ? { ...prod, ...cleanedData } : prod));
        } else {
          const cleanedData = cleanFormData(formData);
          const newProduct = await productsApi.create(cleanedData);
          setProducts([...products, newProduct]);
        }
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      setSelectedCategoryForProduct('');
    } catch (error: any) {
      console.error('Error saving:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        alert(`Error saving item: ${error.response?.data?.message || error.message || 'Please try again.'}`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (activeTab === 'categories' || activeTab === 'subcategories') {
        await categoriesApi.delete(id);
        setCategories(categories.filter(cat => cat._id !== id));
      } else if (activeTab === 'products') {
        await productsApi.delete(id);
        setProducts(products.filter(prod => prod._id !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const handleEdit = async (item: any) => {
    setEditingItem(item);
    
    // If editing a sub-category, ensure parentCategory is properly set
    if (activeTab === 'subcategories' && item.parentCategory) {
      const parentId = typeof item.parentCategory === 'object' && item.parentCategory
        ? item.parentCategory._id 
        : item.parentCategory;
      setFormData({
        ...item,
        parentCategory: parentId || null,
      });
    } else {
      setFormData(item);
    }
    
    // If editing a product, set the category based on sub-category's parent
    if (activeTab === 'products' && item.subCategory) {
      let subCat = typeof item.subCategory === 'object' 
        ? item.subCategory 
        : categories.find(c => c._id === item.subCategory);
      
      // If subCategory is just an ID and not found in categories, fetch it
      if (!subCat && typeof item.subCategory === 'string') {
        try {
          subCat = await categoriesApi.getById(item.subCategory);
        } catch (error) {
          console.error('Error fetching sub-category:', error);
        }
      }
      
      if (subCat && subCat.parentCategory) {
        const parentId = typeof subCat.parentCategory === 'object' && subCat.parentCategory
          ? subCat.parentCategory._id 
          : subCat.parentCategory;
        setSelectedCategoryForProduct(parentId || '');
      } else {
        setSelectedCategoryForProduct('');
      }
      
      // Ensure subCategory is set in formData as a string ID
      const subCategoryId = typeof item.subCategory === 'object' && item.subCategory
        ? item.subCategory._id 
        : item.subCategory;
      setFormData({
        ...item,
        subCategory: subCategoryId || '',
      });
    } else {
      setSelectedCategoryForProduct('');
    }
    
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData(activeTab === 'categories' || activeTab === 'subcategories' ? {
      name: '',
      description: '',
      image: '',
      parentCategory: null,
      isActive: true,
      sortOrder: 0
    } : {
      name: '',
      description: '',
      images: [],
      price: 0,
      originalPrice: 0,
      subCategory: '',
      isActive: true,
      stock: 0,
      unit: 'kg',
      sortOrder: 0,
      whatsappMessage: '',
      phoneNumber: '+919876543210',
      tags: []
    });
    setSelectedCategoryForProduct('');
    setShowForm(true);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-green-600 hover:text-green-700 text-sm">
              Go back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">AgroMonk Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'categories'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Categories ({categories.filter(cat => !cat.parentCategory || (typeof cat.parentCategory === 'string' && !cat.parentCategory)).length})
          </button>
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subcategories'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sub-Categories ({categories.filter(cat => cat.parentCategory).length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'landing'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Landing
          </button>
        </div>

        {/* Add New Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Manage {activeTab === 'categories' ? 'Categories' : activeTab === 'subcategories' ? 'Sub-Categories' : activeTab === 'products' ? 'Products' : 'Landing'}
          </h2>
          {activeTab === 'categories' ? (
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          ) : activeTab === 'subcategories' ? (
            <button
              onClick={() => {
                const mainCategories = categories.filter(cat => !cat.parentCategory || (typeof cat.parentCategory === 'string' && !cat.parentCategory));
                if (mainCategories.length === 0) {
                  alert('Please create a main category first before adding sub-categories.');
                  return;
                }
                setEditingItem(null);
                setFormData({
                  name: '',
                  description: '',
                  image: '',
                  parentCategory: mainCategories[0]?._id || null,
                  isActive: true,
                  sortOrder: 0
                });
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Sub-Category</span>
            </button>
          ) : activeTab === 'products' ? (
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          ) : null}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab !== 'landing' ? (
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'categories' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </>
                  ) : activeTab === 'subcategories' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub-Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeTab === 'categories' ? (
                  // Main Categories Only
                  categories
                    .filter(cat => !cat.parentCategory || (typeof cat.parentCategory === 'string' && !cat.parentCategory))
                    .map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {item.image ? (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={resolveImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Leaf className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : activeTab === 'subcategories' ? (
                  // Sub-Categories Only
                  categories
                    .filter(cat => cat.parentCategory)
                    .map((item) => {
                      const parentId = typeof item.parentCategory === 'object' && item.parentCategory
                        ? item.parentCategory._id 
                        : item.parentCategory;
                      const parent = parentId ? categories.find(c => c._id === parentId) : null;
                      const parentName = typeof item.parentCategory === 'object' && item.parentCategory
                        ? item.parentCategory.name 
                        : parent?.name || 'Unknown';
                      
                      return (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              {item.image ? (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={resolveImageUrl(item.image)}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Leaf className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {parentName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {item.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  // Products
                  products.map((item) => {
                    const subCat = typeof (item as Product).subCategory === 'object' 
                      ? (item as Product).subCategory 
                      : categories.find(c => c._id === (item as Product).subCategory);
                    const subCatName = subCat?.name || 'N/A';
                    
                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {(item as Product).images && (item as Product).images.length > 0 ? (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={resolveImageUrl((item as Product).images[0])}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Leaf className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {subCatName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{(item as Product).price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(item as Product).stock} {(item as Product).unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              </table>
            ) : (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hero</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.title || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev)}
                    />
                    <input
                      type="text"
                      placeholder="Subtitle"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.subtitle || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, subtitle: e.target.value } } : prev)}
                    />
                    <input
                      type="text"
                      placeholder="Primary CTA Text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.primaryCtaText || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, primaryCtaText: e.target.value } } : prev)}
                    />
                    <input
                      type="text"
                      placeholder="Primary CTA Href"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.primaryCtaHref || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, primaryCtaHref: e.target.value } } : prev)}
                    />
                    <input
                      type="text"
                      placeholder="Secondary CTA Text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.secondaryCtaText || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, secondaryCtaText: e.target.value } } : prev)}
                    />
                    <input
                      type="text"
                      placeholder="Secondary CTA Href"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.secondaryCtaHref || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, secondaryCtaHref: e.target.value } } : prev)}
                    />
                    <input
                      type="text"
                      placeholder="Background image URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={landing?.hero.backgroundImage || ''}
                      onChange={(e) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, backgroundImage: e.target.value } } : prev)}
                    />
                    <div className="md:col-span-2">
                      <ImageUpload
                        images={landing?.hero.backgroundImage ? [landing.hero.backgroundImage] : []}
                        onImagesChange={(images) => setLanding(prev => prev ? { ...prev, hero: { ...prev.hero, backgroundImage: images[0] || '' } } : prev)}
                        maxImages={1}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Banners</h3>
                  <div className="space-y-3">
                    {(landing?.banners || []).map((b, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Image URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={b.image}
                            onChange={(e) => setLanding(prev => prev ? { ...prev, banners: prev.banners.map((x, idx) => idx === i ? { ...x, image: e.target.value } : x) } : prev)}
                          />
                          <ImageUpload
                            images={b.image ? [b.image] : []}
                            onImagesChange={(images) => setLanding(prev => prev ? { ...prev, banners: prev.banners.map((x, idx) => idx === i ? { ...x, image: images[0] || '' } : x) } : prev)}
                            maxImages={1}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Href"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          value={b.href || ''}
                          onChange={(e) => setLanding(prev => prev ? { ...prev, banners: prev.banners.map((x, idx) => idx === i ? { ...x, href: e.target.value } : x) } : prev)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setLanding(prev => prev ? { ...prev, banners: prev.banners.filter((_, idx) => idx !== i) } : prev)}
                            className="px-3 py-2 bg-red-50 text-red-700 rounded"
                          >Remove</button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setLanding(prev => prev ? { ...prev, banners: [...prev.banners, { image: '', href: '' }] } : prev)}
                      className="px-3 py-2 bg-gray-100 rounded"
                    >Add Banner</button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={async () => { if (landing) await landingApi.save(landing); alert('Landing content saved'); }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >Save</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Edit' : 'Add New'} {
                    activeTab === 'categories' ? 'Category' : 
                    activeTab === 'subcategories' ? 'Sub-Category' : 
                    activeTab === 'products' ? 'Product' : 
                    'Item'
                  }
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedCategoryForProduct('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                  {activeTab === 'categories' || activeTab === 'subcategories' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      {activeTab === 'subcategories' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Category *
                          </label>
                          <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.parentCategory || ''}
                            onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value || null })}
                          >
                            <option value="">Select Parent Category</option>
                            {categories.filter(cat => !cat.parentCategory || (typeof cat.parentCategory === 'string' && !cat.parentCategory)).map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                          {formData.parentCategory && (
                            <p className="mt-1 text-sm text-blue-600">
                              ✓ Creating a Sub-Category under "{categories.find(c => c._id === formData.parentCategory)?.name || 'Selected Category'}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Category (leave empty for main category)
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.parentCategory || ''}
                            onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value || null })}
                          >
                            <option value="">Main Category (No Parent)</option>
                            {categories.filter(cat => !cat.parentCategory || (typeof cat.parentCategory === 'string' && !cat.parentCategory)).map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                          <p className="mt-1 text-sm text-gray-500">
                            Leave empty to create a Main Category
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <ImageUpload
                          images={formData.image ? [formData.image] : []}
                          onImagesChange={(images) => setFormData({ ...formData, image: images[0] || '' })}
                          maxImages={1}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            checked={formData.isActive || false}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={selectedCategoryForProduct || ''}
                            onChange={(e) => {
                              setSelectedCategoryForProduct(e.target.value);
                              setFormData({ ...formData, subCategory: '' }); // Reset sub-category when category changes
                            }}
                          >
                            <option value="">Select Category</option>
                            {categories.filter(cat => !cat.parentCategory || (typeof cat.parentCategory === 'string' && !cat.parentCategory)).map(cat => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub-Category *
                        </label>
                        <select
                          required
                          disabled={!selectedCategoryForProduct}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={formData.subCategory || ''}
                          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        >
                          <option value="">
                            {selectedCategoryForProduct ? 'Select Sub-Category' : 'Select Category first'}
                          </option>
                          {selectedCategoryForProduct && categories
                            .filter(cat => {
                              if (!cat.parentCategory) return false;
                              const parentId = typeof cat.parentCategory === 'object' 
                                ? cat.parentCategory._id 
                                : cat.parentCategory;
                              return parentId === selectedCategoryForProduct;
                            })
                            .map(cat => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                        </select>
                        {!selectedCategoryForProduct && (
                          <p className="mt-1 text-sm text-gray-500">
                            Please select a category first to see available sub-categories
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={3}
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <ImageUpload
                          images={formData.images || []}
                          onImagesChange={(images) => setFormData({ ...formData, images })}
                          maxImages={5}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                          </label>
                          <input
                            type="number"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Original Price
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.originalPrice || ''}
                            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.stock || ''}
                            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.unit || ''}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.phoneNumber || ''}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Message
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={2}
                          value={formData.whatsappMessage || ''}
                          onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            checked={formData.isActive || false}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedCategoryForProduct('');
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
