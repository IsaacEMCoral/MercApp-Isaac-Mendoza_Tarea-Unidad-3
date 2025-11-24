const Category = require('../../models/Category');

async function listCategories(req, res) {
  try {
    const cats = await Category.find().sort({ name: 1 }).lean();
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listando categorías' });
  }
}

module.exports = { listCategories };
