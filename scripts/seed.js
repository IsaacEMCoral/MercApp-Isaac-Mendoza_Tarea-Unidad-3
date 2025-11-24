require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categoriesSeed = [
  { name: 'Electrónica' },
  { name: 'Hogar' },
  { name: 'Jardín' },
  { name: 'Deporte' }
];

const productsSeed = [
  { name: 'Auriculares Bluetooth', description: 'Sonido claro', price: 29.99, imageUrl: '/uploads/headphones.jpg', categoryName: 'Electrónica', stock: 25 },
  { name: 'Lámpara de Mesa', description: 'LED regulable', price: 19.9, imageUrl: '/uploads/lamp.jpg', categoryName: 'Hogar', stock: 12 },
  { name: 'Cortacésped Manual', description: 'Fácil de usar', price: 99.0, imageUrl: '/uploads/lawnmower.jpg', categoryName: 'Jardín', stock: 4 },
  { name: 'Pelota de Fútbol', description: 'Tamaño 5', price: 15.0, imageUrl: '/uploads/ball.jpg', categoryName: 'Deporte', stock: 50 },
  { name: 'Smartwatch', description: 'Monitor cardio', price: 79.0, imageUrl: '/uploads/watch.jpg', categoryName: 'Electrónica', stock: 10 },
  { name: 'Set de Utensilios', description: 'Acero inoxidable', price: 24.5, imageUrl: '/uploads/kitchen.jpg', categoryName: 'Hogar', stock: 20 },
  { name: 'Manguera Jardín', description: '20m flexible', price: 12.0, imageUrl: '/uploads/hose.jpg', categoryName: 'Jardín', stock: 15 },
  { name: 'Guantes de Entreno', description: 'Antideslizantes', price: 9.5, imageUrl: '/uploads/gloves.jpg', categoryName: 'Deporte', stock: 30 }
];

(async function seed(){
  try {
    await connectDB(process.env.MONGO_URI);
    await Category.deleteMany({});
    await Product.deleteMany({});

    const createdCats = {};
    for (const c of categoriesSeed) {
      const cat = await Category.create(c);
      createdCats[cat.name] = cat._id;
    }

    for (const p of productsSeed) {
      const categoryId = createdCats[p.categoryName] || Object.values(createdCats)[0];
      await Product.create({
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId,
        stock: p.stock
      });
    }

    console.log('Seed completo');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
