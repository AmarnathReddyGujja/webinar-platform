// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { uploadToGoogleCloud, bucket } = require('./config/storage');

const { env } = require('process');
require('dotenv').config();

const app = express();

// Middleware
// server.js (Backend)
app.use(cors({
  origin: ['http://localhost:5173', 'https://webnarland.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://usernmae:password@weinars.cy5mb.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Webinar Schema and Model
const webinarSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    organizedBy: { type: String, required: true },
    registrationLink: { type: String, required: true },
    pictureUrl: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Webinar = mongoose.model('Webinar', webinarSchema);

// Multer Setup for Image Uploads
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT Verification Error:', err);
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Update User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// User Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get user data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// Routes

// Get all webinars
app.get('/api/webinars', async (req, res) => {
    try {
        const webinars = await Webinar.find().sort({ date: 1 }); // Sort by date ascending
        res.json(webinars);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

// Add a new webinar (protected route)
app.post('/api/webinars', authenticateToken, upload.single('picture'), async (req, res) => {
  try {
    console.log('Received webinar creation request:', req.body);
    console.log('File:', {
      ...req.file,
      buffer: req.file ? `<Buffer of size ${req.file.buffer.length}>` : null
    });

    const { title, date, time, description, organizedBy, registrationLink } = req.body;
    let pictureUrl = '';

    if (req.file) {
      try {
        console.log('Uploading file to Google Cloud...');
        pictureUrl = await uploadToGoogleCloud(req.file);
        console.log('File uploaded successfully:', pictureUrl);
      } catch (uploadError) {
        console.error('Error uploading to Google Cloud:', uploadError);
        return res.status(500).json({ 
          message: 'Error uploading image', 
          error: uploadError.message,
          details: uploadError.stack
        });
      }
    }

    const newWebinar = new Webinar({
      title,
      date,
      time,
      description,
      organizedBy,
      registrationLink,
      pictureUrl,
      userId: req.user.id,
    });

    const savedWebinar = await newWebinar.save();
    console.log('Webinar saved successfully:', savedWebinar);
    res.status(201).json(savedWebinar);
  } catch (error) {
    console.error('Error adding webinar:', error);
    res.status(500).json({ 
      message: 'Error adding webinar', 
      error: error.message,
      details: error.stack 
    });
  }
});

// Delete a webinar (protected route)
app.delete('/api/webinars/:id', authenticateToken, async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this webinar' });
    }

    // Delete image from Google Cloud Storage if it exists
    if (webinar.pictureUrl) {
      await deleteFromGoogleCloud(webinar.pictureUrl);
    }

    await Webinar.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting webinar', error: error.message });
  }
});

// Get webinars for a specific user
app.get('/api/webinars/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to access these webinars' });
    }
    const webinars = await Webinar.find({ userId: userId }).sort({ date: 1 });
    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Add a new route to get user's webinars
app.get('/api/user/webinars', authenticateToken, async (req, res) => {
  try {
    const webinars = await Webinar.find({ userId: req.user.id });
    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user webinars', error: error.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add this function to delete file from Google Cloud Storage
const deleteFromGoogleCloud = async (pictureUrl) => {
    if (!pictureUrl) return;
    
    try {
        const fileName = pictureUrl.split('/').pop();
        const file = bucket.file(`webinars/${fileName}`);
        await file.delete();
    } catch (error) {
        console.error('Error deleting file from Google Cloud:', error);
    }
};
