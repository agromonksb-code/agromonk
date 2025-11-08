# AGROMONK - Fresh Organic Products Platform

A full-stack e-commerce platform for fresh organic products with WhatsApp integration and admin panel.

## Features

- 🛒 **Product Catalog**: Browse categories and products with beautiful UI
- 📱 **WhatsApp Integration**: Direct WhatsApp messaging for product inquiries
- 📞 **Call Integration**: One-click calling functionality
- 👨‍💼 **Admin Panel**: Complete product and category management
- 🔐 **Authentication**: JWT-based admin authentication
- 📊 **Real-time Updates**: Live product and category management
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **NestJS** with TypeScript
- **MongoDB** with Mongoose
- **JWT** authentication
- **Class Validator** for DTOs
- **Passport JWT** for authentication

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromonk
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@agromonk.com
ADMIN_PASSWORD=admin123
```

5. Start the backend server:
```bash
npm run start:dev
```

6. Seed the database (optional):
```bash
node seed.js
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env.local
```

4. Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/init-admin` - Initialize admin user

### Categories
- `GET /api/categories` - Get all active categories
- `GET /api/categories/admin` - Get all categories (admin)
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin)
- `PATCH /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Products
- `GET /api/products` - Get all active products
- `GET /api/products?category=id` - Get products by category
- `GET /api/products?search=query` - Search products
- `GET /api/products/admin` - Get all products (admin)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

## Admin Panel

Access the admin panel at `/admin` with the following credentials:
- Email: `admin@agromonk.com`
- Password: `admin123`

### Admin Features
- ✅ Create, edit, and delete categories
- ✅ Create, edit, and delete products
- ✅ Manage product images and details
- ✅ Set WhatsApp messages and phone numbers
- ✅ Toggle product/category active status
- ✅ Real-time updates

## WhatsApp Integration

Each product can have:
- Custom WhatsApp message
- Phone number for contact
- One-click WhatsApp sharing

## Deployment

### Backend (NestJS)
1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm run start:prod
```

### Frontend (Next.js)
1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromonk
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@agromonk.com
ADMIN_PASSWORD=admin123
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=AgroMonk
NEXT_PUBLIC_APP_DESCRIPTION=Your trusted source for fresh organic products
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@agromonk.com or create an issue on GitHub.