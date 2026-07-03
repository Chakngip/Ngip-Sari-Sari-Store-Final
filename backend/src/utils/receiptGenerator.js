const { Order } = require('../models');
const { Op } = require('sequelize');

/**
 * Generates a receipt number in the format OR-YYYYMMDD-####
 * where #### is a sequential count of orders created today.
 */
async function generateReceiptNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const dateStr = `${y}${m}${d}`;

  const startOfDay = new Date(y, now.getMonth(), now.getDate());
  const endOfDay = new Date(y, now.getMonth(), now.getDate() + 1);

  const countToday = await Order.count({
    where: { createdAt: { [Op.gte]: startOfDay, [Op.lt]: endOfDay } },
  });

  const seq = String(countToday + 1).padStart(4, '0');
  return `OR-${dateStr}-${seq}`;
}

/**
 * Builds a structured receipt payload (used for print/SMS/email/PDF)
 * from an Order + its items + payment + cashier info.
 */
function buildReceiptPayload(order, items, cashierName, shiftLabel) {
  return {
    storeName: 'Ngip Sari-Sari Store',
    receiptNumber: order.receipt_number,
    date: order.createdAt,
    cashier: cashierName || 'Online Order',
    shift: shiftLabel || null,
    items: items.map((i) => ({
      name: i.product_name,
      qty: i.quantity,
      price: Number(i.price_at_purchase),
      lineTotal: Number(i.line_total),
    })),
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    total: Number(order.total_amount),
    paymentMethod: order.payment_method,
    amountTendered: order.amount_tendered ? Number(order.amount_tendered) : null,
    change: order.change_due ? Number(order.change_due) : null,
  };
}

module.exports = { generateReceiptNumber, buildReceiptPayload };
