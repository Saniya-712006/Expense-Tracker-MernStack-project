const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // User model

// Add an expense for a logged-in user
router.post('/add', async (req, res) => {
  try {
    const { userId, category, amount } = req.body;

    // Find user and update their expenses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.details.expenses.push({ category, amount });
    await user.save();

    res.status(200).json({ message: 'Expense added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
});

// Fetch all expenses for a logged-in user
router.get('/all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ expenses: user.details.expenses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// Delete a specific expense
router.delete('/delete/:userId/:expenseId', async (req, res) => {
  try {
    const { userId, expenseId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.details.expenses = user.details.expenses.filter(
      (expense) => expense._id.toString() !== expenseId
    );
    await user.save();

    res.status(200).json({ message: 'Expense deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
});

module.exports = router;
