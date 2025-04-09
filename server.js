require('dotenv').config();
const express = require('express');
const connectDB=require('./config/db');
const cors=require('cors');
const app=express();
connectDB();
app.use(express.json());
app.use(cors());
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/expenses',require('./routes/expenseRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
const PORT=5000;
app.listen(PORT,()=>console.log(`Server is up and running on port ${PORT}`));

