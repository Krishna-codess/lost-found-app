const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Add this home route
app.get('/', (req, res) => {
  res.json({ message: 'Lost and Found API is running!' });
});

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Protected dashboard route
app.get('/dashboard', require('./middleware/auth'), (req, res) => {
  res.json({ message: 'Welcome to dashboard', userId: req.user.id });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.log(err));