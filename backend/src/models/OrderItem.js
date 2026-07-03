const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: { type: DataTypes.UUID, allowNull: false },
  product_id: { type: DataTypes.UUID, allowNull: false },
  product_name: { type: DataTypes.STRING, allowNull: false }, // snapshot, in case product is edited/deleted later
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price_at_purchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  line_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'order_items',
  underscored: true,
  timestamps: true,
});

module.exports = OrderItem;
