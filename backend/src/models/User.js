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
    allowNull: false,
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

  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    allowNull: false,
    defaultValue: 'dark',
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  gcash_number: {
  type: DataTypes.STRING,
  allowNull: true,
  },

  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },

  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },

  delivery_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },


}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

module.exports = User;