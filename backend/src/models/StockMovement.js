const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  product_id: { type: DataTypes.UUID, allowNull: false },
  quantity_change: { type: DataTypes.INTEGER, allowNull: false }, // negative = stock out, positive = stock in
  resulting_stock: { type: DataTypes.INTEGER, allowNull: false }, // stock_qty snapshot after this movement
  type: {
    type: DataTypes.ENUM('restock', 'adjustment', 'sale', 'void', 'online_order', 'online_cancel'),
    allowNull: false,
  },
  note: { type: DataTypes.STRING, allowNull: true },
  reference_order_id: { type: DataTypes.UUID, allowNull: true },
  created_by: { type: DataTypes.UUID, allowNull: true }, // admin/cashier who triggered it
}, {
  tableName: 'stock_movements',
  underscored: true,
  timestamps: true,
  updatedAt: false,
});

module.exports = StockMovement;
