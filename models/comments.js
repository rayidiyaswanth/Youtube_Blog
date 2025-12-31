const monogoose = require('mongoose');

const commentSchema = new monogoose.Schema({
  content: {
    type: String,
    required: true,
  },
  blogId: {
    type: monogoose.Schema.Types.ObjectId,
    ref: 'Blog',
  },
  author: {
    type: monogoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {timestamps: true});

const Comments = monogoose.model('Comments', commentSchema);
module.exports = Comments;