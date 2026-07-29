const express = require('express');
const router = express.Router();
const { getAllOrders, markOrderCompleted } = require('../db');

// Very simple shared-password check. Good enough for a one-person business
// dashboard; not meant for a team with multiple logins.
function checkPassword(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect admin password.' });
  }
  next();
}

router.get('/admin/orders', checkPassword, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ error: 'Could not load orders.' });
  }
});

router.patch('/admin/orders/:id/complete', checkPassword, async (req, res) => {
  try {
    const order = await markOrderCompleted(req.params.id);
    res.json(order);
  } catch (err) {
    console.error('Admin complete error:', err);
    res.status(500).json({ error: 'Could not update order.' });
  }
});

module.exports = router;

