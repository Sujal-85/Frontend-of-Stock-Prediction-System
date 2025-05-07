const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://frontend-of-stock-prediction-system.onrender.com',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root route (to avoid "Cannot GET /")
app.get('/', (req, res) => {
  res.send('🚀 Backend is running. Visit /api/auth for authentication routes.');
});

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
