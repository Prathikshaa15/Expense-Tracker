const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

// Middleware to check token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Add expense
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const expense = new Expense({ title, amount, category, userId: req.userId });
    await expense.save();
    res.json({ message: 'Expense added', expense });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get expenses
router.get('/', verifyToken, async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId });
  res.json(expenses);
});

// Delete expense
router.delete('/:id', verifyToken, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense deleted' });
});

module.exports = router;
