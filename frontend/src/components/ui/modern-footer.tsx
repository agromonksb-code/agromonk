import Link from 'next/link';
import Image from 'next/image';
import { 
  Leaf, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  Shield,
  Truck,
  Clock
} from 'lucide-react';

export function ModernFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/agromonklogo.png?v=2"
                alt="AGROMONK Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
              Our Product Portfolio - Complete range of professional agricultural equipment for every farming operation from tillage to post-harvest.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://facebook.com/agromonk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors group">
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://twitter.com/agromonk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors group">
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://instagram.com/agromonk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors group">
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://youtube.com/agromonk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors group">
                <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 text-white">Quick Links</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 text-white">Customer Service</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6 text-white">Contact Info</h4>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-300 text-xs lg:text-sm leading-relaxed">
                    123 Agricultural Hub<br />
                    Farm District<br />
                    Jaipur 302001, Rajasthan, India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <a href="tel:+919799940813" className="text-gray-300 text-xs lg:text-sm hover:text-primary-400 transition-colors">+91 9799940813</a>
                  <p className="text-gray-400 text-xs">Mon-Sat 9AM-8PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <a href="mailto:info@agromonk.com" className="text-gray-300 text-xs lg:text-sm hover:text-primary-400 transition-colors">info@agromonk.com</a>
                  <p className="text-gray-400 text-xs">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-gray-700">
        <div className="container px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Truck className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm lg:text-base">Fast Delivery</h5>
                <p className="text-xs lg:text-sm text-gray-400">Quick and reliable shipping</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Shield className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm lg:text-base">Quality Assured</h5>
                <p className="text-xs lg:text-sm text-gray-400">Professional equipment</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm lg:text-base">Expert Support</h5>
                <p className="text-xs lg:text-sm text-gray-400">24/7 technical support</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto sm:mx-0">
                <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm lg:text-base">Customer Care</h5>
                <p className="text-xs lg:text-sm text-gray-400">Dedicated service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-xs lg:text-sm">
                &copy; 2024 AGROMONK. All rights reserved. | 
                <Link href="/terms" className="hover:text-primary-400 transition-colors ml-1">Terms of Service</Link> | 
                <Link href="/privacy" className="hover:text-primary-400 transition-colors ml-1">Privacy Policy</Link>
              </p>
            </div>
            <div className="flex items-center space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-400">
              <span>Made with ❤️ for farmers</span>
              <div className="flex items-center space-x-2">
                <span>Powered by</span>
                <span className="text-primary-400 font-semibold">AGROMONK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
