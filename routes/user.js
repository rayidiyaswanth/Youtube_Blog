const express = require('express');
const router = express.Router();
const Users = require('../models/user');

router.get('/signup', async (req, res) => {
  return res.render('signup');
});

router.post('/signup', async (req, res) => {  
  try {
    const { fullname, email, password } = req.body;
    await Users.create({ fullname, email, password });
    return res.redirect('/');
  } catch (error) {
    console.error('Error during user signup:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/signin', async (req, res) => {
  return res.render('signin');
});

router.post('/signin', async (req, res) => {  
  try {
    const { email, password } = req.body;
    const token = await Users.validatePasswordAndGenerateToken(email, password);
    return res.cookie('auth_token', token, { httpOnly: true }).redirect('/');
  } catch (error) {
    console.error('Error during user signin:', error);
    return res.status(500).render('signin', { error: 'Invalid email or password' });
  }
});

router.get('/logout', async (req, res) => {  
  return res.clearCookie('auth_token').redirect('/');
});

module.exports = router;