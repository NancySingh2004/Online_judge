const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io'); 
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const codeRoutes = require('./routes/codeRoutes.js');
const userRoutes = require("./routes/userRoutes");
const homeRoute = require('./routes/homeRoute');
const submissionRoutes = require('./routes/submission');

dotenv.config();







const app = express();
connectDB();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
// Socket.IO connection
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);
});

// Make io accessible in routes
app.set("io", io);

app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/code', codeRoutes);
app.use("/api/user", userRoutes);
app.use('/api', homeRoute);
app.use('/api/submissions', submissionRoutes);
const aiReviewRoutes = require("./routes/aiReviewRoutes");
app.use("/api/gemini", aiReviewRoutes);




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));