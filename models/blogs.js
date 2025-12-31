const moongoose = require('mongoose');

const blogSchema = new moongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  coverImageUrl: { type: String },
  author: { type: moongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Blogs = moongoose.model('Blog', blogSchema);

module.exports = Blogs;