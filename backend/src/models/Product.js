const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  barcode: { type: DataTypes.STRING, allowNull: true, unique: true }, // for POS scan lookup
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock_qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  low_stock_threshold: { type: DataTypes.INTEGER, defaultValue: 5 },
  image_url: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  category_id: { type: DataTypes.UUID, allowNull: true },
  created_by: { type: DataTypes.UUID, allowNull: true }, // admin who added it
}, {
  tableName: 'products',
  underscored: true,
  timestamps: true,
});

module.exports = Product;
