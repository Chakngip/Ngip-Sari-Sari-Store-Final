const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  receipt_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  user_id: { type: DataTypes.UUID, allowNull: true },       // customer (nullable for anonymous walk-in)
  cashier_id: { type: DataTypes.UUID, allowNull: true },    // set when order_source = pos
  shift_id: { type: DataTypes.UUID, allowNull: true },
  order_source: {
    type: DataTypes.ENUM('online', 'pos'),
    allowNull: false,
    defaultValue: 'online',
  },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'preparing', 'out_for_delivery', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'gcash', 'maya', 'card', 'cod'),
    allowNull: false,
    defaultValue: 'cash',
  },
  amount_tendered: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // cash given by customer (POS)
  change_due: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  delivery_address: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'orders',
  underscored: true,
  timestamps: true,
});

module.exports = Order;
