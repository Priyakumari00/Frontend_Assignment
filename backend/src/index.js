require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
app.use(express.json());
app.use(cookieParser());

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
