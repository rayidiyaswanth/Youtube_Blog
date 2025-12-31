const Users = require('../models/user');

async function signupUser(req, res) {  
  try {
    const { fullname, email, password } = req.body;
    await Users.create({ fullname, email, password });
    return res.redirect('/');
  } catch (error) {
    console.error('Error during user signup:', error);
    return res.status(500).send('Internal Server Error');
  }
};

async function signinUser(req, res) {  
  try {
    const { email, password } = req.body;
    const token = await Users.validatePasswordAndGenerateToken(email, password);
    return res.cookie('auth_token', token, { httpOnly: true }).redirect('/');
  } catch (error) {
    console.error('Error during user signin:', error);
    return res.status(500).render('signin', { error: 'Invalid email or password' });
  }
}

async function logoutUser(req, res) {  
  return res.clearCookie('auth_token').redirect('/');
}

module.exports = {
  signupUser,
  signinUser,
  logoutUser,
};