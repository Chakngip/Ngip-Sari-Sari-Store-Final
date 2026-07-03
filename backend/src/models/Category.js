const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  icon_url: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'categories',
  underscored: true,
  timestamps: true,
});

module.exports = Category;
