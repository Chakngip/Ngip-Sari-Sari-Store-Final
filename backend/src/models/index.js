const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Shift = require('./Shift');
const StockMovement = require('./StockMovement');
const StoreSetting = require('./StoreSetting');

// Category -> Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// User -> Product (created_by admin)
User.hasMany(Product, { foreignKey: 'created_by' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// User (customer) -> Order
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

// User (cashier) -> Order
User.hasMany(Order, { foreignKey: 'cashier_id', as: 'posSales' });
Order.belongsTo(User, { foreignKey: 'cashier_id', as: 'cashier' });

// Shift -> Order
Shift.hasMany(Order, { foreignKey: 'shift_id' });
Order.belongsTo(Shift, { foreignKey: 'shift_id' });

// User (cashier) -> Shift
User.hasMany(Shift, { foreignKey: 'cashier_id' });
Shift.belongsTo(User, { foreignKey: 'cashier_id', as: 'cashier' });

// Order -> OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Product -> OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Order -> Payment
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// Product -> StockMovement
Product.hasMany(StockMovement, { foreignKey: 'product_id' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id' });

// User -> StockMovement (who made the change)
User.hasMany(StockMovement, { foreignKey: 'created_by' });
StockMovement.belongsTo(User, { foreignKey: 'created_by', as: 'actor' });

// Order -> StockMovement (optional reference)
Order.hasMany(StockMovement, { foreignKey: 'reference_order_id' });
StockMovement.belongsTo(Order, { foreignKey: 'reference_order_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Payment,
  Shift,
  StockMovement,
  StoreSetting,
};
