const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  chartData: [
    {
      category: {
        type: String, // Name of the category (e.g., "Housing")
        required: true,
      },
      value: {
        type: Number, // Expense value for the category
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
