const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: { type: DataTypes.UUID, allowNull: false },
  provider: { type: DataTypes.STRING, allowNull: false }, // cash, gcash, maya, cod, card
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  transaction_ref: { type: DataTypes.STRING, allowNull: true },
  paid_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'payments',
  underscored: true,
  timestamps: true,
});

module.exports = Payment;
