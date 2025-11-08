# AgroMonk - Modern Responsive eCommerce Website

A fully modern, responsive eCommerce website built with Next.js 14, TypeScript, and Tailwind CSS, featuring a beautiful design system and mobile-first approach.

## 🚀 Features

### Modern Design System
- **Custom Color Palette**: Primary green theme with comprehensive color scales
- **Typography**: Inter font with optimized font loading and display swap
- **Shadows & Effects**: Soft, medium, large, and glow shadow variants
- **Animations**: Smooth transitions, hover effects, and scroll animations
- **Glass Morphism**: Modern glass effects with backdrop blur

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes (xs: 475px to 3xl: 1920px)
- **Flexible Grid System**: Custom responsive grid components
- **Adaptive Navigation**: Collapsible mobile menu with smooth animations
- **Touch-Friendly**: Optimized for mobile interactions

### Modern Components
- **Modern Header**: Sticky navigation with search, cart, and user menu
- **Modern Footer**: Comprehensive footer with social links and features
- **Product Grid**: Responsive product display with hover effects
- **Category Grid**: Flexible category layout
- **Loading States**: Beautiful loading animations and skeletons
- **Modal System**: Accessible modals with backdrop blur
- **Toast Notifications**: Modern notification system
- **Carousel**: Touch-friendly image carousel

### Performance Optimizations
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Inter font with display swap
- **CSS Optimization**: Tailwind CSS with purged unused styles
- **Component Lazy Loading**: Dynamic imports for better performance
- **Smooth Scrolling**: CSS scroll-behavior for better UX

## 🎨 Design Features

### Color System
```css
Primary Colors:
- 50: #f0fdf4 (Lightest)
- 500: #22c55e (Main)
- 600: #16a34a (Primary)
- 900: #14532d (Darkest)

Secondary Colors:
- Gray scale from 50 to 950
- Semantic colors for success, error, warning
```

### Typography Scale
- **Display**: Large headings (3xl to 9xl)
- **Body**: Optimized line heights and spacing
- **Small**: Compact text for captions and labels

### Spacing System
- **Consistent**: 4px base unit with logical scale
- **Responsive**: Different spacing for different screen sizes
- **Semantic**: Meaningful spacing classes

## 📱 Responsive Breakpoints

```css
xs: 475px   - Extra small devices
sm: 640px   - Small devices
md: 768px   - Medium devices
lg: 1024px  - Large devices
xl: 1280px  - Extra large devices
2xl: 1536px - 2X large devices
3xl: 1920px - 3X large devices
```

## 🧩 Component Architecture

### Layout Components
- `ModernNavigation`: Responsive header with search and user menu
- `ModernFooter`: Comprehensive footer with links and features
- `ResponsiveGrid`: Flexible grid system for different layouts

### UI Components
- `Button`: Multiple variants (primary, secondary, outline, gradient, glass)
- `Card`: Modern card components with hover effects
- `Input`: Enhanced input fields with icons and validation
- `Modal`: Accessible modal system
- `Toast`: Notification system
- `Loading`: Various loading states and animations

### Utility Components
- `Carousel`: Touch-friendly image carousel
- `LoadingSpinner`: Animated loading indicators
- `LoadingSkeleton`: Content placeholders

## 🎯 Key Features

### Hero Section
- **Gradient Background**: Beautiful gradient overlays
- **Floating Elements**: Animated background elements
- **Call-to-Action**: Prominent action buttons
- **Statistics**: Key metrics display

### Product Display
- **Hover Effects**: Smooth image scaling and overlays
- **Quick Actions**: WhatsApp and call buttons
- **Responsive Grid**: Adapts to screen size
- **Loading States**: Skeleton loading for better UX

### Navigation
- **Sticky Header**: Stays visible while scrolling
- **Search Integration**: Real-time search functionality
- **User Menu**: Dropdown with user options
- **Mobile Menu**: Collapsible navigation for mobile

### Footer
- **Multi-Column Layout**: Organized information
- **Social Links**: Integrated social media
- **Feature Highlights**: Key selling points
- **Contact Information**: Complete contact details

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Inter font family
- **State Management**: Zustand for client state
- **Image Handling**: Next.js Image optimization

## 📦 Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Install Tailwind Plugins**:
   ```bash
   npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🎨 Customization

### Colors
Update the color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    // ... more shades
  }
}
```

### Typography
Modify font settings in `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

### Components
All components are modular and can be easily customized by modifying the respective files in `src/components/ui/`.

## 📱 Mobile Optimization

- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Carousel supports touch swiping
- **Responsive Images**: Optimized for different screen densities
- **Fast Loading**: Optimized bundle size and lazy loading
- **Offline Support**: Service worker ready

## 🚀 Performance

- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Caching**: Optimized caching strategies

## 🔧 Development

### File Structure
```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable components
│   ├── ui/             # UI components
│   └── layout/         # Layout components
├── lib/                # Utility functions
├── store/              # State management
└── types/              # TypeScript types
```

### Component Guidelines
- Use TypeScript for all components
- Follow the established design system
- Implement proper accessibility
- Optimize for performance
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: info@agromonk.com
- Phone: +91 9166244141
- Website: [AgroMonk](https://agromonk.com)

---

Built with ❤️ for fresh organic products
