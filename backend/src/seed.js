require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Product, StoreSetting } = require('./models');

async function seed() {
  await sequelize.sync({ alter: true });

  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    const password_hash = await bcrypt.hash('admin12345', 10);
    await User.create({
      name: 'Store Admin',
      email: '[email protected]',
      password_hash,
      role: 'admin',
    });
    console.log('✅ Admin created: [email protected] / admin12345 (change this immediately)');
  }

  const [snacks] = await Category.findOrCreate({ where: { name: 'Snacks' } });
  const [beverages] = await Category.findOrCreate({ where: { name: 'Beverages' } });

  await Product.findOrCreate({
    where: { name: 'Piattos 40g' },
    defaults: { price: 25, stock_qty: 50, category_id: snacks.id, barcode: '4800016642125' },
  });
  await Product.findOrCreate({
    where: { name: 'Coke 1.5L' },
    defaults: { price: 65, stock_qty: 30, category_id: beverages.id, barcode: '4902102079303' },
  });

  await StoreSetting.findOrCreate({
    where: { id: 1 },
    defaults: {
      store_name: 'Ngip Sari-Sari Store',
      address: '123 Sample St., Cebu City, PH',
      phone: '0917-000-0000',
      currency: 'PHP',
      business_hours: 'Mon-Sun 7:00 AM - 10:00 PM',
    },
  });

  console.log('✅ Sample categories & products seeded');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
