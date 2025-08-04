require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problemRoutes');
const codeRoutes = require('./routes/codeRoutes.js');
const userRoutes = require("./routes/userRoutes");
const homeRoute = require('./routes/homeRoute');







const app = express();
app.use(cors());
app.use(express.json());




app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/code', codeRoutes);
app.use("/api/user", userRoutes);
app.use('/api', homeRoute);




mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));