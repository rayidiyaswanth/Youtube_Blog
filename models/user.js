const {createHmac, randomBytes} = require('node:crypto');
const {Schema, model} = require('mongoose');
const { generateToken } = require('../services/auth');

const userSchema = new Schema({
  fullname: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  salt : { type: String },
  password: { type: String, required: true },
  profileImageUrl: { type: String , default: '/images/avatar.png' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
},{ timestamps: true });

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return;
  const salt = randomBytes(16).toString();
  const hash = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');
  user.salt = salt;
  user.password = hash;
});

userSchema.static('validatePasswordAndGenerateToken', async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');
  const enteredPasswordHash = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex');
  if (enteredPasswordHash !== user.password) throw new Error('Invalid password');
  const token = generateToken(user);
  return token;
});

const Users= model('User', userSchema);

module.exports = Users;