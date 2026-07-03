const { Shift, Order } = require('../models');
const { Op } = require('sequelize');

// POST /api/pos/shift/open  (cashier)
async function openShift(req, res, next) {
  try {
    const existingOpen = await Shift.findOne({
      where: { cashier_id: req.user.id, status: 'open' },
    });
    if (existingOpen) {
      return res.status(409).json({ message: 'You already have an open shift', shift: existingOpen });
    }

    const { opening_cash } = req.body;
    const shift = await Shift.create({
      cashier_id: req.user.id,
      opening_cash: opening_cash || 0,
      status: 'open',
      opened_at: new Date(),
    });
    res.status(201).json(shift);
  } catch (err) {
    next(err);
  }
}

// POST /api/pos/shift/close  (cashier)
async function closeShift(req, res, next) {
  try {
    const shift = await Shift.findOne({
      where: { cashier_id: req.user.id, status: 'open' },
    });
    if (!shift) return res.status(404).json({ message: 'No open shift found' });

    const { closing_cash } = req.body;

    const cashSales = await Order.sum('total_amount', {
      where: {
        shift_id: shift.id,
        payment_method: 'cash',
        status: { [Op.notIn]: ['cancelled'] },
      },
    }) || 0;

    const expected_cash = Number(shift.opening_cash) + Number(cashSales);
    const variance = closing_cash != null ? Number(closing_cash) - expected_cash : null;

    shift.closing_cash = closing_cash;
    shift.expected_cash = expected_cash;
    shift.cash_variance = variance;
    shift.status = 'closed';
    shift.closed_at = new Date();
    await shift.save();

    res.json(shift);
  } catch (err) {
    next(err);
  }
}

// GET /api/pos/shift/summary  (cashier's current or most recent shift)
async function shiftSummary(req, res, next) {
  try {
    const shift = await Shift.findOne({
      where: { cashier_id: req.user.id },
      order: [['opened_at', 'DESC']],
    });
    if (!shift) return res.status(404).json({ message: 'No shifts found' });

    const orders = await Order.findAll({
      where: { shift_id: shift.id, status: { [Op.notIn]: ['cancelled'] } },
      order: [['createdAt', 'ASC']],
    });

    const totalsByMethod = orders.reduce((acc, o) => {
      acc[o.payment_method] = (acc[o.payment_method] || 0) + Number(o.total_amount);
      return acc;
    }, {});

    res.json({
      shift,
      totalSales: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
      totalTransactions: orders.length,
      totalsByMethod,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/pos/shift/history  (cashier) — own past shifts
async function listMyShifts(req, res, next) {
  try {
    const shifts = await Shift.findAll({
      where: { cashier_id: req.user.id },
      order: [['opened_at', 'DESC']],
      limit: 100,
    });
    res.json(shifts);
  } catch (err) {
    next(err);
  }
}

module.exports = { openShift, closeShift, shiftSummary, listMyShifts };
