const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { renderAddBlogPage,
  createNewBlog,
  renderBlogDetails, 
  addComment 
} = require('../controllers/blog');

// Multer configuration for file uploads
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


// Routes
router.route('/add-new')
.get( renderAddBlogPage )
.post( upload.single('coverImage'), createNewBlog );

router.get('/:id', renderBlogDetails );

router.post('/comment/:blogid', addComment );


module.exports = router;