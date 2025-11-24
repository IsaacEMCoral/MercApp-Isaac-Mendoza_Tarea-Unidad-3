const Product = require('../../models/Product');
const Category = require('../../models/Category');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function showCreateForm(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.render('products/form', { product: null, categories, old: {}, errors: [] });
  } catch (err) {
    next(err);
  }
}

async function showEditForm(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).render('error', { message: 'Producto no encontrado' });
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.render('products/form', { product, categories, old: {}, errors: [] });
  } catch (err) {
    next(err);
  }
}

async function listProducts(req, res) {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category && isObjectId(category)) filter.categoryId = category;
    const products = await Product.find(filter).populate('categoryId','name').sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listando productos' });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: 'ID inválido' });
    const p = await Product.findById(id).populate('categoryId','name').lean();
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, imageUrl, categoryId, stock, description } = req.body;
    const categories = await Category.find().sort({ name: 1 }).lean();

    const errors = [];
    if (!name || !name.trim()) errors.push({ param: 'name', msg: 'Nombre obligatorio' });
    if (!categoryId) errors.push({ param: 'categoryId', msg: 'Categoría obligatoria' });
    if (!price || Number(price) <= 0) errors.push({ param: 'price', msg: 'Precio debe ser mayor a 0' });

    if (errors.length) {
      return res.status(400).render('products/form', { product: null, categories, old: req.body, errors });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) errors.push({ param: 'price', msg: 'Precio debe ser > 0' });
        if (categoryId) {
      const cat = await Category.findById(categoryId).lean();
      if (!cat) errors.push({ param: 'categoryId', msg: 'Categoría inválida' });
    }

    if (errors.length) {
      const categories = await Category.find().lean();
      return res.status(400).render('products/form', { errors, old: req.body, categories, product: null });
    }

    const product = new Product({
      name: name.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      imageUrl: imageUrl || null,
      categoryId,
      stock: Number(stock) || 0
    });

    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.error('createProduct error:', err);
    if (err.name === 'ValidationError') {
      const categories = await Category.find().lean();
      const errors = Object.values(err.errors).map(e => ({ param: e.path, msg: e.message }));
      return res.status(400).render('products/form', { product: null, categories, old: req.body, errors });
    }
    next(err);
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: 'ID inválido' });
    const update = {};
    const allowed = ['name','description','price','imageUrl','categoryId','stock'];
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    if (update.categoryId && !isObjectId(update.categoryId)) return res.status(400).json({ error: 'categoryId inválido' });
    const p = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando producto' });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: 'ID inválido' });
    const p = await Product.findByIdAndDelete(id).lean();
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
