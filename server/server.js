require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problemRoutes');
const codeRoutes = require('./routes/codeRoutes.js');
const userRoutes = require("./routes/userRoutes");
const homeRoute = require('./routes/homeRoute');
const submissionRoutes = require('./routes/submission');









const app = express();
app.use(cors());
app.use(express.json());




app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/code', codeRoutes);
app.use("/api/user", userRoutes);
app.use('/api', homeRoute);
app.use('/api/submissions', submissionRoutes);
const aiReviewRoutes = require("./routes/aiReviewRoutes");
app.use("/api/gemini", aiReviewRoutes);



const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));