const { User, Order } = require('../models');
const { Op } = require('sequelize');

async function updateTheme(req, res, next) {
  try {
    const { theme } = req.body;

    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({
        message: "Invalid theme",
      });
    }

    req.user.theme = theme;
    await req.user.save();

    res.json({
      message: "Theme updated",
      theme: req.user.theme,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users?role=&search=  (admin only)
async function listUsers(req, res, next) {
  try {
    const { role, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'role', 'address', 'is_active', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id  (admin only) — detail with order stats (customers only)
async function getUser(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'phone', 'role', 'address', 'is_active', 'createdAt'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let orderStats = null;
    if (user.role === 'customer') {
      const orders = await Order.findAll({ where: { user_id: user.id } });
      orderStats = {
        totalOrders: orders.length,
        totalSpent: orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + Number(o.total_amount), 0),
      };
    }

    res.json({ ...user.toJSON(), orderStats });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/users/:id/status  (admin only) — block/unblock any account
async function setUserStatus(req, res, next) {
  try {
    const { is_active } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate an admin account' });
    }

    user.is_active = !!is_active;
    await user.save();
    res.json({ message: 'User status updated', is_active: user.is_active });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, setUserStatus, updateTheme };
