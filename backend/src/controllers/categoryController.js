const { Category } = require('../models');

// GET all categories
async function listCategories(req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// CREATE category
async function createCategory(req, res, next) {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

// UPDATE category
async function updateCategory(req, res, next) {
  try {
    const { name } = req.body;

    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });

    category.name = name || category.name;
    await category.save();

    res.json(category);
  } catch (err) {
    next(err);
  }
}

// DELETE category
async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};