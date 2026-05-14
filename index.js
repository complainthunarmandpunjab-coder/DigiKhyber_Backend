require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bankRoutes = require('./routes/bankRoutes')
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require('./routes/adminRoutes');
const config = require('./config/config');

const app = express();
const PORT = config.port;

const fs = require('fs');
try {
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
  }
  if (!fs.existsSync(path.join(__dirname, 'images'))) {
    fs.mkdirSync(path.join(__dirname, 'images'), { recursive: true });
  }
} catch (err) {
  console.warn("⚠️ Could not create directories (normal on Vercel):", err.message);
}



console.log("PORT",PORT);


// // CORS configuration
// const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   maxAge: 86400 // 24 hours
// };

// Apply CORS middleware
app.use(cors());

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


// Middleware to parse JSON bodies
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// MongoDB connection
mongoose.connect(config.mongodbUri)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Drop problematic indexes to resolve stale unique constraint issues
    try {
      const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
      if (collections.length > 0) {
        console.log('Cleaning up User collection indexes...');
        await mongoose.connection.db.collection('users').dropIndexes();
        console.log('Indexes dropped successfully.');
      }
    } catch (err) {
      console.warn('Note: Index cleanup skipped:', err.message);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => {
      mongoose.connect(config.mongodbUri).catch(() => {});
    }, 5000);
  });

// Handle disconnection gracefully (auto-reconnect)
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully!');
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Auth backend is running!');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/bank', bankRoutes); 
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
