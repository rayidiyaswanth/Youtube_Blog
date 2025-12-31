const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { checkForAuthToken } = require('./middlewares/auth');

const Blogs = require('./models/blogs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/blogApp').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();
const port = 3000;

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware to serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(checkForAuthToken('auth_token'));

// Routes
app.get('/', async (req, res) => {
  const blogs = await Blogs.find().populate('author').sort({ createdAt: -1 });
  res.render('home', { user: req.user, blogs });
});
app.use('/user', userRoutes);
app.use('/blogs', blogRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});