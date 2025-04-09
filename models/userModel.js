const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true,match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] },
  password: { type: String, required: true },
  details: {
    expenses: [{ category: String, amount: Number }],
    settings: { type: Object, default: {} },
    ratings: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
