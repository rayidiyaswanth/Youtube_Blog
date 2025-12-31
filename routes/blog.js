const express = require('express');
const router = express.Router();
const Blogs = require('../models/blogs');
const Comments = require('../models/comments');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(`./public/uploads/${req.user._id}`);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

router.route('/add-new')
.get( async (req, res) => {
  res.render('addBlog', { user: req.user });
})
.post( upload.single('coverImage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const coverImageUrl = `/uploads/${req.user._id}/${req.file.filename}`;
    const blog = await Blogs.create({ title, body, coverImageUrl, author: req.user._id });
    return res.redirect(`/blogs/${blog._id}`);
  } catch (error) {
    console.error('Error creating new blog:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id).populate('author');
    const comments = await Comments.find({ blogId: blog._id }).populate('author');
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    return res.render('blogDetails', { blog, user: req.user, comments });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post('/comment/:blogid', async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.blogid);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    await Comments.create({ content: req.body.content, blogId: blog._id, author: req.user._id });
    return res.redirect(`/blogs/${blog._id}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).send('Internal Server Error');
  }
});


module.exports = router;