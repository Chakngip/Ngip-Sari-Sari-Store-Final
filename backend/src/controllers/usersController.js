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
      attributes: ['id', 'name', 'email', 'phone', 'role', 'delivery_address',"latitude","longitude","delivery_notes", 'is_active', 'createdAt'],
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

// GET /api/user/profile  
async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        "gcash_number",
        "delivery_address",
        "latitude",
        "longitude",
        "delivery_notes",
      ],
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PUT /api/user/profile
async function updateProfile(req, res, next) {
  try {
    const {
      name,
      phone,
      gcash_number,
      delivery_address,
      latitude,
      longitude,
      delivery_notes,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.phone = phone;
    user.gcash_number = gcash_number;
    user.delivery_address = delivery_address;
    user.latitude = latitude;
    user.longitude = longitude;
    user.delivery_notes = delivery_notes;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
}

const bcrypt = require("bcryptjs");

async function changePassword(req, res, next) {
  try {
    const {
      current_password,
      new_password,
      confirm_password,
    } = req.body;

    if (
      !current_password ||
      !new_password ||
      !confirm_password
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const user = await User.findByPk(req.user.id);

    const valid = await bcrypt.compare(
      current_password,
      user.password_hash
    );

    if (!valid) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    user.password_hash = await bcrypt.hash(
      new_password,
      10
    );

    await user.save();

    res.json({
      message: "Password changed successfully.",
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, setUserStatus, updateTheme,  getProfile, updateProfile, changePassword, };
