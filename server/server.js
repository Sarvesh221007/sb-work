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
app.use(cors());
app.use(express.json()); // Needed to parse JSON

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the React app
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => res.send('SB Works API running'));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes); // ✅ Use the corrected route and path



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
