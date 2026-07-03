const { StoreSetting } = require('../models');

async function getOrCreateSettings() {
  let settings = await StoreSetting.findByPk(1);
  if (!settings) {
    settings = await StoreSetting.create({ id: 1 });
  }
  return settings;
}

// GET /api/settings  (public — storefront can show store name/address/hours/open-closed)
async function getPublicSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      store_name: settings.store_name,
      address: settings.address,
      phone: settings.phone,
      logo_url: settings.logo_url,
      currency: settings.currency,
      delivery_fee: settings.delivery_fee,
      business_hours: settings.business_hours,
      is_store_open: settings.is_store_open,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/settings  (admin only — full settings)
async function getSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/settings  (admin only)
async function updateSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    const fields = [
      'store_name', 'address', 'phone', 'email', 'logo_url', 'currency',
      'delivery_fee', 'low_stock_default_threshold', 'business_hours',
      'receipt_footer_message', 'is_store_open',
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) settings[f] = req.body[f];
    });
    await settings.save();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublicSettings, getSettings, updateSettings };
