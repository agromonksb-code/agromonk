# E-Commerce Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Git

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 2. Environment Setup

#### Backend Environment
1. Copy `backend/config.example.env` to `backend/.env`
2. Update the following variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

#### Frontend Environment
1. Copy `frontend/env.example` to `frontend/.env.local`
2. Update the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=E-Commerce Store
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string
6. Update the `MONGODB_URI` in your backend `.env` file

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## 📁 Project Structure

```
ecommerce-fullstack/
├── frontend/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/            # Utilities and API client
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── types/          # Shared types
│   └── package.json
└── package.json            # Root package.json
```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run install:all` - Install all dependencies

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Backend
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server

## 🎯 Features Implemented

### Frontend Features
- ✅ Modern UI with Tailwind CSS
- ✅ Product catalog with search and filtering
- ✅ Shopping cart functionality
- ✅ User authentication (login/register)
- ✅ Responsive design
- ✅ State management with Zustand
- ✅ TypeScript support

### Backend Features
- ✅ RESTful API with NestJS
- ✅ JWT authentication
- ✅ MongoDB integration with Mongoose
- ✅ User management
- ✅ Product management
- ✅ Order management
- ✅ Input validation
- ✅ CORS configuration

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Database
- MongoDB Atlas provides automatic scaling and backup

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend `.env`
   - Check that frontend is running on the correct port

2. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Check that your IP is whitelisted
   - Ensure database user has proper permissions

3. **Build Errors**
   - Run `npm run install:all` to ensure all dependencies are installed
   - Check that all environment variables are set

4. **Authentication Issues**
   - Verify JWT_SECRET is set in backend `.env`
   - Check that tokens are being stored in localStorage

## 📝 Next Steps

1. Add product images upload functionality
2. Implement payment integration (Stripe/PayPal)
3. Add email notifications
4. Implement admin dashboard
5. Add product reviews and ratings
6. Implement wishlist functionality
7. Add order tracking
8. Implement search with filters
9. Add product categories management
10. Implement inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
