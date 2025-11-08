'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { resolveImageUrl } from '@/lib/images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, ArrowLeft, Search, Leaf, ChevronRight, Home } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { ModernNavigation } from '@/components/ui/modern-navigation';
import { ModernFooter } from '@/components/ui/modern-footer';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    (async () => {
      try {
        const data = await productsApi.getById(id);
        setProduct(data);
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          const firstImage = data.images[0];
          if (firstImage) {
            setActiveImage(firstImage);
          } else {
            setActiveImage(null);
          }
        } else {
          setActiveImage(null);
        }
      } catch (e) {
        console.error('Failed to fetch product', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  const handleWhatsApp = () => {
    if (!product) return;
    const message = product.whatsappMessage || `Hi! I'm interested in ${product.name}. Please provide more details.`;
    const phone = product.phoneNumber || '+919876543210';
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (!product) return;
    const phone = product.phoneNumber || '+919876543210';
    window.open(`tel:${phone}`, '_self');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>Product not found.</p>
          <Button onClick={() => router.push('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

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
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link 
              href="/products"
              className="text-gray-500 hover:text-gray-900 transition-colors hover:underline"
            >
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div>
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 && activeImage ? (
                    <img 
                      src={resolveImageUrl(activeImage)} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                          fallback.innerHTML = '<svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Leaf className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {product.images && product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto md:grid md:grid-cols-4 md:gap-3">
                {product.images.map((img, idx) => {
                  const imageUrl = resolveImageUrl(img);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative flex-shrink-0 w-20 h-20 md:w-auto md:h-auto aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${product.name} - Image ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                            fallback.innerHTML = '<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">{product.name}</h1>
              {product.description && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleWhatsApp}
                className="flex-1 bg-green-600 text-white hover:bg-green-700 border-green-600"
              >
                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleCall}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" /> Call
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ModernFooter />
    </div>
  );
}


