const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// MongoDB connection string
const uri = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_db_new2';
const client = new MongoClient(uri);

// Tags data
const tags = [
  { _id: "656c0eb807d3e9dbe63afa90", name: "Pedas" },
  { _id: "656c0eb807d3e9dbe63afa91", name: "Populer" },
  { _id: "656c0eb807d3e9dbe63afa93", name: "Dingin" },
  { _id: "656c0eb807d3e9dbe63afa94", name: "Vegetarian" },
  { _id: "656c0eb807d3e9dbe63afa95", name: "Halal" }
];

// Categories data
const categories = [
  {
    _id: "656c0eb807d3e9dbe63afa89",
    name: "Makanan",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa95"]
  },
  {
    _id: "656c0eb807d3e9dbe63afa92",
    name: "Minuman",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  }
];

// Users data
const users = [
  {
    full_name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    token: []
  },
  {
    full_name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
    token: []
  },
  {
    full_name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
    token: []
  }
];

// Products data
const products = [
  {
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, udang, dan sayuran segar",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Mie Goreng Seafood",
    description: "Mie goreng dengan campuran seafood segar dan sayuran",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90"]
  },
  {
    name: "Es Teh Manis",
    description: "Teh manis segar dengan es batu",
    price: 8000,
    image_url: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Ayam Bakar",
    description: "Ayam bakar bumbu special dengan sambal dan lalapan",
    price: 45000,
    image_url: "https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu dan sirup coklat",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Gado-gado",
    description: "Sayuran segar dengan bumbu kacang dan kerupuk",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1512058533999-59d3c490ddb3?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Sate Ayam",
    description: "Sate ayam dengan bumbu kacang dan lontong",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Rendang Daging",
    description: "Daging sapi dimasak dengan rempah-rempah khas Padang",
    price: 50000,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Soto Ayam",
    description: "Sup ayam tradisional dengan bumbu kuning dan pelengkap",
    price: 30000,
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Bakso Spesial",
    description: "Bakso daging sapi dengan mie dan kuah kaldu",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Es Jeruk",
    description: "Jus jeruk segar dengan es batu",
    price: 12000,
    image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Capcay Seafood",
    description: "Tumis sayuran campur dengan seafood segar",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1512058533999-a3d718f1768f?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa94"]
  },
  {
    name: "Es Campur",
    description: "Campuran buah-buahan, cincau, dan sirup dengan susu",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Ayam Geprek",
    description: "Ayam goreng tepung yang digeprek dengan sambal pedas",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Es Kopi Susu",
    description: "Kopi susu dengan gula aren dan es batu",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Mie Kuah Spesial",
    description: "Mie dengan kuah kaldu, bakso, dan pelengkap",
    price: 32000,
    image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Smoothie Buah",
    description: "Smoothie dari campuran buah-buahan segar",
    price: 20000,
    image_url: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Nasi Uduk Komplit",
    description: "Nasi uduk dengan ayam goreng, tempe, dan sambal",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1512058533999-a3d718f1768f?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Lemon Tea",
    description: "Teh dengan perasan lemon segar dan es",
    price: 12000,
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Ikan Bakar",
    description: "Ikan bakar dengan sambal dan lalapan",
    price: 45000,
    image_url: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Sop Buntut",
    description: "Sop buntut sapi dengan kuah bening dan sambal",
    price: 55000,
    image_url: "https://images.unsplash.com/photo-1547928576-b822bc410bdf?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Thai Tea",
    description: "Teh Thailand dengan susu dan boba",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Nasi Campur Bali",
    description: "Nasi dengan berbagai lauk khas Bali",
    price: 38000,
    image_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa95"]
  }
];  

// Products data validation function
const validateProduct = (product) => {
  if (!product.name || !product.price || !product.category || !product.tags) {
    throw new Error(`Invalid product data for ${product.name}`);
  }
  if (typeof product.price !== 'number' || product.price <= 0) {
    throw new Error(`Invalid price for product ${product.name}`);
  }
  return product;
};

// Menu data (for navigation)
const menus = [
  {
    name: "Home",
    icon: "home",
    path: "/",
    role: ["admin", "user"]
  },
  {
    name: "Products",
    icon: "shopping-bag",
    path: "/products",
    role: ["admin", "user"]
  },
  {
    name: "Categories",
    icon: "tag",
    path: "/categories",
    role: ["admin"]
  },
  {
    name: "Tags",
    icon: "tags",
    path: "/tags",
    role: ["admin"]
  },
  {
    name: "Cart",
    icon: "shopping-cart",
    path: "/cart",
    role: ["user"]
  },
  {
    name: "Orders",
    icon: "list",
    path: "/orders",
    role: ["admin", "user"]
  },
  {
    name: "Users",
    icon: "users",
    path: "/users",
    role: ["admin"]
  }
];

async function seedDatabase() {
  try {
    console.log(`Attempting to connect to MongoDB with URL: ${uri}`);
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(process.env.DB_NAME || 'pos_db_new2');

    // Clear existing data
    await database.collection('tags').deleteMany({});
    await database.collection('categories').deleteMany({});
    await database.collection('users').deleteMany({});
    await database.collection('products').deleteMany({});
    await database.collection('menus').deleteMany({});
    console.log('Existing data cleared');

    // Insert tags
    const tagsResult = await database.collection('tags').insertMany(tags);
    console.log(`${tagsResult.insertedCount} tags inserted`);

    // Insert categories
    const categoriesResult = await database.collection('categories').insertMany(categories);
    console.log(`${categoriesResult.insertedCount} categories inserted`);

    // Insert users
    const usersResult = await database.collection('users').insertMany(users);
    console.log(`${usersResult.insertedCount} users inserted`);

    // Validate and insert products
    const validatedProducts = products.map(validateProduct);
    const productsResult = await database.collection('products').insertMany(validatedProducts);
    console.log(`${productsResult.insertedCount} products inserted`);

    // Insert menus
    const menusResult = await database.collection('menus').insertMany(menus);
    console.log(`${menusResult.insertedCount} menus inserted`);

    console.log('Database seeding completed successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
seedDatabase().catch(console.error);
