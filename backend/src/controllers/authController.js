const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({
        message: 'name, password, and email or phone are required',
      });
    }

    const existing = await User.findOne({
      where: email ? { email } : { phone },
    });

    if (existing) {
      return res.status(409).json({
        message: 'Account already exists',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password_hash,
      address,
      role: 'customer',
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        theme: user.theme,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, phone, password } = req.body;

    console.log("===== LOGIN =====");
    console.log("Request:", req.body);

    if (!password || (!email && !phone)) {
      return res.status(400).json({
        message: "password and email or phone are required",
      });
    }

    const user = await User.findOne({
      where: email ? { email } : { phone },
    });

    console.log("User:", user ? user.email : "NOT FOUND");

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    console.log("Password entered:", password);
    console.log("Password match:", match);

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        theme: user.theme,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'role',
        'delivery_address',
        'is_active',
        'theme',
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateTheme(req, res, next) {
  try {
    const { theme } = req.body;

    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({
        message: "Invalid theme",
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.theme = theme;

    await user.save();

    res.json({
      message: "Theme updated successfully",
      theme: user.theme,
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me,
  updateTheme,
};