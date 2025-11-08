const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agromonk';

const categories = [
  {
    name: 'Vegetables',
    description: 'Fresh organic vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Fruits',
    description: 'Fresh seasonal fruits',
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Grains',
    description: 'Organic grains and cereals',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'Spices',
    description: 'Aromatic spices and herbs',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    isActive: true,
    sortOrder: 4,
  },
];

const products = [
  {
    name: 'Organic Tomatoes',
    description: 'Fresh, juicy organic tomatoes perfect for salads and cooking',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91b4d4b8f2c0?w=400',
      'https://images.unsplash.com/photo-1546470427-5a4b0a5b5b5b?w=400',
    ],
    price: 120,
    originalPrice: 150,
    stock: 50,
    unit: 'kg',
    isActive: true,
    sortOrder: 1,
    whatsappMessage: 'Hi! I am interested in Organic Tomatoes. Please provide more details.',
    phoneNumber: '+919876543210',
    tags: ['organic', 'fresh', 'vegetables'],
  },
  {
    name: 'Fresh Mangoes',
    description: 'Sweet and juicy Alphonso mangoes',
    images: [
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400',
    ],
    price: 200,
    originalPrice: 250,
    stock: 30,
    unit: 'kg',
    isActive: true,
    sortOrder: 2,
    whatsappMessage: 'Hi! I want to buy Fresh Mangoes. What is the current price?',
    phoneNumber: '+919876543210',
    tags: ['fruits', 'mango', 'sweet'],
  },
  {
    name: 'Basmati Rice',
    description: 'Premium quality basmati rice',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    ],
    price: 180,
    originalPrice: 220,
    stock: 100,
    unit: 'kg',
    isActive: true,
    sortOrder: 3,
    whatsappMessage: 'Hi! I am interested in Basmati Rice. Is it available?',
    phoneNumber: '+919876543210',
    tags: ['rice', 'grains', 'premium'],
  },
  {
    name: 'Turmeric Powder',
    description: 'Pure turmeric powder for cooking and health',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    ],
    price: 80,
    originalPrice: 100,
    stock: 25,
    unit: '100g',
    isActive: true,
    sortOrder: 4,
    whatsappMessage: 'Hi! I need Turmeric Powder. What is the price?',
    phoneNumber: '+919876543210',
    tags: ['spices', 'turmeric', 'powder'],
  },
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    
    // Insert categories
    const categoryResult = await db.collection('categories').insertMany(categories);
    console.log(`Inserted ${categoryResult.insertedCount} categories`);
    
    // Get category IDs for products
    const insertedCategories = await db.collection('categories').find({}).toArray();
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    
    // Update products with category references
    const productsWithCategories = products.map(product => {
      let categoryId;
      if (product.name.includes('Tomato')) categoryId = categoryMap['Vegetables'];
      else if (product.name.includes('Mango')) categoryId = categoryMap['Fruits'];
      else if (product.name.includes('Rice')) categoryId = categoryMap['Grains'];
      else if (product.name.includes('Turmeric')) categoryId = categoryMap['Spices'];
      
      return { ...product, category: categoryId };
    });
    
    // Insert products
    const productResult = await db.collection('products').insertMany(productsWithCategories);
    console.log(`Inserted ${productResult.insertedCount} products`);
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();