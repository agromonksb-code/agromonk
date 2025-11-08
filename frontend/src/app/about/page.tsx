'use client';

import { ModernNavigation } from '@/components/ui/modern-navigation';
import { ModernFooter } from '@/components/ui/modern-footer';
import { 
  Leaf, 
  Users, 
  Target, 
  Award, 
  Heart,
  Truck,
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const stats = [
    { number: '5K+', label: 'Farmers Served', icon: Users },
    { number: '1000+', label: 'Products', icon: Leaf },
    { number: '50+', label: 'Distributors', icon: Target },
    { number: '95%', label: 'Success Rate', icon: Award },
  ];

  const values = [
    {
      icon: Leaf,
      title: 'Professional Equipment',
      description: 'We provide heavy-duty, professional-grade agricultural machinery from leading manufacturers for maximum farming efficiency.'
    },
    {
      icon: Heart,
      title: 'Technical Support',
      description: 'Our technical experts provide 24/7 support, maintenance, and training for all agricultural equipment.'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every equipment undergoes rigorous quality checks and testing to meet ISO standards and international specifications.'
    },
    {
      icon: Truck,
      title: 'Complete Solutions',
      description: 'We offer end-to-end farm mechanization solutions from tillage to post-harvest operations.'
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <ModernNavigation onSearch={handleSearch} />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-primary-600">AGROMONK</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We are passionate about providing fresh organic agricultural products directly from farm to your doorstep. 
                Our mission is to revolutionize the way people access healthy, organic food through our comprehensive 
                farm-to-doorstep delivery service and commitment to quality and freshness.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Fresh Organic Products</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Farm to Doorstep</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Quality Guaranteed</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800"
                  alt="Organic Farm"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-500 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                  <stat.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              AgroVision was founded with a vision to revolutionize agriculture through 
              complete farm mechanization and professional-grade equipment. What started as a small 
              agricultural machinery company has grown into a trusted partner for thousands of farmers 
              across the region, helping them achieve maximum productivity through modern farming equipment.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We work directly with leading agricultural equipment manufacturers and research institutions, 
              ensuring farmers have access to the latest and most efficient farming machinery. 
              Our commitment to agricultural excellence extends beyond just selling equipment – 
              we're building a community that values innovation, efficiency, and complete farm mechanization.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to you
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-600">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Join Our Organic Journey
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Experience the difference that fresh, organic products can make in your life. 
              Start your healthy journey with us today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
