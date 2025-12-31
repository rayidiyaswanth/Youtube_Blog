const express = require('express');
const router = express.Router();
const { signupUser,
  signinUser,
  logoutUser,
} = require('../controllers/users');

router.get('/signup', async (req, res) => {
  return res.render('signup');
});

router.get('/signin', async (req, res) => {
  return res.render('signin');
});

router.post('/signup', signupUser);

router.post('/signin', signinUser);

router.get('/logout', logoutUser);

module.exports = router;