const { Product, Category } = require('../models');
const { Op } = require('sequelize');

// GET /api/products?search=&category_id=&barcode=
async function listProducts(req, res, next) {
  try {
    const {
      search,
      category_id,
      barcode,
      active_only,
    } = req.query;

    const where = {};

    // Search by product name OR barcode
    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          barcode: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // Category Filter
    if (category_id && category_id !== "all") {
      where.category_id = category_id;
    }

    // Barcode Scanner
    if (barcode) {
      where.barcode = barcode;
    }

    // Active Products Only
    if (active_only === "true") {
      where.is_active = true;
    }

    const products = await Product.findAll({
      where,

      attributes: [
        "id",
        "name",
        "price",
        "stock_qty",
        "image_url",
        "barcode",
        "category_id",
        "is_active",
      ],

      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],

      order: [["name", "ASC"]],
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

//Barcode generator
async function generateUniqueBarcode() {
  while (true) {
    // Generate a 13-digit barcode
    const barcode =
      Date.now().toString() +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

    const existing = await Product.findOne({
      where: { barcode },
    });

    if (!existing) {
      return barcode;
    }
  }
}
async function generateBarcode(req, res, next) {
  try {
    const barcode = await generateUniqueBarcode();

    res.json({
      barcode,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/products  (admin only)
async function createProduct(req, res, next) {
  try {
    const {
      name,
      description,
      barcode,
      price,
      stock_qty,
      low_stock_threshold,
      image_url,
      category_id,
    } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ message: 'name and price are required' });
    }

    const product = await Product.create({
      name, description, barcode, price, stock_qty: stock_qty || 0,
      low_stock_threshold, image_url, category_id,
      created_by: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id  (admin only)
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = [
      'name',
      'description',
      'barcode',
      'price', 
      'low_stock_threshold',
      'image_url',
      'category_id',
      'is_active',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) product[f] = req.body[f];
    });

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id  (admin only) — soft delete via is_active
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.is_active = false;
    await product.save();
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/low-stock  (admin only)
async function lowStockProducts(req, res, next) {
  try {
    const products = await Product.findAll({ where: { is_active: true } });
    const lowStock = products.filter((p) => p.stock_qty <= p.low_stock_threshold);
    res.json(lowStock);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct, lowStockProducts, generateBarcode
};
