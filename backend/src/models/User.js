const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },

  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },

  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM('customer', 'cashier', 'admin'),
    allowNull: false,
    defaultValue: 'customer',
  },

  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // ⭐ NEW
  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    allowNull: false,
    defaultValue: 'dark',
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

module.exports = User;