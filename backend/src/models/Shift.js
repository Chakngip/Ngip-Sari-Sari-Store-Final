const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shift = sequelize.define('Shift', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cashier_id: { type: DataTypes.UUID, allowNull: false },
  opening_cash: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  closing_cash: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  expected_cash: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // opening_cash + cash sales
  cash_variance: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // closing_cash - expected_cash
  total_sales: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
  opened_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  closed_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'shifts',
  underscored: true,
  timestamps: true,
});

module.exports = Shift;
