require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // sync() auto-creates tables from models — fine for dev.
    // Use migrations (sequelize-cli) instead once you go to production.
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    app.listen(PORT, () => console.log(`🚀 Ngip API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Unable to start server:', err);
    process.exit(1);
  }
}

start();
