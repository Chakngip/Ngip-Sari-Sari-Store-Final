const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoreSetting = sequelize.define('StoreSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1, // singleton row
  },
  store_name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Ngip Sari-Sari Store' },
  address: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  logo_url: { type: DataTypes.STRING, allowNull: true },
  currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PHP' },
  delivery_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  low_stock_default_threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  business_hours: { type: DataTypes.STRING, allowNull: true }, // e.g. "Mon-Sun 7:00 AM - 10:00 PM"
  receipt_footer_message: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Thank you, salamat po! Please come again.' },
  is_store_open: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // manual open/close toggle
}, {
  tableName: 'store_settings',
  underscored: true,
  timestamps: true,
});

module.exports = StoreSetting;
