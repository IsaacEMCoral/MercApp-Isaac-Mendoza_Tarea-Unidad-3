const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('products/list', { products });
}

function showCreateForm(req, res) {
  res.render('products/form', { product: {}, errors: [] });
}

async function createProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('products/form', { product: req.body, errors: errors.array() });
  }
  const { name, sku, description, price, quantity } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;
  const product = new Product({ name, sku, description, price, quantity, image, createdBy: req.session.userId });
  await product.save();
  res.redirect('/products');
}

async function showEditForm(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/products');
  res.render('products/form', { product, errors: [] });
}

async function updateProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('products/form', { product: {...req.body, _id: req.params.id }, errors: errors.array() });
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect('/products');
  product.name = req.body.name;
  product.sku = req.body.sku;
  product.description = req.body.description;
  product.price = req.body.price;
  product.quantity = req.body.quantity;
  if (req.file) {
    if (product.image) {
      const oldPath = path.join(__dirname, '..', 'public', product.image);
      fs.unlink(oldPath, ()=>{});
    }
    product.image = `/uploads/${req.file.filename}`;
  }
  await product.save();
  res.redirect('/products');
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product && product.image) {
    const imgPath = path.join(__dirname, '..', 'public', product.image);
    fs.unlink(imgPath, ()=>{});
  }
  res.redirect('/products');
}

async function viewProduct(req, res) {
  const product = await Product.findById(req.params.id).populate('createdBy','username');
  if (!product) return res.redirect('/products');
  res.render('products/view', { product });
}

module.exports = { listProducts, showCreateForm, createProduct, showEditForm, updateProduct, deleteProduct, viewProduct };
