const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

// Route imports
const authRoutes = require('./routers/authRoutes');
const projectRoutes = require('./routers/projectRoutes');
const adminRoutes = require('./routers/adminRoutes');
const userRoutes = require('./routers/userRoutes');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json()); 
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Test endpoint
app.get('/api', (req, res) => res.send('✅ SB Works API running'));

// ✅ Serve frontend build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
